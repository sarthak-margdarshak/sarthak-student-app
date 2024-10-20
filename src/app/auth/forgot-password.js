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

import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
  Button,
  HelperText,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import FootComponent from "../../sections/auth/FootComponent";
import { appwriteAccount, appwriteDatabases } from "../../auth/AppwriteContext";
import { APPWRITE_API } from "../../config-global";
import { Query } from "appwrite";

export default function ForgotPasswordPage() {
  const theme = useTheme();

  const [emailId, setEmailId] = useState("");

  const submit = async () => {
    try {
      // Check for only student emails
      const y = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.adminUsers,
        [Query.equal("email", emailId)]
      );
      if (y.total !== 0) {
        throw new Error(
          "You are an admin user of this platform. You can't reset your password on this app."
        );
      }
      await appwriteAccount.createRecovery(
        emailId,
        APPWRITE_API.adminHostOrigin + "/auth/new-password"
      );
      // ToastAndroid.show(
      //   "Password reset link has been sent to your email. Happy to help you",
      //   ToastAndroid.LONG
      // );
    } catch (error) {
      // ToastAndroid.show(error.message, ToastAndroid.LONG);
      console.log(error.message);
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: 60,
            marginLeft: 20,
            fontWeight: "bold",
            color: theme.colors.secondary,
            fontFamily: "Laila-Regular",
          }}
        >
          F
        </Text>
        <Text
          style={{
            fontSize: 35,
            top: 18,
            fontWeight: "bold",
            textDecorationLine: "underline",
            color: theme.colors.secondary,
            marginRight: 10,
            fontFamily: "Laila-Regular",
          }}
        >
          orgot
        </Text>
        <Text
          style={{
            fontSize: 60,
            color: theme.colors.secondary,
            fontWeight: "bold",
            fontFamily: "Laila-Regular",
          }}
        >
          P
        </Text>
        <Text
          style={{
            fontSize: 35,
            top: 18,
            fontWeight: "bold",
            color: theme.colors.secondary,
            textDecorationLine: "underline",
            fontFamily: "Laila-Regular",
          }}
        >
          assword
        </Text>
      </View>

      <Surface
        elevation={1}
        style={{
          marginBottom: 40,
          marginLeft: 10,
          marginRight: 10,
          borderRadius: 10,
        }}
      >
        <TextInput
          inputMode="email"
          style={{
            margin: 10,
            fontFamily: "Laila-Regular",
          }}
          value={emailId}
          onChangeText={(e) => setEmailId(e)}
          label="Email"
        />
        <HelperText type="info" style={{ fontFamily: "Laila-Regular" }}>
          We will send a magic URL for resetting your password to your Email,
          which can be used to reset your password.
        </HelperText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              width: 100,
              marginLeft: 10,
              fontWeight: "bold",
              textDecorationLine: "underline",
              color: theme.colors.tertiary,
              flex: 1,
              flexDirection: "row",
              fontFamily: "Laila-Regular",
            }}
          >
            <Link href="/auth/login">Already a member</Link>
          </Text>
          <Text
            style={{
              textAlign: "right",
              marginRight: 10,
              fontWeight: "bold",
              textDecorationLine: "underline",
              color: theme.colors.tertiary,
              justifyContent: "space-evenly",
              marginVertical: 10,
              fontFamily: "Laila-Regular",
            }}
          >
            <Link href="/auth/sign-up">New here?</Link>
          </Text>
        </View>

        <Button
          style={{
            marginLeft: 20,
            marginBottom: 40,
            marginRight: 20,
            marginTop: 40,
            borderRadius: 10,
          }}
          icon="send"
          mode="elevated"
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={submit}
        >
          Send Reset Link
        </Button>
      </Surface>
    </View>
  );
}
