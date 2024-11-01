import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Chip,
  HelperText,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { appwriteAccount } from "../../auth/AppwriteContext";
import { APPWRITE_API } from "../../config-global";
import { Toast } from "react-native-toast-notifications";

export default function ForgotPasswordPage() {
  const theme = useTheme();

  const [emailId, setEmailId] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const submit = async () => {
    setEmailSent(false);
    try {
      await appwriteAccount.createRecovery(
        emailId,
        window.location.origin + "/reset-password"
      );
      Toast.show(
        "Password reset link has been sent to your email. Happy to help you.",
        { type: "success" }
      );
      setEmailSent(true);
    } catch (error) {
      Toast.show(error.message, { type: "danger" });
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
          value={emailId}
          onChangeText={(e) => setEmailId(e)}
          label="Email"
          left={<TextInput.Icon icon="email" />}
        />
        <HelperText type="info" style={{ fontFamily: "Laila-Regular" }}>
          We will send a magic URL for resetting your password to your Email,
          which can be used to reset your password.
        </HelperText>

        {emailSent && (
          <Chip
            icon="checkbox-marked"
            selectedColor={theme.colors.secondary}
            selected
            style={{ margin: 20 }}
            textStyle={{ fontFamily: "Laila-Regular" }}
          >
            Email Sent Successfully.
          </Chip>
        )}

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
          labelStyle={{ fontFamily: "Laila-Regular" }}
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
