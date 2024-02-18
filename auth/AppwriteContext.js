import { Account, Client, Databases, Functions, ID, Storage } from "appwrite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SnackbarContext } from "../hooks/useSnackbar";
import { APPWRITE_PROJECT_ID, BACKEND_URL } from "@env"

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isInitiated: false,
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
  forgetPassword: async (email) => {},
  /**
   * 
   * @param {string} userId 
   * @param {string} secret 
   * @param {string} newPassword 
   * @param {string} confirmPassword 
   */
  resetPassword: async (userId, secret, newPassword, confirmPassword) => {},
});

export function AuthProvider({ children }) {
  const client = new Client().setEndpoint(BACKEND_URL).setProject(APPWRITE_PROJECT_ID);
  const account = new Account(client);
  const storage = new Storage(client);
  const databases = new Databases(client);
  const functions = new Functions(client);

  const { showSnackbar } = useContext(SnackbarContext);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isInitiated, setIsInitiated] = useState(false);

  const init = useCallback(async () => {
    try {
      const x = await account.get();
      setUser(x);
      setAuthenticated(true);
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
      showSnackbar(error.message);
    }
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
    } catch (error) {
      showSnackbar(error.message);
    }
  }, [])

  const logout = useCallback(async () => {
    await account.deleteSessions();
    setAuthenticated(false);
    setUser(null);
  }, [])

  const forgetPassword = useCallback(async (email) => {
    try {
      console.log(email)
      await account.createRecovery(email, location.origin+'/auth/reset-password');
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
      // auth functions
      signup,
      login,
      logout,
      forgetPassword,
      resetPassword,
    }),
    [user, isAuthenticated, isInitiated, signup, login, logout, forgetPassword, resetPassword]
  );
  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}