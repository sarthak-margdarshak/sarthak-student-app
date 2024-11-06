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
      for (let i in x.mockTestIds) {
        x.mockTestIds[i] = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTest,
          x.mockTestIds[i],
          [Query.select(["name", "description", "level", "$id"])]
        );
      }
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
          title={product?.name}
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
                <List.Item
                  title={mockTest.name}
                  titleStyle={{ fontFamily: "Laila-Regular" }}
                  description={mockTest.description}
                  descriptionStyle={{ fontFamily: "Laila-Regular" }}
                  onPress={() =>
                    router.push(PATH_DASHBOARD.mockTest.attempts(mockTest.$id))
                  }
                  right={(props) => (
                    <>
                      <Chip
                        {...props}
                        mode="outlined"
                        textStyle={{ fontFamily: "Laila-Regular" }}
                        selectedColor={
                          mockTest.level === "HARD"
                            ? theme.colors.error
                            : mockTest.level === "MEDIUM"
                            ? theme.colors.info
                            : theme.colors.success
                        }
                      >
                        {mockTest.level}
                      </Chip>
                      <List.Icon {...props} icon="chevron-right" />
                    </>
                  )}
                />
                <Divider />
              </View>
            ))}
          </List.Section>
        )}
      </ScrollView>
    </Fragment>
  );
}
