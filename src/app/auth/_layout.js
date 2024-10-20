import { Redirect, Slot, useGlobalSearchParams } from "expo-router";
import { useAuthContext } from "../../auth/useAuthContext";
import { Surface, useTheme } from "react-native-paper";
import LoadingScreen from "../../components/LoadingScreen";
import { Dimensions, ScrollView, useColorScheme, View } from "react-native";
import { lightTheme } from "../../theme/lightTheme";
import { Container, Navbar } from "react-bootstrap";
import FootComponent from "../../sections/auth/FootComponent";
// import { useThemeContext } from "../../theme/useThemeContext";
// import { darkTheme } from "../../theme/darkTheme";

export default function AuthLayout() {
  const { isAuthenticated, isInitiated, user } = useAuthContext();
  const { redirect } = useGlobalSearchParams();
  const theme = useTheme();
  theme.colors = lightTheme.colors;
  theme.dark = false;

  // const { customTheme } = useThemeContext();
  // const defaultColorScheme = useColorScheme();
  // if (customTheme === "dark") {
  //   theme.colors = darkTheme.colors;
  //   theme.dark = true;
  // } else if (customTheme === "light") {
  //   theme.colors = lightTheme.colors;
  //   theme.dark = false;
  // } else {
  //   if (defaultColorScheme === "dark") {
  //     theme.colors = darkTheme.colors;
  //     theme.dark = true;
  //   } else {
  //     theme.colors = lightTheme.colors;
  //     theme.dark = false;
  //   }
  // }

  if (!isInitiated) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && user) {
    if (redirect !== undefined) {
      return <Redirect href={redirect} />;
    } else {
      return <Redirect href="/dashboard" />;
    }
  }

  return (
    <View
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        alignItems: "center",
      }}
    >
      <Navbar
        style={{
          margin: 3,
          borderRadius: 8,
          fontWeight: "bolder",
          fontFamily: "Laila-Regular",
          backdropFilter: "blur(20px)",
        }}
        expand="lg"
        bg="transparent"
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="/">
            <img
              src="../../../public/assets/favicon/favicon-512x512.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="sarthak-logo"
            />{" "}
            Sarthak Margdarshak
          </Navbar.Brand>

          <Navbar.Text className="justify-content-end">
            <a
              target="_blank"
              href="https://www.sarthakmargdarshak.in/contact-us"
            >
              Need Help?
            </a>
          </Navbar.Text>
        </Container>
      </Navbar>

      <View
        style={{
          minWidth: Math.min(Dimensions.get("window").width, 400),
          maxWidth: 700,
        }}
      >
        <ScrollView>
          <Surface
            elevation={1}
            style={{
              justifyContent: "center",
              marginTop: 80,
              marginBottom: 20,
              borderRadius: 20,
            }}
          >
            <Slot />
            <FootComponent />
          </Surface>
        </ScrollView>
      </View>
    </View>
  );
}
