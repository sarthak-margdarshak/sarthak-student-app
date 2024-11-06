<<<<<<< HEAD:src/theme/ThemeContext.js
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
import { NoNetworkLight } from "../components/SVG/NoNetworkLight";
import { Dimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { lightTheme } from "./lightTheme";
=======
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

import { createContext, useCallback, useMemo, useState } from "react";
>>>>>>> dev:theme/ThemeContext.js

export const ThemeContext = createContext({
  customTheme: "system_default",
  updateTheme: (newTheme) => {},
});

export function ThemeProvider({ children }) {
<<<<<<< HEAD:src/theme/ThemeContext.js
  const [themeLite, setThemeLite] = useState("system_default");
  const [isConnected, setConnected] = useState(-1);

  const theme = useTheme();
  theme.colors = lightTheme.colors;
  theme.dark = false;

  // const { customTheme } = useThemeContext();
  // const defaultColorScheme = useColorScheme();
  // if (customTheme === "dark") {
  //   theme.colors = darkTheme.colors;
  //   theme.dark = true;
  // } else if (customTheme === "light") {
  //   theme.colors = lightTheme.colors;
  //   theme.dark = false;
  // } else {
  //   if (defaultColorScheme === "dark") {
  //     theme.colors = darkTheme.colors;
  //     theme.dark = true;
  //   } else {
  //     theme.colors = lightTheme.colors;
  //     theme.dark = false;
  //   }
  // }

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
  }, []);

  const updateTheme = useCallback((newTheme) => {
    if (newTheme === "light") {
      setThemeLite("light");
    } else if (newTheme === "dark") {
      setThemeLite("dark");
    } else {
      setThemeLite("system_default");
=======
  const [theme, setTheme] = useState("system_default");

  const updateTheme = useCallback((newTheme) => {
    if (newTheme === "light") {
      setTheme("light");
    } else if (newTheme === "dark") {
      setTheme("dark");
    } else {
      setTheme("system_default");
>>>>>>> dev:theme/ThemeContext.js
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
<<<<<<< HEAD:src/theme/ThemeContext.js
      customTheme: themeLite,
      updateTheme: updateTheme,
    }),
    [themeLite, updateTheme]
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

=======
      customTheme: theme,
      updateTheme: updateTheme,
    }),
    [theme, updateTheme]
  );

>>>>>>> dev:theme/ThemeContext.js
  return (
    <ThemeContext.Provider value={memoizedValue}>
      {children}
    </ThemeContext.Provider>
  );
}
