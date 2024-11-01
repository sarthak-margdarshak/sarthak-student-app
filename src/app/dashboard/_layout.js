import { Slot } from "expo-router";
import AuthGuard from "../../auth/AuthGuard";
import { PaperProvider, useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Dimensions, View } from "react-native";

export default function DashboardLayout() {
  const theme = useTheme();

  return (
    <PaperProvider theme={theme}>
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          alignItems: "center",
        }}
      >
        <StatusBar style={theme.dark ? "light" : "dark"} />
        <AuthGuard>
          <View
            style={{
              minWidth: Math.min(Dimensions.get("window").width, 600),
              maxWidth: 700,
            }}
          >
            <Slot />
          </View>
        </AuthGuard>
      </View>
    </PaperProvider>
  );
}
