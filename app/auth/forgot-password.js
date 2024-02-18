import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, HelperText, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";

export default function ForgotPasswordPage() {
  const theme = useTheme();

  const { forgetPassword } = useAuthContext();

  const [emailId, setEmailId] = useState("");

  const submit = async () => {
    await forgetPassword(emailId)
  }

  return (
    <>
      <View style={{
        flexDirection: 'row',
      }}>
        <Text
          style={{
            fontSize: 60,
            marginLeft: 20,
            fontWeight: 'bold',
            color: theme.colors.secondary
          }}
        >F</Text>
        <Text
          style={{
            fontSize: 35,
            top: 18,
            fontWeight: 'bold',
            textDecorationLine: 'underline',
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
            fontWeight: 'bold',
          }}
        >P</Text>
        <Text
          style={{
            fontSize: 35,
            top: 18,
            fontWeight: 'bold',
            color: theme.colors.secondary,
            textDecorationLine: 'underline'
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
            margin: 10
          }}
          value={emailId}
          onChangeText={(e) => setEmailId(e)}
          label="Email"
        />
        <HelperText type="info">
          We will send a magic URL for resetting your password to your Email, which can be used to reset your password.
        </HelperText>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Text style={{
            width: 100,
            marginLeft: 10,
            fontWeight: 'bold',
            textDecorationLine: 'underline',
            color: theme.colors.tertiary,
            flex: 1,
            flexDirection: 'row'
          }}>
            <Link href="/auth/login">
              Already a member
            </Link>
          </Text>
          <Text
            style={{
              textAlign: 'right',
              marginRight: 10,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
              color: theme.colors.tertiary,
              justifyContent: 'space-evenly',
              marginVertical: 10
            }}
          >
            <Link href="/auth/sign-up">
              New here?
            </Link>
          </Text>
        </View>

        <Button
          style={{
            marginLeft: 20,
            marginBottom: 40,
            marginRight: 20,
            marginTop: 40
          }}
          mode="elevated"
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={submit}
        >
          Verify Yourself
        </Button>
      </Surface>
    </>
  );
}