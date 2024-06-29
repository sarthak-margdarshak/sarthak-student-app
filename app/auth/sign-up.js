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
import { Button, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";
import FootComponent from "../../sections/auth/FootComponent";

export default function SignUpPage() {
  const theme = useTheme();
  const { signup } = useAuthContext();

  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    await signup(emailId, password, name);
    setSubmitting(false);
  };

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Sign Up",
        }}
      />
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
              S
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
              ign
            </Text>
            <Text
              style={{
                fontSize: 60,
                color: theme.colors.secondary,
                fontWeight: "bold",
              }}
            >
              U
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
              p
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
              inputMode="text"
              style={{
                margin: 10,
              }}
              value={name}
              onChangeText={(e) => setName(e)}
              label="Name"
            />

            <TextInput
              inputMode="email"
              style={{
                margin: 10,
              }}
              value={emailId}
              onChangeText={(e) => setEmailId(e)}
              label="Email Id"
            />

            <TextInput
              secureTextEntry={hidePassword}
              inputMode="text"
              value={password}
              onChangeText={(e) => setPassword(e)}
              style={{
                margin: 10,
              }}
              label="password"
              right={
                <TextInput.Icon
                  icon={hidePassword ? "eye" : "eye-off"}
                  onPress={() => setHidePassword(!hidePassword)}
                />
              }
            />

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
                <Link href="/auth/forgot-password">Forgot password?</Link>
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
              loading={submitting}
              disabled={submitting}
            >
              Sign Up
            </Button>
          </Surface>

          <FootComponent />
        </View>
      </ScrollView>
    </View>
  );
}
