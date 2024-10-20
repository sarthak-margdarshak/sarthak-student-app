import { useFonts } from "expo-font";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import LoadingScreen from "../components/LoadingScreen";
import NetInfo from "@react-native-community/netinfo";
import { useToast } from "react-native-toast-notifications";
import { NoNetworkLight } from "../components/SVG/NoNetworkLight";
import { Dimensions, View } from "react-native";
import { Text } from "react-native-paper";

export const ThemeContext = createContext({
  customTheme: "system_default",
  updateTheme: (newTheme) => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system_default");
  const [isConnected, setConnected] = useState(-1);
  const toast = useToast();

  const [loaded, error] = useFonts({
    "Laila-Bold": require("../../public/assets/fonts/Laila-Bold.ttf"),
    "Laila-Light": require("../../public/assets/fonts/Laila-Light.ttf"),
    "Laila-Medium": require("../../public/assets/fonts/Laila-Medium.ttf"),
    "Laila-Regular": require("../../public/assets/fonts/Laila-Regular.ttf"),
    "Laila-SemiBold": require("../../public/assets/fonts/Laila-SemiBold.ttf"),
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected ? 1 : 0);
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  const updateTheme = useCallback((newTheme) => {
    if (newTheme === "light") {
      setTheme("light");
    } else if (newTheme === "dark") {
      setTheme("dark");
    } else {
      setTheme("system_default");
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      customTheme: theme,
      updateTheme: updateTheme,
    }),
    [theme, updateTheme]
  );

  if (!loaded || isConnected === -1) {
    return <LoadingScreen />;
  }

  if (isConnected === 0) {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NoNetworkLight />

          <Text
            variant="bodyLarge"
            style={{ fontFamily: "Laila-Regular", marginTop: 50 }}
          >
            No Network
          </Text>

          <Text
            variant="bodySmall"
            style={{ fontFamily: "Laila-Regular", marginTop: 10 }}
          >
            Please check your network connection
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={memoizedValue}>
      {children}
    </ThemeContext.Provider>
  );
}
