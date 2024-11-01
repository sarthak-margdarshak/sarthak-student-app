import { Slot } from "expo-router";
import { AuthProvider } from "../auth/AppwriteContext";
import "../locales/i18n";
import { ThemeProvider } from "../theme/ThemeContext";
import { ToastProvider } from "react-native-toast-notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Icon } from "react-native-paper";
import { HelmetProvider } from "react-helmet-async";

export default function AppLayout() {
  const [showInstallPrompts, setShowInstallPrompts] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  if ("serviceWorker" in navigator && "PushManager" in window) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompts(true);
    });
  }

  const openInstallFlow = () => {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        setShowInstallPrompts(false);
        console.log("App installed");
      } else {
        console.log("App installation declined");
      }
    });
  };

  return (
    <HelmetProvider>
      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <Modal
              show={showInstallPrompts}
              backdrop="static"
              keyboard={false}
              centered
              style={{
                fontFamily: "Laila-Regular",
              }}
            >
              <Modal.Header>
                <Icon source="cellphone-arrow-down" size={20} />
                <Modal.Title>Install Sarthak-Margdarshak</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Click on the INSTALL button below to install your
                SARTHAK-MARGDARSHAK app on your phone
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={openInstallFlow}>
                  INSTALL
                </Button>
              </Modal.Footer>
            </Modal>
            <Slot />
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}
