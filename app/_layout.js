import { Slot } from "expo-router";
import SarthakAppBackground from "../components/SarthakAppBackground";
import { Snackbar } from "react-native-paper";
import { SnackbarContext } from "../hooks/useSnackbar";
import { useState } from "react";
import { AuthProvider } from "../auth/AppwriteContext";

export default function AppLayout() {

  const [visible, setVisible] = useState(false);
  const [error, setError] = useState([]);
  const [currentError, setCurrentError] = useState("");

  const showSnackbar = async (errorMessage) => {
    var newError = error;
    newError.push(errorMessage)
    if (newError.length === 1) {
      setVisible(true);
    }
    setCurrentError(newError.at(0))
    setError(newError)
  }

  const hideSnackbar = async () => {
    setVisible(false)
    setCurrentError("")
    await new Promise((resolve) => setTimeout(resolve, 100));
    var newError = error;
    newError.splice(0, 1);
    if (newError.length === 0) {
      setError([])
    } else {
      setCurrentError(newError.at(0))
      setError(newError)
      setVisible(true)
    }
  }

  return (
    <SarthakAppBackground>
      <SnackbarContext.Provider value={{
        error: error,
        showSnackbar: showSnackbar,
        hideSnackbar: hideSnackbar
      }}>
        <AuthProvider>
          <Slot />
        </AuthProvider>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={3000}
          elevation={5}
          style={{
            margin: 5
          }}
          icon='close'
          onIconPress={hideSnackbar}>
          {currentError}
        </Snackbar>
      </SnackbarContext.Provider>
    </SarthakAppBackground>
  );
}