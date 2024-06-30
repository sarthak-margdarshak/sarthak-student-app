import { Stack } from "expo-router";
import { View } from "react-native";
import { SettingsFragment } from "../../sections/dashboard/DashboardFragments";

export default function Preferences() {
  return (
    <View>
      <Stack.Screen
        options={{
          title: "Preferences",
        }}
      />

      <SettingsFragment />
    </View>
  );
}
