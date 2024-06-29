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

import { Dimensions, View } from "react-native";
import LogoSingle from "../assets/logo/logo_single.svg";
import { ActivityIndicator, useTheme } from "react-native-paper";

export default function LoadingScreen() {
  const theme = useTheme();
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: theme.colors.background,
      }}
    >
      <LogoSingle width={100} height={100} />
      <ActivityIndicator animating={true} />
    </View>
  );
}
