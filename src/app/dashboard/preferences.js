import { Stack } from "expo-router";
import { View } from "react-native";
import { SettingsFragment } from "../../sections/dashboard/DashboardFragments";
import { langPath, useLocales } from "../../locales";

export default function Preferences() {
  const { translate } = useLocales();

  return (
    <View>
      <SettingsFragment />
    </View>
  );
}
