"use client";

import {
  Account,
  Client,
  Databases,
  Functions,
  ID,
  Storage,
} from "appwrite";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { APPWRITE_API } from "@/config-global";
import { toast } from "sonner";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { onMessage } from "firebase/messaging";
import { fetchToken, messaging } from "@/lib/firebase";
import { useRouter } from "next/navigation";

TimeAgo.addDefaultLocale(en);
export const timeAgo = new TimeAgo("en-US");

export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteAccount = new Account(appwriteClient);
export const appwriteFunction = new Functions(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);

// Function to get user name from cache or fetch from Appwrite
export const getUserName = async (userId) => {
  // Try to get from localStorage first
  const cachedName = localStorage.getItem(`user_name_${userId}`);
  if (cachedName) {
    return cachedName;
  }

  try {
    // If not in cache, fetch from Appwrite
    const response = await appwriteFunction.createExecution(
      APPWRITE_API.functions.sarthakAPI,
      JSON.stringify({ userId }),
      false,
      "/user/fetch/id"
    );
    const data = JSON.parse(response.responseBody);

    if (data.status === "success" && data.user?.name) {
      // Store in localStorage for future use
      localStorage.setItem(`user_name_${userId}`, data.user.name);
      return data.user.name;
    }
    return userId; // Fallback to userId if name not found
  } catch (error) {
    console.error("Error fetching user name:", error);
    return userId; // Fallback to userId
  }
};

async function getNotificationPermissionAndToken() {
  // Step 1: Check if Notifications are supported in the browser.
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notification");
    return null;
  }

  // Step 2: Check if permission is already granted.
  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  // Step 3: If permission is not denied, request permission from the user.
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.log("Notification permission not granted.");
  return null;
}

const initialState = {
  user: null,
  login: async () => { },
  logout: async () => { },
  updateProfileImage: async () => { },
};

const reducer = (state, action) => {
  if (action.type === "UPDATE") {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  return state;
};

export const AuthContext = createContext(initialState);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const subscriptionRef = useRef(null);
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState(null);
  const [token, setToken] = useState(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  const loadToken = async () => {
    if (isLoading.current) return;

    isLoading.current = true;
    const token = await getNotificationPermissionAndToken();

    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      console.info("Push Notifications issue - permission denied");
      isLoading.current = false;
      return;
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        alert("Notification was not set up for you, Refresh the page");
        console.info(
          "Push Notifications issue - unable to load token after 3 retries"
        );
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error("An error occurred while retrieving token. Retrying...");
      isLoading.current = false;
      await loadToken();
      return;
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(token);
    isLoading.current = false;
  };

  useEffect(() => {
    if ("Notification" in window) {
      loadToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return; // Exit if no token is available.

      try {
        let x = await appwriteAccount.get();
        if (x.$id) {
          const target = await appwriteAccount.createPushTarget(
            x.$id,
            token,
            "sarthak-fcm"
          );
        }
      } catch (error) {
        if (error.code === 409) {
          try {
            let x = await appwriteAccount.get();
            if (x.$id) {
              const target = await appwriteAccount.updatePushTarget(
                x.$id,
                token
              );
            }
          } catch (err1) {
            console.error("Error updating push target:", err1);
          }
        }
      }

      const m = await messaging();
      if (!m) return;

      // Step 9: Register a listener for incoming FCM messages.
      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== "granted") return;

        console.log("Foreground push notification received:", payload);
        const link = payload.fcmOptions?.link || payload.data?.link;

        if (link) {
          toast.info(
            `${payload.notification?.title}: ${payload.notification?.body}`,
            {
              action: {
                label: "Visit",
                onClick: () => {
                  const link = payload.fcmOptions?.link || payload.data?.link;
                  if (link) {
                    router.push(link);
                  }
                },
              },
            }
          );
        } else {
          toast.info(
            `${payload.notification?.title}: ${payload.notification?.body}`
          );
        }

        // --------------------------------------------
        // Disable this if you only want toast notifications.
        const n = new Notification(
          payload.notification?.title || "New message",
          {
            body: payload.notification?.body || "This is a new message",
            data: link ? { url: link } : undefined,
          }
        );

        // Step 10: Handle notification click event to navigate to a link if present.
        n.onclick = (event) => {
          event.preventDefault();
          const link = event.target?.data?.url;
          if (link) {
            router.push(link);
          } else {
            console.log("No link found in the notification payload");
          }
        };
        // --------------------------------------------
      });

      return unsubscribe;
    };

    let unsubscribe = null;

    setupListener().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub;
      }
    });

    return () => unsubscribe?.();
  }, [token, router, toast]);

  const unsubscribeFromUserUpdates = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current();
      subscriptionRef.current = null;
    }
  }, []);

  const init = useCallback(async () => {
    try {
      let x = await appwriteAccount.get();
      if (x.prefs?.photo) {
        x.prefs.photo = appwriteStorage.getFileView(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          x.prefs?.photo
        );
      }

      dispatch({
        type: "UPDATE",
        payload: { user: x },
      });

      // Set up subscription
      if (!subscriptionRef.current) {
        subscriptionRef.current = appwriteClient.subscribe(
          "account",
          (response) => {
            if (response.events.includes("users.*.update")) {
              init();
            }
          }
        );
      }
    } catch (error) {
      dispatch({
        type: "UPDATE",
        payload: { user: null },
      });
      unsubscribeFromUserUpdates();
    }
  }, [unsubscribeFromUserUpdates]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        await appwriteAccount.createEmailPasswordSession(email, password);
        const x = await appwriteAccount.get();
        if (x.prefs?.photo) {
          x.prefs.photo = appwriteStorage.getFileView(
            APPWRITE_API.buckets.sarthakDatalakeBucket,
            x.prefs?.photo
          );
        }

        try {
          const target = await appwriteAccount.createPushTarget(
            x.$id,
            token,
            "sarthak-fcm"
          );
        } catch (error) {
          if (error.code === 409) {
            try {
              const target = await appwriteAccount.updatePushTarget(
                x.$id,
                token
              );
            } catch (err1) {
              console.error("Error updating push target:", err1);
            }
          }
        }

        dispatch({
          type: "UPDATE",
          payload: { user: x },
        });

        // Set up subscription after successful login
        if (!subscriptionRef.current) {
          subscriptionRef.current = appwriteClient.subscribe(
            "account",
            (response) => {
              if (response.events.includes("users.*.update")) {
                init();
              }
            }
          );
        }

        toast.success("Successfully Logged In");
      } catch (error) {
        toast.error(error.message);
      }
    },
    [init]
  );

  const logout = useCallback(async () => {
    try {
      await appwriteAccount.deleteSessions();
      unsubscribeFromUserUpdates();
      dispatch({
        type: "UPDATE",
        payload: { user: null },
      });

      toast.success("Successfully Logged Out");
    } catch (error) {
      toast.error(error.message);
    }
  }, [unsubscribeFromUserUpdates]);

  const updateProfileImage = useCallback(async (file) => {
    try {
      const tempPrefs = await appwriteAccount.getPrefs();
      if (tempPrefs?.photo) {
        await appwriteStorage.deleteFile(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          tempPrefs?.photo
        );
      }
      const response = await appwriteStorage.createFile(
        APPWRITE_API.buckets.sarthakDatalakeBucket,
        ID.unique(),
        file
      );
      await appwriteAccount.updatePrefs({
        ...tempPrefs,
        photo: response.$id,
      });

      let x = await appwriteAccount.get();
      x.prefs.photo = appwriteStorage.getFileView(
        APPWRITE_API.buckets.sarthakDatalakeBucket,
        x.prefs?.photo
      );

      dispatch({
        type: "UPDATE",
        payload: { user: x },
      });

      toast.success("Successfully Updated profile image");
    } catch (e) {
      toast.error(e.message);
    }
  }, []);

  useEffect(() => {
    return () => {
      unsubscribeFromUserUpdates();
    };
  }, [unsubscribeFromUserUpdates]);

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      login,
      logout,
      updateProfileImage,
    }),
    [state.user, login, logout, updateProfileImage]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
