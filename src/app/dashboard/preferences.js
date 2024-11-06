import { View } from "react-native";
import { SettingsFragment } from "../../sections/dashboard/DashboardFragments";
import { Appbar } from "react-native-paper";
import { router } from "expo-router";
import { PATH_DASHBOARD } from "../../routes/paths";

export default function Preferences() {
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
          title="Preferences"
        />
      </Appbar.Header>

      <SettingsFragment />
    </View>
  );
}
