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

import { Stack } from "expo-router";
import AuthGuard from "../../auth/AuthGuard";
import { PaperProvider, useTheme } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../auth/useAuthContext";
import { useColorScheme } from "react-native";
import { langPath, useLocales } from "../../locales";
import { useThemeContext } from "../../theme/useThemeContext";
import { darkTheme } from "../../theme/darkTheme";
import { lightTheme } from "../../theme/lightTheme";
import { StatusBar } from "expo-status-bar";
import { useToast } from "react-native-toast-notifications";

export default function DashboardLayout() {
  const theme = useTheme();
  const { customTheme } = useThemeContext();
  const defaultColorScheme = useColorScheme();
  const { translate } = useLocales();
  const { user } = useAuthContext();

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

  const [isConnected, setConnected] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // toast.show("shjkdbcvdjsf");
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
      if (!state.isConnected) {
        // ToastAndroid.show("No Internet connection", ToastAndroid.LONG);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <AuthGuard>
        <Stack
          screenOptions={{
            headerTransparent: true,
            headerStyle: {
              backgroundColor: theme.colors.primaryContainer,
            },
            headerTintColor: theme.colors.onPrimaryContainer,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerShadowVisible: true,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: translate(langPath.app.dashboard.layout.stackTitle),
            }}
          />
        </Stack>
      </AuthGuard>
    </PaperProvider>
  );
}
