import { Link } from "expo-router";
import { useContext, useState } from "react";
import { View } from "react-native";
import { Button, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { SnackbarContext } from "../../hooks/useSnackbar";
import { useAuthContext } from "../../auth/useAuthContext";

export default function LogInPage() {
  const theme = useTheme();

  const { showSnackbar } = useContext(SnackbarContext);
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (error) {
      showSnackbar(error);
    }
    setSubmitting(false)
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
        >L</Text>
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
          og
        </Text>
        <Text
          style={{
            fontSize: 60,
            color: theme.colors.secondary,
            fontWeight: 'bold',
          }}
        >I</Text>
        <Text
          style={{
            fontSize: 35,
            top: 18,
            fontWeight: 'bold',
            color: theme.colors.secondary,
            textDecorationLine: 'underline'
          }}
        >
          n
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
          value={email}
          onChangeText={(e) => setEmail(e)}
          label="email"
        />

        <TextInput
          secureTextEntry={hidePassword}
          inputMode="text"
          value={password}
          onChangeText={(e) => setPassword(e)}
          style={{
            margin: 10
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
            <Link href="/auth/sign-up">
              New Here?
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
            <Link href="/auth/forgot-password">
              Forgot password?
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
          loading={submitting}
          disabled={submitting}
        >
          Login
        </Button>
      </Surface>
    </>
  );
}