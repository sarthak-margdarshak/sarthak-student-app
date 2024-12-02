import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  HelperText,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";

export default function LogInPage() {
  const theme = useTheme();
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
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
          L
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
          og
        </Text>
        <Text
          style={{
            fontSize: 60,
            color: theme.colors.secondary,
            fontWeight: "bold",
            fontFamily: "Laila-Regular",
          }}
        >
          I
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
          n
        </Text>
      </View>

      <Surface
        elevation={3}
        style={{
          marginBottom: 20,
          marginLeft: 10,
          marginRight: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: theme.colors.primary,
        }}
      >
        <TextInput
          mode="outlined"
          inputMode="email"
          style={{
            margin: 10,
            fontFamily: "Laila-Regular",
          }}
          contentStyle={{ fontFamily: "Laila-Regular" }}
          value={email}
          onChangeText={(e) => setEmail(e)}
          label="Email"
          left={<TextInput.Icon icon="email" />}
        />
        <HelperText type="info" style={{ fontFamily: "Laila-Regular" }}>
          Enter your personal email-id, which you uses to sign in to
          Sarthak-Margdarshak.
        </HelperText>

        <TextInput
          mode="outlined"
          secureTextEntry={hidePassword}
          inputMode="text"
          value={password}
          onChangeText={(e) => setPassword(e)}
          style={{
            margin: 10,
            fontFamily: "Laila-Regular",
          }}
          contentStyle={{ fontFamily: "Laila-Regular" }}
          label="Password"
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={hidePassword ? "eye" : "eye-off"}
              onPress={() => setHidePassword(!hidePassword)}
            />
          }
        />
        <HelperText type="info" style={{ fontFamily: "Laila-Regular" }}>
          Enter the correct password to sign in to Sarthak-Margdarshak.
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
            <Link href="/auth/sign-up">New Here?</Link>
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
            <Link href="/auth/forgot-password">Forgot Password?</Link>
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
          labelStyle={{ fontFamily: "Laila-Regular" }}
          icon="login"
          mode="elevated"
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={submit}
          loading={submitting}
          disabled={submitting}
        >
          Login
        </Button>
      </Surface>
    </View>
  );
}
