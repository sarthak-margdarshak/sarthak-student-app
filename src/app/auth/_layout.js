import { Redirect, router, Slot, useGlobalSearchParams } from "expo-router";
import { useAuthContext } from "../../auth/useAuthContext";
import { IconButton, Surface } from "react-native-paper";
import LoadingScreen from "../../components/LoadingScreen";
import { Dimensions, ScrollView, View } from "react-native";
import { Container, Navbar } from "react-bootstrap";
import FootComponent from "../../sections/auth/FootComponent";

export default function AuthLayout() {
  const { isAuthenticated, isInitiated, user } = useAuthContext();
  const { redirect } = useGlobalSearchParams();

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
              src="https://api.sarthakmargdarshak.in/v1/storage/buckets/672a50aa003599f495e8/files/672a50c8003897892e6a/view?project=671f66a0001e5803f481&project=671f66a0001e5803f481&mode=admin"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="sarthak-logo"
            />{" "}
            Sarthak Margdarshak
          </Navbar.Brand>

          {/* <Navbar.Text className="justify-content-end">
            <IconButton
              icon="help-circle"
              size={20}
              onPress={() =>
                router.navigate("https://www.sarthakmargdarshak.in/contact-us")
              }
            />
          </Navbar.Text> */}
        </Container>
      </Navbar>

      <View
        style={{
          minWidth: Math.min(Dimensions.get("window").width, 600),
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
