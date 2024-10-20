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
import { useAuthContext } from "../../auth/useAuthContext";

export default function DashboardPage() {
  const { pagesIndex } = useLocalSearchParams();
  const { studentProfile } = useAuthContext();

  const [index, setIndex] = useState(
    pagesIndex === undefined ? 0 : parseInt(pagesIndex)
  );

  const [routes, setRoutes] = useState([
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
      badge: studentProfile?.purchased?.length || 0,
    },
    {
      key: "cart",
      title: "Cart",
      focusedIcon: "cart",
      unfocusedIcon: "cart-outline",
      badge: studentProfile?.cart?.length || 0,
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
        var tmpRoutes = routes;
        tmpRoutes[1].badge = studentProfile?.purchased?.length || 0;
        tmpRoutes[2].badge = studentProfile?.cart?.length || 0;
        setRoutes(tmpRoutes);
      }}
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      renderScene={renderScene}
    />
  );
}
