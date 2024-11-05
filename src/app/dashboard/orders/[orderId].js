import { Link, router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Dialog,
  Divider,
  Icon,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import {
  appwriteDatabases,
  appwriteFunctions,
  timeAgo,
} from "../../../auth/AppwriteContext";
import { APPWRITE_API, RAZORPAY_API } from "../../../config-global";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Skeleton } from "react-native-skeletons";
import { Query } from "appwrite";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { useAuthContext } from "../../../auth/useAuthContext";
import rgbHex from "rgb-hex";
import { Toast } from "react-native-toast-notifications";

export default function orderPage() {
  const { orderId } = useLocalSearchParams();
  const { studentProfile, updateStudentProfile } = useAuthContext();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [orderObj, setOrderObj] = useState({});
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [visibleErrorDialoge, setVisibleErrorDialoge] = useState(false);
  const [paymentError, setPaymentError] = useState({});
  const [backendValidating, setBackendValidating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        var x = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.orders,
          orderId
        );

        x.products = await AppwriteHelper.listAllDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          [
            Query.equal("$id", x.products),
            Query.select(["name", "sellPrice", "mrp", "$id"]),
          ]
        );
        setOrderObj(x);
      } catch (error) {
        Toast.show(error.message, {
          type: "danger",
          textStyle: { fontFamily: "Laila-Regular" },
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [orderId]);

  const startPayment = async () => {
    if (orderObj.amount_to_be_paid === 0) {
      startZeroCashPayment();
      return;
    }
    var razorpay_order_id = orderObj.razorpay_order_id;
    setCreatingOrder(true);
    try {
      // Create order_id from backend only if there is no razorpay_order_id
      if (!razorpay_order_id) {
        const x = await appwriteFunctions.createExecution(
          APPWRITE_API.functions.createOrder,
          JSON.stringify({ amount: orderObj.amount_to_be_paid })
        );
        const response = JSON.parse(x.response);
        if (response.success) {
          await appwriteDatabases.updateDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.orders,
            orderId,
            { razorpay_order_id: response.razorPayId, payment_mode: "razorpay" }
          );
          setOrderObj({
            ...orderObj,
            razorpay_order_id: response.razorPayId,
            payment_mode: "razorpay",
          });
          razorpay_order_id = response.razorPayId;
        } else {
          throw new Error("Error in creating an payment order for you.");
        }
      }
    } catch (error) {
      Toast.show(error.message, {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    }
    setCreatingOrder(false);

    if (razorpay_order_id) {
      var options = {
        key: RAZORPAY_API.keyId,
        key_secret: RAZORPAY_API.secret,
        amount: orderObj.amount_to_be_paid,
        currency: "INR",
        name: "Sarthak Margdarshak",
        description: "Sarthak Margdarshk - Mock Test Series - purchase",
        image:
          "https://api.sarthakmargdarshak.in/v1/storage/buckets/672a50aa003599f495e8/files/672a50c8003897892e6a/view?project=671f66a0001e5803f481&project=671f66a0001e5803f481&mode=admin",
        order_id: razorpay_order_id,
        prefill: {
          email: studentProfile.email,
          name: studentProfile.name,
        },
        handler: async function (data) {
          setBackendValidating(true);
          const y = await appwriteFunctions.createExecution(
            APPWRITE_API.functions.confirmPayment,
            JSON.stringify({
              payment_mode: "razorpay",
              sarthak_order_id: orderId,
              razorpay_order_id: razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
            })
          );

          const response = JSON.parse(y.response);

          if (response.payment_verification !== "success") {
            setPaymentError({
              title: "Payment Verfication Failed",
              description: response.errorMessage,
            });
            setVisibleErrorDialoge(true);

            appwriteDatabases.updateDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.orders,
              orderId,
              {
                status: "failure",
                last_payment_date: new Date(),
                attempts: orderObj.attempts + 1,
              }
            );

            setOrderObj({
              ...orderObj,
              status: "failure",
              last_payment_date: new Date(),
              attempts: orderObj.attempts + 1,
            });
          } else {
            Toast.show("Payment verfication Successful", {
              type: "success",
              textStyle: { fontFamily: "Laila-Regular" },
            });
            appwriteDatabases.updateDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.orders,
              orderId,
              {
                status: "success",
                last_payment_date: new Date(),
                payment_id: data.razorpay_payment_id,
                attempts: orderObj.attempts + 1,
              }
            );

            setOrderObj({
              ...orderObj,
              status: "success",
              payment_id: data.razorpay_payment_id,
              last_payment_date: new Date(),
              attempts: orderObj.attempts + 1,
            });
          }

          await updateStudentProfile();
          setBackendValidating(false);
        },
        notes: { studentId: studentProfile.$id },
        theme: { color: "#" + rgbHex(theme.colors.primary) },
        timeout: 300,
        send_sms_hash: true,
      };

      var rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (error) {
        // handle failure, update status and attempts, store error message
        setPaymentError({
          title: error?.error?.reason,
          description: error?.error?.description,
        });
        setVisibleErrorDialoge(true);

        appwriteDatabases.updateDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.orders,
          orderId,
          {
            status: "failure",
            last_payment_date: new Date(),
            attempts: orderObj.attempts + 1,
          }
        );

        setOrderObj({
          ...orderObj,
          status: "failure",
          last_payment_date: new Date(),
          attempts: orderObj.attempts + 1,
        });
      });

      rzp1.open();
    } else {
      Toast.show("Retry Payment by restarting the app", {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    }
  };

  const startZeroCashPayment = async () => {
    setCreatingOrder(true);
    try {
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.orders,
        orderId,
        {
          payment_mode: "zero_cash",
          last_payment_date: new Date(),
        }
      );
      setOrderObj({
        ...orderObj,
        payment_mode: "zero_cash",
        last_payment_date: new Date(),
      });
    } catch (error) {
      Toast.show(error.message, {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    }
    setCreatingOrder(false);

    setBackendValidating(true);
    const y = await appwriteFunctions.createExecution(
      APPWRITE_API.functions.confirmPayment,
      JSON.stringify({
        payment_mode: "zero_cash",
        sarthak_order_id: orderId,
        razorpay_order_id: "",
        razorpay_payment_id: "",
        razorpay_signature: "",
      })
    );

    const response = JSON.parse(y.response);

    if (response.payment_verification !== "success") {
      setPaymentError({
        title: "Payment Verfication Failed",
        description: response.errorMessage,
      });
      setVisibleErrorDialoge(true);

      appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.orders,
        orderId,
        {
          status: "failure",
          last_payment_date: new Date(),
          attempts: orderObj.attempts + 1,
        }
      );

      setOrderObj({
        ...orderObj,
        status: "failure",
        last_payment_date: new Date(),
        attempts: orderObj.attempts + 1,
      });
    } else {
      Toast.show("Payment verfication Successful", {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
      appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.orders,
        orderId,
        {
          status: "success",
          last_payment_date: new Date(),
          attempts: orderObj.attempts + 1,
        }
      );

      setOrderObj({
        ...orderObj,
        status: "success",
        last_payment_date: new Date(),
        attempts: orderObj.attempts + 1,
      });
    }
    await updateStudentProfile();
    setBackendValidating(false);
  };

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
          title={"Order ID - " + orderId}
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
            count={5}
            height={80}
            color={theme.colors.inverseOnSurface}
          />
        ) : (
          <View>
            <Card style={{ margin: 5 }}>
              <Card.Title
                title="Mock Test Series Products - "
                titleStyle={{ fontFamily: "Laila-Regular", fontWeight: "bold" }}
              />
              <Divider />
              <Card.Content>
                {orderObj.products?.map((product) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 3,
                      marginLeft: 5,
                      marginRight: 5,
                      padding: 5,
                    }}
                    key={product.$id}
                  >
                    <View>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          color: theme.colors.tertiary,
                          fontFamily: "Laila-Regular",
                        }}
                        variant="titleSmall"
                      >
                        <Link href={PATH_DASHBOARD.product.view(product.$id)}>
                          {product.name}
                        </Link>
                      </Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        variant="titleSmall"
                        style={{ fontFamily: "Laila-Regular" }}
                      >
                        {"₹" + product.sellPrice + "/-"}
                      </Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>

            <Card style={{ margin: 5 }}>
              <Card.Title
                title="Bill Summary - "
                titleStyle={{ fontFamily: "Laila-Regular", fontWeight: "bold" }}
              />
              <Divider />
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
                    <Text
                      variant="titleSmall"
                      style={{
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      Item Total & GST
                    </Text>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <Text
                      variant="titleSmall"
                      style={{
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      {"₹" + orderObj.amount_total / 100 + "/-"}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: 5,
                    padding: 5,
                  }}
                >
                  <View>
                    <Text
                      variant="titleSmall"
                      style={{
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      Coupon Discount
                    </Text>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <Text
                      variant="titleSmall"
                      style={{
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      {"₹" + orderObj.coupon_applied / 100 + "/-"}
                    </Text>
                  </View>
                </View>

                <Divider />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: 5,
                    padding: 5,
                  }}
                >
                  <View>
                    <Text
                      variant="titleSmall"
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      Total
                    </Text>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <Text
                      variant="titleSmall"
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      {"₹" + orderObj.amount_to_be_paid / 100 + "/-"}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {orderObj.status === "success" && (
              <Surface
                style={{
                  borderRadius: 15,
                  padding: 10,
                  margin: 5,
                  backgroundColor: theme.colors.successContainer,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: 5,
                    padding: 5,
                  }}
                >
                  <Text
                    variant="headlineSmall"
                    style={{
                      color: theme.colors.onSuccessContainer,
                      fontFamily: "Laila-Regular",
                    }}
                  >
                    Payment Done Successfully
                  </Text>

                  <View style={{ justifyContent: "center" }}>
                    <Icon source="checkbox-multiple-marked-circle" size={25} />
                  </View>
                </View>
                <Divider style={{ margin: 5 }} />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: 5,
                    padding: 5,
                  }}
                >
                  <View>
                    <Text
                      variant="titleSmall"
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      {orderObj.payment_id}
                    </Text>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <Text
                      variant="titleMedium"
                      style={{
                        fontWeight: "bold",
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      {timeAgo.format(new Date(orderObj.last_payment_date))}
                    </Text>
                  </View>
                </View>

                <Text
                  variant="labelLarge"
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 5,
                    fontWeight: "bold",
                    fontFamily: "Laila-Regular",
                  }}
                >
                  NOTE : HOW TO ACCESS THIS PURCHASED MOCK TEST SERIES
                </Text>
                <Text
                  variant="labelSmall"
                  style={{
                    marginRight: 10,
                    marginBottom: 5,
                    marginLeft: 20,
                    fontFamily: "Laila-Regular",
                  }}
                >
                  1. BY CLICKING THE MOCK TEST SERIES ON THE TOP OF THIS PAGE.
                </Text>
                <Text
                  variant="labelSmall"
                  style={{
                    marginRight: 10,
                    marginBottom: 5,
                    marginLeft: 20,
                    fontFamily: "Laila-Regular",
                  }}
                >
                  2. YOU CAN FIND ALL PURCHASED ON THE `PURCHASED` TAB OF MAIN
                  PAGE OF APP.
                </Text>
              </Surface>
            )}

            {orderObj.status === "failure" && (
              <View>
                <Surface
                  style={{
                    borderRadius: 15,
                    padding: 10,
                    margin: 5,
                    backgroundColor: theme.colors.errorContainer,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      margin: 5,
                      padding: 5,
                    }}
                  >
                    <Text
                      variant="headlineSmall"
                      style={{
                        color: theme.colors.onErrorContainer,
                        fontFamily: "Laila-Regular",
                      }}
                    >
                      Payment Failed
                    </Text>

                    <View style={{ justifyContent: "center" }}>
                      <Icon source="alert" size={25} />
                    </View>
                  </View>

                  <Divider style={{ margin: 5 }} />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      margin: 5,
                      padding: 5,
                    }}
                  >
                    <View>
                      <Text
                        variant="titleSmall"
                        style={{
                          fontWeight: "bold",
                          fontFamily: "Laila-Regular",
                        }}
                      >
                        {orderObj.attempts + " attempts made."}
                      </Text>
                    </View>

                    <View style={{ justifyContent: "center" }}>
                      <Text
                        variant="titleMedium"
                        style={{
                          fontWeight: "bold",
                          fontFamily: "Laila-Regular",
                        }}
                      >
                        {timeAgo.format(new Date(orderObj.last_payment_date))}
                      </Text>
                    </View>
                  </View>
                </Surface>
                <Button
                  style={{
                    marginLeft: 50,
                    marginRight: 50,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  mode="contained"
                  icon="contactless-payment"
                  onPress={startPayment}
                  loading={
                    backendValidating ? true : creatingOrder ? true : false
                  }
                  labelStyle={{ fontFamily: "Laila-Regular" }}
                >
                  {backendValidating
                    ? "Verfication In Progress"
                    : creatingOrder
                    ? "Initiating Payment Gateway"
                    : "Retry Payment"}
                </Button>
              </View>
            )}

            {orderObj.status === "created" && (
              <Button
                style={{
                  margin: 5,
                  borderRadius: 10,
                  marginLeft: 30,
                  marginRight: 30,
                }}
                mode="contained"
                icon="contactless-payment"
                onPress={startPayment}
                loading={
                  backendValidating ? true : creatingOrder ? true : false
                }
              >
                {backendValidating
                  ? "Verfication In Progress"
                  : creatingOrder
                  ? "Initiating Payment Gateway"
                  : "Pay Now"}
              </Button>
            )}

            {(backendValidating || creatingOrder) && (
              <Text
                variant="labelSmall"
                style={{ margin: 10, fontFamily: "Laila-Regular" }}
              >
                *** PLEASE DO NOT PRESS BACK BUTTON WHILE PAYMENT VERIFICATION
                IS IN PROGRESS ***
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <Portal>
        <Dialog
          visible={visibleErrorDialoge}
          onDismiss={() => setVisibleErrorDialoge(false)}
        >
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{ fontFamily: "Laila-Regular" }}>
            {paymentError?.title}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ fontFamily: "Laila-Regular" }}>
              {paymentError?.description}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{ fontFamily: "Laila-Regular" }}
              onPress={() => setVisibleErrorDialoge(false)}
            >
              Dismiss
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Fragment>
  );
}
