"use client";

import {
  Account,
  Client,
  Databases,
  Functions,
  ID,
  Query,
  Storage,
} from "appwrite";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { APPWRITE_API } from "@/config-global";
import { toast } from "sonner";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
export const timeAgo = new TimeAgo("en-US");

export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteAccount = new Account(appwriteClient);
export const appwriteFunction = new Functions(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);

// Download a single mock test and its questions
export const downloadMockTest = async (mockTestId) => {
  // Fetch mock test details
  let mockTest = null;
  if (!localStorage.getItem(`mock_test_${mockTestId}`)) {
    mockTest = await appwriteDatabases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.mockTest,
      mockTestId,
      [
        Query.select([
          "$id",
          "name",
          "description",
          "level",
          "questions",
          "duration",
        ]),
      ]
    );
    localStorage.setItem(`mock_test_${mockTestId}`, JSON.stringify(mockTest));
  } else {
    mockTest = JSON.parse(localStorage.getItem(`mock_test_${mockTestId}`));
  }

  // Fetch questions without answers
  mockTest.questions.forEach(async (questionId) => {
    // Check if the question is already downloaded in local storage
    if (!localStorage.getItem(`question_${questionId}`)) {
      const question = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [
          Query.select([
            "$id",
            "qnId",
            "contentQuestion",
            "coverQuestion",
            "contentOptions",
            "coverOptions",
          ]),
        ]
      );

      if (question.coverQuestion) {
        question.coverQuestion = appwriteStorage.getFileView(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          question.coverQuestion
        );
      }

      for (let i in question.coverOptions) {
        if (question.coverOptions[i]) {
          question.coverOptions[i] = appwriteStorage.getFileView(
            APPWRITE_API.buckets.sarthakDatalakeBucket,
            question.coverOptions[i]
          );
        }
      }

      localStorage.setItem(`question_${questionId}`, JSON.stringify(question));
    }
  });
};

const initialState = {
  user: null,
  login: async () => {},
  logout: async () => {},
  updateProfileImage: async () => {},
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
        x.prefs.photo = appwriteStorage.getFilePreview(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          x.prefs?.photo,
          undefined,
          undefined,
          undefined,
          20
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
          x.prefs.photo = appwriteStorage.getFilePreview(
            APPWRITE_API.buckets.sarthakDatalakeBucket,
            x.prefs?.photo,
            undefined,
            undefined,
            undefined,
            20
          );
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
        if (error.code === 401) {
          toast.error(
            "Your account has been deactivated currently. You will be blocked from any personal access to the platform. You can re-activate your account by contacting the admin."
          );
        } else {
          toast.error(error.message);
        }
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
      x.prefs.photo = appwriteStorage.getFilePreview(
        APPWRITE_API.buckets.sarthakDatalakeBucket,
        x.prefs?.photo,
        undefined,
        undefined,
        undefined,
        20
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
