"use client";

import { Account, Client, Databases, Functions, ID, Storage } from "appwrite";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { APPWRITE_API } from "@/config-global";
import { toast } from "sonner";

export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteAccount = new Account(appwriteClient);
export const appwriteFunction = new Functions(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);

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
    } catch (error) {
      dispatch({
        type: "UPDATE",
        payload: { user: null },
      });
    }
  }, []);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
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

      toast.success("Successfully Logged In");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await appwriteAccount.deleteSessions();

      dispatch({
        type: "UPDATE",
        payload: { user: null },
      });

      toast.success("Successfully Logged Out");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

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
