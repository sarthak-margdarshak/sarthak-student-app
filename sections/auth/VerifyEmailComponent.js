import { Button, Dialog, Text } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext"
import { SnackbarContext } from "../../hooks/useSnackbar"
import { account } from "../../auth/AppwriteContext";
import { useContext } from "react";

export default function VerifyEmailComponent({ visible, hideDialog }) {
  const { user } = useAuthContext();
  const { showSnackbar } = useContext(SnackbarContext);

  const submit = async () => {
    try {
      await account.createVerification(location.origin+'/verification/verify-email');
      showSnackbar('Verification Link sent successfully. Open your email and verify.')
    } catch (error) {
      showSnackbar(error.message);
    }
    hideDialog();
  }

  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Icon icon='email-check' />
      <Dialog.Title>Verify Your Email Id</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyLarge" style={{fontWeight: 'bold', margin: 2, textDecorationLine: 'underline'}}>{user?.email}</Text>
        <Text>{'Hi ' + user?.name + '!!! We are sending you a verfication link on your email (' + user?.email + '). Please click on the recieved link to verify yourself.'}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideDialog}>Cancel</Button>
        <Button onPress={submit}>Send</Button>
      </Dialog.Actions>
    </Dialog>
  );
}