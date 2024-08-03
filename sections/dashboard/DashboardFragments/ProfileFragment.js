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

import { ScrollView } from "react-native";
import { Button, Divider, List, Text, TextInput } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { router } from "expo-router";
import { PATH_DASHBOARD } from "../../../routes/paths";

export default function ProfileFragment() {
  const { user, logout } = useAuthContext();

  return (
    <ScrollView
      style={{
        margin: 10,
      }}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets={true}
    >
      <Text
        style={{
          marginTop: 10,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
        }}
        variant="labelLarge"
      >
        Personal Information
      </Text>

      <Text
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        variant="labelMedium"
      >
        Full Name
      </Text>

      <TextInput
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        mode="outlined"
        value={user?.name}
        left={<TextInput.Icon icon="account" />}
        readOnly
      />

      <Divider
        style={{
          marginTop: 5,
          marginBottom: 5,
        }}
      />

      <Text
        style={{
          marginTop: 10,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
        }}
        variant="labelLarge"
      >
        Contact Information
      </Text>

      <Text
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        variant="labelMedium"
      >
        Email ID
      </Text>

      <TextInput
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        mode="outlined"
        value={user?.email}
        readOnly
        left={<TextInput.Icon icon="email" />}
        keyboardType="email-address"
      />

      <Text
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        variant="labelMedium"
      >
        Phone
      </Text>

      <TextInput
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        mode="outlined"
        value={"+91 7645935519"}
        readOnly
        left={<TextInput.Icon icon="phone" />}
        keyboardType="email-address"
      />

      <Divider
        style={{
          marginTop: 5,
          marginBottom: 5,
        }}
      />

      <List.Item
        title="Your Orders"
        left={(props) => <List.Icon {...props} icon="cart-arrow-up" />}
        right={() => <List.Icon icon="chevron-right" />}
        onPress={() => router.push(PATH_DASHBOARD.orders.list)}
      />

      <List.Item
        title="Preferences"
        left={(props) => <List.Icon {...props} icon="cog" />}
        right={() => <List.Icon icon="chevron-right" />}
        onPress={() => router.push(PATH_DASHBOARD.preferences)}
        style={{ borderRadius: 10 }}
      />

      <Button
        style={{
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          borderRadius: 10,
        }}
        icon="logout"
        mode="elevated"
        onPress={logout}
      >
        Log Out
      </Button>
    </ScrollView>
  );
}
