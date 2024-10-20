import { Stack } from "expo-router";
import AuthGuard from "../../auth/AuthGuard";
import { PaperProvider, useTheme } from "react-native-paper";
import { langPath, useLocales } from "../../locales";
import { StatusBar } from "expo-status-bar";

export default function DashboardLayout() {
  const theme = useTheme();
  const { translate } = useLocales();

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
