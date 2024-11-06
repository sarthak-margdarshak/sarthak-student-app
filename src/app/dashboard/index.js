import { Dimensions, ScrollView, View } from "react-native";
import MotivationBox from "../../sections/dashboard/MotivationBox";
import AllProductComponent from "../../sections/dashboard/mockSeries/AllProductComponent";
import ClasswiseComponent from "../../sections/dashboard/mockSeries/ClasswiseComponent";
import SubjectWiseComponent from "../../sections/dashboard/mockSeries/SubjectWiseComponent";
import ChapterWiseComponent from "../../sections/dashboard/mockSeries/ChapterWiseComponent";
import { Appbar, Divider, Menu } from "react-native-paper";
import { langPath, useLocales } from "../../locales";
import { router } from "expo-router";
import { useState } from "react";
import { PATH_DASHBOARD } from "../../routes/paths";

export default function DashboardPage() {
  const { translate } = useLocales();
  const [visible, setVisible] = useState(false);

  return (
    <View>
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
          title={translate(langPath.app.dashboard.layout.stackTitle)}
        />
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setVisible(true)}
            />
          }
        >
          <Menu.Item
            leadingIcon="account"
            onPress={() => {
              setVisible(false);
              router.push(PATH_DASHBOARD.profile);
            }}
            titleStyle={{ fontFamily: "Laila-Regular" }}
            title="Profile"
          />
          <Divider />
          <Menu.Item
            leadingIcon="badge-account-horizontal"
            onPress={() => {
              setVisible(false);
              router.push(PATH_DASHBOARD.purchased);
            }}
            title="Purchased"
            titleStyle={{ fontFamily: "Laila-Regular" }}
          />
          <Menu.Item
            leadingIcon="cart"
            title="Cart"
            onPress={() => {
              setVisible(false);
              router.push(PATH_DASHBOARD.cart);
            }}
            titleStyle={{ fontFamily: "Laila-Regular" }}
          />
        </Menu>
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
        <MotivationBox />

        <AllProductComponent />

        <ClasswiseComponent />

        <SubjectWiseComponent />

        <ChapterWiseComponent />
      </ScrollView>
    </View>
  );
}
