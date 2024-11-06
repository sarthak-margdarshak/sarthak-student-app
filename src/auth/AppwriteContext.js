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
import { APPWRITE_API } from "../config-global";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useLocales } from "../locales";
import { useThemeContext } from "../theme/useThemeContext";
import { Toast } from "react-native-toast-notifications";

TimeAgo.addDefaultLocale(en);
export const timeAgo = new TimeAgo("en-US");

export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteAccount = new Account(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);
export const appwriteFunctions = new Functions(appwriteClient);

export const AuthContext = createContext({
  user: null,
  studentProfile: null,
  isAuthenticated: false,
  isInitiated: false,
  signup: async (email, password, name) => {},
  login: async (email, password) => {},
  logout: async () => {},
  updateCart: async (id, action) => {},
  updateStudentProfile: async () => {},
});

export function AuthProvider({ children }) {
  const { currentLang, onChangeLang } = useLocales();
  const { customTheme, updateTheme } = useThemeContext();

  const { currentLang, onChangeLang } = useLocales();
  const { customTheme, updateTheme } = useThemeContext();

  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isInitiated, setIsInitiated] = useState(false);

  const init = useCallback(async () => {
    try {
      const x = await appwriteAccount.get();
      setUser(x);
      onChangeLang(x.prefs?.lang || currentLang);
      updateTheme(x.prefs?.theme || customTheme);
      onChangeLang(x.prefs?.lang || currentLang);
      updateTheme(x.prefs?.theme || customTheme);
      const y = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.students,
        x.$id
      );
      setStudentProfile(y);
      setAuthenticated(true);
    } catch (error) {
      setUser(null);
      setStudentProfile(null);
      setAuthenticated(false);
    }
    setIsInitiated(true);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const createStudentProfile = async (x) => {
    return await appwriteDatabases.createDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.students,
      x.$id,
      {
        name: x.name,
        email: x.email,
      },
      [Permission.update(Role.user(x.$id))]
    );
  };

  const signup = useCallback(async (email, password, name) => {
    try {
      await appwriteAccount.create(ID.unique(), email, password, name);
      await appwriteAccount.createEmailSession(email, password);
      const x = await appwriteAccount.get();
      // Create student document in database
      const y = await createStudentProfile(x);
      setUser(x);
      setStudentProfile(y);
      setAuthenticated(true);
      Toast.show("Successfully signed up", {
        type: "success",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    } catch (error) {
      Toast.show(error.message, {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await appwriteAccount.createEmailSession(email, password);
      const x = await appwriteAccount.get();

      // Create student profile, if not there
      const y = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.students,
        [Query.equal("email", email)]
      );
      if (y.total === 0) {
        await createStudentProfile(x);
      }

      setUser(x);
      setStudentProfile(
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.students,
          x.$id
        )
      );
      setAuthenticated(true);
      Toast.show("Successfully logged In", {
        type: "success",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    } catch (error) {
      Toast.show(error.message, {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await appwriteAccount.deleteSessions();
      // ToastAndroid.show("Successfully logged out.", ToastAndroid.SHORT);
      setAuthenticated(false);
      setUser(null);
      setStudentProfile(null);
    } catch (error) {
      // ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }, []);

  const updateCart = async (id, action) => {
    var cart = studentProfile?.cart;
    var changesRequired = false;
    var index = cart?.findIndex((value) => value === id);
    if (action >= 0) {
      if (index === -1) {
        cart.push(id);
        changesRequired = true;
      }
    } else {
      if (index !== -1) {
        cart.splice(index, 1);
        changesRequired = true;
      }
    }
    if (changesRequired) {
      try {
        const x = await appwriteDatabases.updateDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.students,
          user?.$id,
          {
            cart: cart,
          }
        );
        setStudentProfile(x);
      } catch (error) {
        // ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
    }
  };

  const updateStudentProfile = async () => {
    const x = await appwriteDatabases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.students,
      studentProfile?.$id
    );
    setStudentProfile(x);
  };

  const memoizedValue = useMemo(
    () => ({
      user: user,
      studentProfile: studentProfile,
      isAuthenticated: isAuthenticated,
      isInitiated: isInitiated,
      // auth functions
      signup,
      login,
      logout,
      updateCart,
      updateStudentProfile,
    }),
    [
      user,
      studentProfile,
      isAuthenticated,
      isInitiated,
      signup,
      login,
      logout,
      updateCart,
      updateStudentProfile,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
