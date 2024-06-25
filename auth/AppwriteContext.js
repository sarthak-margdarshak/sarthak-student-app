/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 *
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 *
 */

import {
  Account,
  Client,
  Databases,
  Functions,
  ID,
  Permission,
  Query,
  Role,
  Storage,
} from "appwrite";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ToastAndroid } from "react-native";
import { APPWRITE_API } from "../config-global";

export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteAccount = new Account(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);
export const appwriteFunctions = new Functions(appwriteClient);

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isInitiated: false,
  signup: async (email, password, name) => {},
  login: async (email, password) => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isInitiated, setIsInitiated] = useState(false);

  const init = useCallback(async () => {
    try {
      const x = await appwriteAccount.get();
      setUser(x);
      setAuthenticated(true);
      ToastAndroid.show("Welcome back, " + x?.name, ToastAndroid.SHORT);
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
    }
    setIsInitiated(true);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const signup = useCallback(async (email, password, name) => {
    try {
      await appwriteAccount.create(ID.unique(), email, password, name);
      await appwriteAccount.createEmailSession(email, password);
      const x = await appwriteAccount.get();
      // Create student document in database
      await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.students,
        x.$id,
        {
          name: x.name,
          email: x.email,
        },
        [Permission.update(Role.user(x.$id))]
      );
      setUser(x);
      setAuthenticated(true);
      ToastAndroid.show("Successfully signed up", ToastAndroid.SHORT);
    } catch (error) {
      if (error.code === 409) {
        const y = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.adminUsers,
          [Query.equal("email", email)]
        );
        if (y.total !== 0) {
          ToastAndroid.show(
            "You are already an admin user of this platform. You can't have a student account.",
            ToastAndroid.SHORT
          );
        } else {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      // Check for only students
      const y = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.adminUsers,
        [Query.equal("email", email)]
      );
      if (y.total !== 0) {
        throw new Error(
          "You are an admin user of this platform. You can't login as a student."
        );
      }
      await appwriteAccount.createEmailSession(email, password);
      const x = await appwriteAccount.get();
      setUser(x);
      setAuthenticated(true);
      ToastAndroid.show("Successfully logged In", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await appwriteAccount.deleteSessions();
      ToastAndroid.show("Successfully logged out.", ToastAndroid.SHORT);
      setAuthenticated(false);
      setUser(null);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user: user,
      isAuthenticated: isAuthenticated,
      isInitiated: isInitiated,
      // auth functions
      signup,
      login,
      logout,
    }),
    [user, isAuthenticated, isInitiated, signup, login, logout]
  );
  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
