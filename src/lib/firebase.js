import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVzedNcjWgV61KbceNTj83ZL3OjO5NVdo",
  authDomain: "sarthak-push-notifications.firebaseapp.com",
  projectId: "sarthak-push-notifications",
  storageBucket: "sarthak-push-notifications.firebasestorage.app",
  messagingSenderId: "199578191076",
  appId: "1:199578191076:web:e1937dc0f8d128aa0518f1",
  measurementId: "G-Z6FMYPPE65",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
