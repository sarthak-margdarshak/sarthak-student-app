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

export default function AuthLayout() {
  const { isAuthenticated, isInitiated, user } = useAuthContext();
  const { redirect } = useGlobalSearchParams();
  const theme = useTheme();

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
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Log In",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
        }}
      />
    </Stack>
  );
}
