import { Link, router, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
  Button,
  HelperText,
  IconButton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { appwriteAccount, appwriteDatabases } from "../auth/AppwriteContext";
import { APPWRITE_API } from "../config-global";
import { Toast } from "react-native-toast-notifications";
import { Container, Navbar } from "react-bootstrap";
import FootComponent from "../sections/auth/FootComponent";
import { Helmet } from "react-helmet-async";

export default function ResetPassword() {
  const theme = useTheme();

  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const { userId, secret } = useGlobalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      console.log(APPWRITE_API.databaseId, APPWRITE_API.collections.students);
      try {
        const x = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.students,
          userId
        );
        setName(x?.name);
        setEmailId(x?.email);
      } catch (error) {
        if (error.code != 404) Toast.show(error.code, { type: "danger" });
      }
    };
    if (userId !== undefined) fetchData();
  }, [userId]);

  const submit = async () => {
    setSubmitting(true);
    try {
      await appwriteAccount.updateRecovery(
        userId,
        secret,
        password,
        confirmPassword
      );
      Toast.show("Password Reset Successfully", { type: "success" });
      router.replace("/dashboard");
    } catch (error) {
      Toast.show(error.message, { type: "danger" });
    }
    setSubmitting(false);
  };

  return (
    <View
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        alignItems: "center",
      }}
    >
      <Helmet>
        <title> Reset Password | Sarthak</title>
      </Helmet>

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
            <IconButton
              icon="help-circle"
              size={20}
              onPress={() =>
                router.navigate("https://www.sarthakmargdarshak.in/contact-us")
              }
            />
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
            <View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: 60,
                    marginLeft: 20,
                    fontWeight: "bold",
                    color: theme.colors.secondary,
                    fontFamily: "Laila-Regular",
                  }}
                >
                  R
                </Text>
                <Text
                  style={{
                    fontSize: 35,
                    top: 18,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                    color: theme.colors.secondary,
                    marginRight: 10,
                    fontFamily: "Laila-Regular",
                  }}
                >
                  eset
                </Text>
                <Text
                  style={{
                    fontSize: 60,
                    color: theme.colors.secondary,
                    fontWeight: "bold",
                    fontFamily: "Laila-Regular",
                  }}
                >
                  P
                </Text>
                <Text
                  style={{
                    fontSize: 35,
                    top: 18,
                    fontWeight: "bold",
                    color: theme.colors.secondary,
                    textDecorationLine: "underline",
                    fontFamily: "Laila-Regular",
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
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                }}
              >
                <TextInput
                  mode="outlined"
                  inputMode="text"
                  style={{
                    margin: 10,
                    fontFamily: "Laila-Regular",
                  }}
                  value={name}
                  onChangeText={(e) => setName(e)}
                  label="Name"
                  left={<TextInput.Icon icon="account" />}
                  editable={false}
                />

                <TextInput
                  mode="outlined"
                  inputMode="email"
                  style={{
                    margin: 10,
                    fontFamily: "Laila-Regular",
                  }}
                  value={emailId}
                  onChangeText={(e) => setEmailId(e)}
                  label="Email Id"
                  left={<TextInput.Icon icon="email" />}
                  editable={false}
                />

                <TextInput
                  mode="outlined"
                  secureTextEntry={hidePassword}
                  inputMode="text"
                  value={password}
                  onChangeText={(e) => setPassword(e)}
                  style={{
                    margin: 10,
                    fontFamily: "Laila-Regular",
                  }}
                  label="Password"
                  left={<TextInput.Icon icon="lastpass" />}
                  right={
                    <TextInput.Icon
                      icon={hidePassword ? "eye" : "eye-off"}
                      onPress={() => setHidePassword(!hidePassword)}
                    />
                  }
                />
                <HelperText type="info" style={{ fontFamily: "Laila-Regular" }}>
                  Enter a strong password to recover your account.
                </HelperText>

                <TextInput
                  mode="outlined"
                  secureTextEntry={hideConfirmPassword}
                  inputMode="text"
                  value={confirmPassword}
                  onChangeText={(e) => setConfirmPassword(e)}
                  style={{
                    margin: 10,
                    fontFamily: "Laila-Regular",
                  }}
                  label="Password Again"
                  left={<TextInput.Icon icon="lastpass" />}
                  right={
                    <TextInput.Icon
                      icon={hideConfirmPassword ? "eye" : "eye-off"}
                      onPress={() =>
                        setHideConfirmPassword(!hideConfirmPassword)
                      }
                    />
                  }
                />
                <HelperText type="info" style={{ fontFamily: "Laila-Regular" }}>
                  Confirm your password by entering once again.
                </HelperText>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: 100,
                      marginLeft: 10,
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                      color: theme.colors.tertiary,
                      flex: 1,
                      flexDirection: "row",
                      fontFamily: "Laila-Regular",
                    }}
                  >
                    <Link href="/auth/login">Already a Member</Link>
                  </Text>
                  <Text
                    style={{
                      textAlign: "right",
                      marginRight: 10,
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                      color: theme.colors.tertiary,
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                      fontFamily: "Laila-Regular",
                    }}
                  >
                    <Link href="/auth/sign-up">New Here?</Link>
                  </Text>
                </View>

                <Button
                  style={{
                    marginLeft: 20,
                    marginBottom: 40,
                    marginRight: 20,
                    marginTop: 40,
                    borderRadius: 10,
                    fontFamily: "Laila-Regular",
                  }}
                  labelStyle={{ fontFamily: "Laila-Regular" }}
                  icon="lock-reset"
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
            </View>
            <FootComponent />
          </Surface>
        </ScrollView>
      </View>
    </View>
  );
}
