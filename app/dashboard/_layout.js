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
import { useTheme } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../auth/useAuthContext";
import { ToastAndroid } from "react-native";

export default function DashboardLayout() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
      if (!state.isConnected) {
        ToastAndroid.show("No Internet connection", ToastAndroid.LONG);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <AuthGuard>
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
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Sarthak Margdarshak",
          }}
        />
      </Stack>
    </AuthGuard>
  );
}
