import { Dimensions, RefreshControl, ScrollView, View } from "react-native";
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
            src="public/assets/favicon/favicon-512x512.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="sarthak-logo"
            style={{ margin: 3 }}
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
            title="Profile"
          />
          <Divider />
          <Menu.Item
            leadingIcon="badge-account-horizontal"
            onPress={() => {}}
            title="Purchased"
          />
          <Menu.Item
            leadingIcon="cart"
            title="Cart"
            onPress={() => {
              setVisible(false);
              router.push(PATH_DASHBOARD.cart);
            }}
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
