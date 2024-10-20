import { Slot } from "expo-router";
import { AuthProvider } from "../auth/AppwriteContext";
import "../locales/i18n";
import { ThemeProvider } from "../theme/ThemeContext";
import { ToastProvider } from "react-native-toast-notifications";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AppLayout() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
