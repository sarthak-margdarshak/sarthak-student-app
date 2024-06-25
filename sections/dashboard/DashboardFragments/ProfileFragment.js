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
import { Button, Divider, Text, TextInput, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";

export default function ProfileFragment() {
  const { user, logout } = useAuthContext();
  const theme = useTheme();

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
          marginBottom: 10,
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
          marginBottom: 10,
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
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 5,
          marginRight: 5,
        }}
      />
      <Text
        style={{
          marginTop: 10,
          marginBottom: 20,
          marginLeft: 5,
          marginRight: 5,
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
          marginBottom: 10,
          marginLeft: 15,
          marginRight: 15,
        }}
        mode="outlined"
        value={user?.email}
        readOnly
        left={<TextInput.Icon icon="email" />}
        keyboardType="email-address"
      />

      <Button
        style={{
          marginLeft: 20,
          marginBottom: 40,
          marginRight: 20,
          marginTop: 40,
        }}
        mode="elevated"
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
        onPress={logout}
      >
        Log Out
      </Button>
    </ScrollView>
  );
}
