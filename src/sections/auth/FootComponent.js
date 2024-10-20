import { Linking, Pressable, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Logofull from "../../../public/assets/logo/logo_full.svg";

export default function FootComponent() {
  const theme = useTheme();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ margin: 1 }}>Designed By - Sarthak Margdarshak</Text>
      <Text style={{ margin: 1, fontWeight: "bold" }}>Having any trouble?</Text>
      <Text style={{ margin: 1 }}>Contact Us At :-</Text>
      <Pressable
        style={{ margin: 1 }}
        onPress={() => Linking.openURL("mailto:support@sarthakmargdarshak.in")}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: theme.colors.secondary,
            textDecorationLine: "underline",
            margin: 1,
          }}
        >
          support@sarthakmargdarshak.in
        </Text>
      </Pressable>
      <Pressable
        style={{ margin: 1 }}
        onPress={() => Linking.openURL("tel:+918340378552")}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: theme.colors.secondary,
            textDecorationLine: "underline",
          }}
        >
          +91 834-037-8552
        </Text>
      </Pressable>
      <Text style={{ margin: 3 }}>
        {"© " + new Date().getFullYear() + " | All rights reserved | SARTHAK"}
      </Text>
      <Logofull width={250} height={90} />
    </View>
  );
}
