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

export const ThemeContext = createContext({
  customTheme: "system_default",
  updateTheme: (newTheme) => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system_default");

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
