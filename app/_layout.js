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

import { Slot } from "expo-router";
import { PaperProvider, useTheme } from "react-native-paper";
import { AuthProvider } from "../auth/AppwriteContext";
import { useColorScheme } from "react-native";
import { lightTheme } from "../theme/lightTheme";
import { darkTheme } from "../theme/darkTheme";

export default function AppLayout() {
  const theme = useTheme();
  const defaultColorScheme = useColorScheme();

  if (defaultColorScheme === "dark") {
    theme.colors = darkTheme.colors;
    theme.dark = true;
  } else {
    theme.colors = lightTheme.colors;
  }

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </PaperProvider>
  );
}
