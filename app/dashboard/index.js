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
  CartFragment,
  MockTestSeriesFragment,
  ProfileFragment,
  PurchasedProductFragment,
} from "../../sections/dashboard/DashboardFragments";
import { useLocalSearchParams } from "expo-router";

export default function DashboardPage() {
  const { pagesIndex } = useLocalSearchParams();
  const [index, setIndex] = useState(
    pagesIndex === undefined ? 0 : parseInt(pagesIndex)
  );

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
      key: "cart",
      title: "Cart",
      focusedIcon: "cart",
      unfocusedIcon: "cart-outline",
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
    cart: CartFragment,
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
