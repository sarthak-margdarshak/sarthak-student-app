import { Account, Client, Databases, Functions, ID, Storage } from "appwrite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SnackbarContext } from "../hooks/useSnackbar";
import { APPWRITE_PROJECT_ID, BACKEND_URL, LOCATION_HOST } from "@env"

export const client = new Client().setEndpoint(BACKEND_URL).setProject(APPWRITE_PROJECT_ID);
export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isInitiated: false,
  currentDashboardIndex: 0,
  setCurrentDashboardIndex: () => {},
  /**
   * 
   * @param {string} email 
   * @param {string} password 
   * @param {string} name 
   */
  signup: async (email, password, name) => { },
  /**
   * 
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => { },
  logout: async () => { },
  /**
   * 
   * @param {string} email 
   */
  forgetPassword: async (email) => { },
  /**
   * 
   * @param {string} userId 
   * @param {string} secret 
   * @param {string} newPassword 
   * @param {string} confirmPassword 
   */
  resetPassword: async (userId, secret, newPassword, confirmPassword) => { },
});

export function AuthProvider({ children }) {

  const { showSnackbar } = useContext(SnackbarContext);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isInitiated, setIsInitiated] = useState(false);
  const [currentDashboardIndex, setCurrentDashboardIndex] = useState(0);

  const init = useCallback(async () => {
    try {
      const x = await account.get();
      setUser(x);
      setAuthenticated(true);
      showSnackbar('Welcome back, '+x?.name)
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
      showSnackbar(error.message);
    }
    setCurrentDashboardIndex(0);
    setIsInitiated(true);
  }, [])

  useEffect(() => {
    init();
  }, [init])

  const signup = useCallback(async (email, password, name) => {
    try {
      const x = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      setUser(x);
      setAuthenticated(true);
      showSnackbar('Successfully signed up')
    } catch (error) {
      showSnackbar(error.message);
    }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      await account.createEmailSession(email, password);
      const x = await account.get();
      setUser(x);
      setAuthenticated(true);
      showSnackbar('Successfully logged In')
    } catch (error) {
      showSnackbar(error.message);
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await account.deleteSessions();
      showSnackbar('Successfully logged out.');
      setAuthenticated(false);
      setUser(null);
    } catch (error) {
      showSnackbar(error.message);
    }
  }, [])

  const forgetPassword = useCallback(async (email) => {
    try {
      await account.createRecovery(email, LOCATION_HOST + 'auth/reset-password');
      showSnackbar('Password reset link has been sent to your email. Happy to help you');
    } catch (error) {
      showSnackbar(error.message);
    }
  })

  const resetPassword = useCallback(async (userId, secret, newPassword, confirmPassword) => {
    try {
      await account.updateRecovery(
        userId,
        secret,
        newPassword,
        confirmPassword
      )
      showSnackbar('Password Reset Successfully')
    } catch (error) {
      showSnackbar(error.message);
    }
  })

  const memoizedValue = useMemo(
    () => ({
      user: user,
      isAuthenticated: isAuthenticated,
      isInitiated: isInitiated,
      currentDashboardIndex: currentDashboardIndex,
      setCurrentDashboardIndex: setCurrentDashboardIndex,
      // auth functions
      signup,
      login,
      logout,
      forgetPassword,
      resetPassword,
    }),
    [user, isAuthenticated, isInitiated, currentDashboardIndex, setCurrentDashboardIndex, signup, login, logout, forgetPassword, resetPassword]
  );
  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}