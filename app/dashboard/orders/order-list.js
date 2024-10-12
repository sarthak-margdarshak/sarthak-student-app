/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 *
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 *
 */

import { Stack, router } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  ToastAndroid,
  View,
} from "react-native";
import { Button, Card, Icon, Text, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { timeAgo } from "../../../auth/AppwriteContext";
import { langPath, useLocales } from "../../../locales";
import { EmptyOrderDark } from "../../../components/SVG/EmptyOrderDark";
import { EmptyOrderLight } from "../../../components/SVG/EmptyOrderLight";

export default function orderList() {
  const theme = useTheme();
  const { studentProfile } = useAuthContext();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(false);
  const [ordersList, setOrdersList] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      var queries = [];
      queries.push(Query.orderDesc("$createdAt"));
      const x = await AppwriteHelper.listAllDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.orders,
        queries
      );

      for (let i in x) {
        x[i].products = await AppwriteHelper.listAllDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          [
            Query.notEqual("$id", APPWRITE_API.documents.dummyProduct),
            Query.equal("$id", x[i].products),
            Query.select(["name"]),
          ]
        );
      }
      setOrdersList(x);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [studentProfile]);

  return (
    <Fragment>
      <Stack.Screen
        options={{
          title: translate(langPath.app.dashboard.orders.title),
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
            height={100}
            color={theme.colors.inverseOnSurface}
          />
        ) : (
          <View>
            {ordersList.length === 0 ? (
              <View
                style={{
                  height: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme.dark ? <EmptyOrderDark /> : <EmptyOrderLight />}

                <Text
                  variant="bodyLarge"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 50,
                  }}
                >
                  {translate(langPath.app.dashboard.orders.list.empty.title)}
                </Text>

                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 10,
                  }}
                >
                  {translate(
                    langPath.app.dashboard.orders.list.empty.description
                  )}
                </Text>

                <Button
                  mode="elevated"
                  icon="file-find"
                  onPress={() => router.push(PATH_DASHBOARD.product.list)}
                  style={{ marginTop: 40, borderRadius: 10 }}
                >
                  {translate(
                    langPath.section.dashboard.dashboardFragments.exploreMockBtn
                  )}
                </Button>
              </View>
            ) : (
              <View>
                {ordersList.map((order) => (
                  <Card
                    key={order.$id}
                    onPress={() =>
                      router.push(PATH_DASHBOARD.orders.view(order.$id))
                    }
                    style={{ margin: 5 }}
                  >
                    <Card.Title
                      title={order.$id}
                      subtitle={timeAgo.format(new Date(order.$createdAt))}
                      right={(props) => (
                        <Icon {...props} source="chevron-right" />
                      )}
                    />
                    <Card.Content>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          margin: 5,
                          padding: 5,
                        }}
                      >
                        <View>
                          {order.products.map((product) => (
                            <Text key={product?.$id} variant="bodyMedium">
                              {product.name}
                            </Text>
                          ))}
                        </View>

                        <View style={{ justifyContent: "center" }}>
                          <Icon
                            source={
                              order.status === "success"
                                ? "checkbox-multiple-marked-circle"
                                : order.status === "failure"
                                ? "alert"
                                : ""
                            }
                            size={25}
                          />
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </Fragment>
  );
}
