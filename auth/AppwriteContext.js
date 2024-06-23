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

import { Account, Client, Databases, Functions, ID, Storage } from "appwrite";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { APPWRITE_PROJECT_ID, BACKEND_URL } from "@env";
import { ToastAndroid, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";
import { lightTheme } from "../theme/lightTheme";
import { darkTheme } from "../theme/darkTheme";

export const appwriteClient = new Client()
  .setEndpoint(BACKEND_URL)
  .setProject(APPWRITE_PROJECT_ID);
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
      const x = await appwriteAccount.create(
        ID.unique(),
        email,
        password,
        name
      );
      setUser(x);
      setAuthenticated(true);
      ToastAndroid.show("Successfully signed up", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await appwriteAccount.createEmailSession(email, password);
      const x = await appwriteAccount.get();
      setUser(x);
      setAuthenticated(true);
      ToastAndroid.show("Successfully logged In", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
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
