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
import { Dimensions, ScrollView, ToastAndroid, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { timeAgo } from "../../../auth/AppwriteContext";

export default function orderList() {
  const theme = useTheme();
  const { studentProfile } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
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
    fetchData();
  }, [studentProfile]);
  return (
    <Fragment>
      <Stack.Screen
        options={{
          title: "Orders",
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
          // paddingTop: 80,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        {loading ? (
          <Skeleton
            count={10}
            height={100}
            color={theme.colors.inverseOnSurface}
          />
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
                  right={(props) => <Icon {...props} source="chevron-right" />}
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
      </ScrollView>
    </Fragment>
  );
}
