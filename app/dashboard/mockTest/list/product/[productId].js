import { Stack, router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  ToastAndroid,
  View,
} from "react-native";
import { Chip, Divider, List, Text, useTheme } from "react-native-paper";
import { appwriteDatabases } from "../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../config-global";
import { Query } from "appwrite";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../../../routes/paths";

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
        [Query.select(["name", "mockTestIds"])]
      );
      for (let i in x.mockTestIds) {
        x.mockTestIds[i] = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTest,
          x.mockTestIds[i],
          [Query.select(["name", "description", "level"])]
        );
      }
      setProduct(x);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  return (
    <Fragment>
      <Stack.Screen
        options={{
          title: loading ? "Series Name" : product?.name,
        }}
      />

      <ScrollView
        style={{
          height: Dimensions.get("window").height,
          backgroundColor: theme.colors.surface,
          padding: 10,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
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
                  description={mockTest.description}
                  onPress={() =>
                    router.push(PATH_DASHBOARD.mockTest.attempts(mockTest.$id))
                  }
                  right={(props) => (
                    <>
                      <Chip
                        {...props}
                        mode="outlined"
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
