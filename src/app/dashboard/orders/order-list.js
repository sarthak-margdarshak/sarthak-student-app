import { router } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Divider,
  Icon,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { appwriteStorage, timeAgo } from "../../../auth/AppwriteContext";
import { langPath, useLocales } from "../../../locales";
import { EmptyOrderDark } from "../../../components/SVG/EmptyOrderDark";
import { EmptyOrderLight } from "../../../components/SVG/EmptyOrderLight";
import { Toast } from "react-native-toast-notifications";
import { Col, Container, Row } from "react-bootstrap";

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
          ]
        );
      }

      for (let i in x) {
        for (let j in x[i].products) {
          x[i].products[j].images[0] = appwriteStorage.getFilePreview(
            APPWRITE_API.buckets.productFiles,
            x[i].products[j].images[0],
            undefined,
            undefined,
            undefined
          ).href;
        }
      }
      setOrdersList(x);
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
  }, [studentProfile]);

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
          title="Your Orders"
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
                    fontFamily: "Laila-Regular",
                  }}
                >
                  {translate(langPath.app.dashboard.orders.list.empty.title)}
                </Text>

                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 10,
                    fontFamily: "Laila-Regular",
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
                  labelStyle={{ fontFamily: "Laila-Regular" }}
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
                      title={"Order Id - " + order.$id}
                      titleStyle={{ fontFamily: "Laila-Regular" }}
                      subtitle={timeAgo.format(new Date(order.$createdAt))}
                      subtitleStyle={{ fontFamily: "Laila-Regular" }}
                      left={(props) => (
                        <Icon
                          source={
                            order.status === "success"
                              ? "checkbox-multiple-marked-circle"
                              : order.status === "failure"
                              ? "alert"
                              : "shopping"
                          }
                          size={25}
                        />
                      )}
                      right={(props) => (
                        <Icon {...props} source="chevron-right" />
                      )}
                    />
                    <Divider />
                    <Card.Content>
                      <Container>
                        <Row>
                          {order.products.map((product) => (
                            <Col
                              xs={3}
                              key={product?.$id + Math.random().toString()}
                              style={{ marginTop: 10, marginBottom: 30 }}
                            >
                              <Surface elevation={1} style={{ height: 70 }}>
                                <Image
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  source={{ uri: product?.images[0] }}
                                  alt="background"
                                />
                                <Text
                                  variant="labelSmall"
                                  style={{
                                    fontFamily: "Laila-Regular",
                                    marginTop: 2,
                                  }}
                                >
                                  {product.name}
                                </Text>
                              </Surface>
                            </Col>
                          ))}
                        </Row>
                      </Container>
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
