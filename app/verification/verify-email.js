import { Redirect, useGlobalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Surface, Text, useTheme } from "react-native-paper";
import { account } from "../../auth/AppwriteContext";
import { SnackbarContext } from "../../hooks/useSnackbar";

export default function VerifyEmail() {

  const [verificationDone, setVerficationDone] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const { userId, secret } = useGlobalSearchParams();
  const theme = useTheme();

  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    const fun = async () => {
      try {
        await account.updateVerification(
          userId,
          secret
        )
        setVerficationDone(true)
      } catch (error) {
        showSnackbar(error.message);
      }
    }
    fun();
  }, [userId, secret])

  if (redirect) {
    return <Redirect href='/dashboard' />
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
        >E</Text>
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
          mail
        </Text>
        <Text
          style={{
            fontSize: 60,
            color: theme.colors.secondary,
            fontWeight: 'bold',
          }}
        >V</Text>
        <Text
          style={{
            fontSize: 35,
            top: 18,
            fontWeight: 'bold',
            color: theme.colors.secondary,
            textDecorationLine: 'underline'
          }}
        >
          erification
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

        {!verificationDone ?
          <>
            <Text variant="bodyLarge" style={{ marginTop: 20, marginBottom: 20, marginLeft: 10, marginRight: 10 }}>Email Verification in progress...</Text>
            <ActivityIndicator animating={true} style={{ marginTop: 20, marginBottom: 20, marginLeft: 10, marginRight: 10 }} />
          </>
          :
          <>
            <Text variant="bodyLarge" style={{ marginTop: 20, marginBottom: 20, marginLeft: 10, marginRight: 10 }}>Your Email is verified successfully. Click Below to go to dashboard.</Text>
            <Button style={{ margin: 20 }} mode='contained' onPress={() => setRedirect(true)}>Dashboard</Button>
          </>
        }
      </Surface>
    </>
  );
}