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

import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useAuthContext } from "../../../auth/useAuthContext";
import LoadingScreen from "../../../components/LoadingScreen";

export default function PurchasedProductFragment() {
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();

  const loadData = async () => {
    setLoading(true);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return loading ? (
    <LoadingScreen />
  ) : (
    <ScrollView
      style={{
        margin: 10,
      }}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets={true}
    ></ScrollView>
  );
}
