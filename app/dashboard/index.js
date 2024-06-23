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

import { BottomNavigation } from "react-native-paper";
import { useState } from "react";
import {
  MockTestSeriesFragment,
  ProfileFragment,
  PurchasedProductFragment,
  SettingsFragment,
} from "../../sections/dashboard/DashboardFragments";

export default function DashboardPage() {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: "mockSeries",
      title: "Mock Series",
      focusedIcon: "book-open",
      unfocusedIcon: "book-open-outline",
    },
    {
      key: "purchased",
      title: "Purchased",
      focusedIcon: "badge-account-horizontal",
      unfocusedIcon: "badge-account-horizontal-outline",
    },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    mockSeries: MockTestSeriesFragment,
    purchased: PurchasedProductFragment,
    settings: SettingsFragment,
    profile: ProfileFragment,
  });

  return (
    <BottomNavigation
      style={{
        left: 0,
        right: 0,
        bottom: 0,
      }}
      navigationState={{ index, routes }}
      onIndexChange={(i) => {
        setIndex(i);
      }}
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      renderScene={renderScene}
    />
  );
}
