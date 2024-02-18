import { Redirect, useGlobalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { View } from "react-native";
import { Button, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { SnackbarContext } from "../../hooks/useSnackbar";
import { useAuthContext } from "../../auth/useAuthContext";

export default function ResetPasswordPage() {
  const theme = useTheme();

  const { showSnackbar } = useContext(SnackbarContext);
  const { resetPassword } = useAuthContext();

  const { userId, secret } = useGlobalSearchParams();

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [hidePassword1, setHidePassword1] = useState(true);
  const [hidePassword2, setHidePassword2] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sucessfulRedirect, setSuccessfulRedirect] = useState(false);

  const submit = async () => {
    setSubmitting(true)
    try {
      await resetPassword(userId, secret, password1, password2);
      setSuccessfulRedirect(true)
    } catch (error) {
      showSnackbar(error.message)
    }
    setSubmitting(false)
  }

  if(sucessfulRedirect) {
    <Redirect href='/auth/login' />
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
        >R</Text>
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
          eset
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
          secureTextEntry={hidePassword1}
          inputMode="text"
          value={password1}
          onChangeText={(e) => setPassword1(e)}
          style={{
            margin: 10
          }}
          label="New Password"
          right={
            <TextInput.Icon
              icon={hidePassword1 ? "eye" : "eye-off"}
              onPress={() => setHidePassword1(!hidePassword1)}
            />
          }
        />

        <TextInput
          secureTextEntry={hidePassword2}
          inputMode="text"
          value={password2}
          onChangeText={(e) => setPassword2(e)}
          style={{
            margin: 10
          }}
          label="Confirm Password"
          right={
            <TextInput.Icon
              icon={hidePassword2 ? "eye" : "eye-off"}
              onPress={() => setHidePassword2(!hidePassword2)}
            />
          }
        />

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
          loading={submitting}
          disabled={submitting}
        >
          Reset Password
        </Button>
      </Surface>
    </>
  );
}