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

import { Redirect, Stack, useGlobalSearchParams } from "expo-router";
import { useAuthContext } from "../../auth/useAuthContext";
import { useTheme } from "react-native-paper";
import LoadingScreen from "../../components/LoadingScreen";
import { useColorScheme } from "react-native";
import { useThemeContext } from "../../theme/useThemeContext";
import { darkTheme } from "../../theme/darkTheme";
import { lightTheme } from "../../theme/lightTheme";

export default function AuthLayout() {
  const { isAuthenticated, isInitiated, user } = useAuthContext();
  const { redirect } = useGlobalSearchParams();
  const theme = useTheme();
  const { customTheme } = useThemeContext();
  const defaultColorScheme = useColorScheme();

  if (customTheme === "dark") {
    theme.colors = darkTheme.colors;
    theme.dark = true;
  } else if (customTheme === "light") {
    theme.colors = lightTheme.colors;
    theme.dark = false;
  } else {
    if (defaultColorScheme === "dark") {
      theme.colors = darkTheme.colors;
      theme.dark = true;
    } else {
      theme.colors = lightTheme.colors;
      theme.dark = false;
    }
  }

  if (!isInitiated) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && user) {
    if (redirect !== undefined) {
      return <Redirect href={redirect} />;
    } else {
      return <Redirect href="/dashboard" />;
    }
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primaryContainer,
        },
        headerTintColor: theme.colors.onPrimaryContainer,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: true,
      }}
    />
  );
}
