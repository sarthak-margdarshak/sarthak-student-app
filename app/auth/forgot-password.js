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

import { Link } from "expo-router";
import { useState } from "react";
import { Dimensions, ScrollView, ToastAndroid, View } from "react-native";
import {
  Button,
  HelperText,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import FootComponent from "../../sections/auth/FootComponent";
import { appwriteAccount } from "../../auth/AppwriteContext";

export default function ForgotPasswordPage() {
  const theme = useTheme();

  const [emailId, setEmailId] = useState("");

  const submit = async () => {
    try {
      // Check for only student emails
      appwriteAccount.createRecovery(emailId);
      ToastAndroid.show(
        "Password reset link has been sent to your email. Happy to help you",
        ToastAndroid.LONG
      );
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView
      style={{
        height: Dimensions.get("window").height,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          paddingTop: 60,
        }}
      >
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
            }}
          >
            orgot
          </Text>
          <Text
            style={{
              fontSize: 60,
              color: theme.colors.secondary,
              fontWeight: "bold",
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
            }}
            value={emailId}
            onChangeText={(e) => setEmailId(e)}
            label="Email"
          />
          <HelperText type="info">
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
            }}
            mode="elevated"
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            onPress={submit}
          >
            Send Reset Link
          </Button>
        </Surface>

        <FootComponent />
      </View>
    </ScrollView>
  );
}
