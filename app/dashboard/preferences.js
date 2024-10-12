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
import { View } from "react-native";
import { SettingsFragment } from "../../sections/dashboard/DashboardFragments";
import { langPath, useLocales } from "../../locales";

export default function Preferences() {
  const { translate } = useLocales();

  return (
    <View>
      <Stack.Screen
        options={{
          title: translate(langPath.app.dashboard.preferences.title),
        }}
      />

      <SettingsFragment />
    </View>
  );
}
