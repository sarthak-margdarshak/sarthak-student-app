import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Appbar, Chip, Divider, List, useTheme } from "react-native-paper";
import { appwriteDatabases } from "../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../config-global";
import { Query } from "appwrite";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { Toast } from "react-native-toast-notifications";
import MockTestListItem from "../../../../../sections/dashboard/mockTest/MockTestListItem";

export default function ProductMockTestList() {
  const { productId } = useLocalSearchParams();
  const theme = useTheme();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      var x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        productId,
        [Query.select(["name", "mockTestIds", "$id"])]
      );
      setProduct(x);
    } catch (error) {
      Toast.show(error.message, {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

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
          title={"Mock Test Series"}
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
        {loading ? (
          <Skeleton
            count={10}
            height={50}
            color={theme.colors.inverseOnSurface}
          />
        ) : (
          <List.Section>
            {product?.mockTestIds?.map((mockTest) => (
              <View key={mockTest.$id}>
                <MockTestListItem id={mockTest} />
                <Divider />
              </View>
            ))}
          </List.Section>
        )}
      </ScrollView>
    </Fragment>
  );
}
