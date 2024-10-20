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

import { useFonts } from "expo-font";
import { createContext, useCallback, useMemo, useState } from "react";

export const ThemeContext = createContext({
  customTheme: "system_default",
  updateTheme: (newTheme) => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system_default");

  const [loaded, error] = useFonts({
    "Laila-Bold": require("../assets/fonts/Laila-Bold.ttf"),
    "Laila-Light": require("../assets/fonts/Laila-Light.ttf"),
    "Laila-Medium": require("../assets/fonts/Laila-Medium.ttf"),
    "Laila-Regular": require("../assets/fonts/Laila-Regular.ttf"),
    "Laila-SemiBold": require("../assets/fonts/Laila-SemiBold.ttf"),
  });

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

  return (
    <ThemeContext.Provider value={memoizedValue}>
      {children}
    </ThemeContext.Provider>
  );
}
