import { Dimensions, ScrollView } from "react-native";
import {
  Appbar,
  Button,
  Divider,
  List,
  Text,
  TextInput,
} from "react-native-paper";
import { router } from "expo-router";
import { useAuthContext } from "../../auth/useAuthContext";
import { langPath, useLocales } from "../../locales";
import { PATH_DASHBOARD } from "../../routes/paths";
import { Fragment } from "react";

export default function ProfileFragment() {
  const { user, logout } = useAuthContext();
  const { translate } = useLocales();

  return (
    <Fragment>
      <Appbar.Header>
        {router.canGoBack() && (
          <Appbar.BackAction onPress={() => router.back()} />
        )}
        {!router.canGoBack() && (
          <img
            src="https://api.sarthakmargdarshak.in/v1/storage/buckets/672a50aa003599f495e8/files/672a50c8003897892e6a/view?project=671f66a0001e5803f481&project=671f66a0001e5803f481&mode=admin"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="sarthak-logo"
            style={{ margin: 3 }}
            onClick={() => {
              router.dismissAll();
              router.replace(PATH_DASHBOARD.root);
            }}
          />
        )}
        <Appbar.Content
          titleStyle={{ fontFamily: "Laila-Regular" }}
          title="Profile"
        />
      </Appbar.Header>

      <ScrollView
        style={{
          height: Dimensions.get("window").height - 70,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <Text
          style={{
            marginTop: 10,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
            fontFamily: "Laila-Regular",
          }}
          variant="labelLarge"
        >
          {translate(
            langPath.section.dashboard.dashboardFragments.ProfileFragments
              .pers_info
          )}
        </Text>

        <Text
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 15,
            marginRight: 15,
            fontFamily: "Laila-Regular",
          }}
          variant="labelMedium"
        >
          {translate(
            langPath.section.dashboard.dashboardFragments.ProfileFragments
              .fullName
          )}
        </Text>

        <TextInput
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 15,
            marginRight: 15,
          }}
          contentStyle={{ fontFamily: "Laila-Regular" }}
          mode="outlined"
          value={user?.name}
          left={<TextInput.Icon icon="account" />}
          readOnly
        />

        <Divider
          style={{
            marginTop: 5,
            marginBottom: 5,
          }}
        />

        <Text
          style={{
            marginTop: 10,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
            fontFamily: "Laila-Regular",
          }}
          variant="labelLarge"
        >
          {translate(
            langPath.section.dashboard.dashboardFragments.ProfileFragments
              .contactInfo
          )}
        </Text>

        <Text
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 15,
            marginRight: 15,
            fontFamily: "Laila-Regular",
          }}
          variant="labelMedium"
        >
          {translate(
            langPath.section.dashboard.dashboardFragments.ProfileFragments
              .emailId
          )}
        </Text>

        <TextInput
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 15,
            marginRight: 15,
          }}
          contentStyle={{ fontFamily: "Laila-Regular" }}
          mode="outlined"
          value={user?.email}
          readOnly
          left={<TextInput.Icon icon="email" />}
          keyboardType="email-address"
        />

        <Divider
          style={{
            marginTop: 5,
            marginBottom: 5,
          }}
        />

        <List.Item
          title={translate(
            langPath.section.dashboard.dashboardFragments.ProfileFragments
              .yourOrders
          )}
          titleStyle={{ fontFamily: "Laila-Regular" }}
          left={(props) => <List.Icon {...props} icon="cart-arrow-up" />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => router.push(PATH_DASHBOARD.orders.list)}
        />

        {/* <List.Item
          title={translate(langPath.app.dashboard.preferences.title)}
          titleStyle={{ fontFamily: "Laila-Regular" }}
          left={(props) => <List.Icon {...props} icon="cog" />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => router.push(PATH_DASHBOARD.preferences)}
          style={{ borderRadius: 10 }}
        /> */}

        <Button
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
            borderRadius: 10,
          }}
          icon="logout"
          mode="elevated"
          onPress={logout}
          labelStyle={{ fontFamily: "Laila-Regular" }}
        >
          {translate(langPath.auth.logOut)}
        </Button>
      </ScrollView>
    </Fragment>
  );
}
