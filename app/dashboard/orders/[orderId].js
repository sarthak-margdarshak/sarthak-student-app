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

import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
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
import RazorpayCheckout from "react-native-razorpay";
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
            Query.select(["name", "sellPrice", "mrp"]),
          ]
        );
        setOrderObj(x);
      } catch (error) {
        // ToastAndroid.show(error.message, ToastAndroid.SHORT);
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
      // ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    setCreatingOrder(false);

    if (razorpay_order_id) {
      var options = {
        key: RAZORPAY_API.keyId,
        amount: orderObj.amount_to_be_paid,
        currency: "INR",
        name: "Sarthak Margdarshak",
        description: "Sarthak Margdarshk - Mock Test Series - purchase",
        image:
          "https://api.sarthakmargdarshak.in/v1/storage/buckets/66831750aac03d4d2f6e/files/668317a028ab1ae5fa6d/view?project=6639f48744439b98db71&mode=admin",
        order_id: razorpay_order_id,
        prefill: {
          email: studentProfile.email,
          name: studentProfile.name,
        },
        notes: { studentId: studentProfile.$id },
        theme: { color: "#" + rgbHex(theme.colors.primary) },
        timeout: 300,
        send_sms_hash: true,
      };
      RazorpayCheckout.open(options)
        .then(async (data) => {
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
            // ToastAndroid.show(
            //   "Payment verfication Successful",
            //   ToastAndroid.LONG
            // );
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
        })
        .catch((error) => {
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
    } else {
      // ToastAndroid.show(
      //   "Retry Payment by restarting the app",
      //   ToastAndroid.SHORT
      // );
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
      // ToastAndroid.show(error.message, ToastAndroid.SHORT);
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
      // ToastAndroid.show("Payment verfication Successful", ToastAndroid.LONG);
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
      <Stack.Screen
        options={{
          title: "Order ID - " + orderId,
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
            count={5}
            height={80}
            color={theme.colors.inverseOnSurface}
          />
        ) : (
          <View>
            <Card style={{ margin: 5 }}>
              <Card.Title title="Mock Test Series Product" />
              <Divider />
              <Card.Content>
                {orderObj.products?.map((product) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      margin: 5,
                      padding: 5,
                    }}
                    key={product.$id}
                  >
                    <View>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          color: theme.colors.tertiary,
                        }}
                        variant="titleSmall"
                      >
                        <Link href={PATH_DASHBOARD.product.view(product.$id)}>
                          {product.name}
                        </Link>
                      </Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <Text variant="titleSmall">
                        {"₹" + product.sellPrice + "/-"}
                      </Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>

            <Surface style={{ borderRadius: 15, padding: 10, margin: 5 }}>
              <Text variant="headlineSmall">Bill Summary</Text>

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
                  <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                    Item Total & GST
                  </Text>
                </View>

                <View style={{ justifyContent: "center" }}>
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
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
                  <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                    Coupon Discount
                  </Text>
                </View>

                <View style={{ justifyContent: "center" }}>
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
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
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                    Total
                  </Text>
                </View>

                <View style={{ justifyContent: "center" }}>
                  <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                    {"₹" + orderObj.amount_to_be_paid / 100 + "/-"}
                  </Text>
                </View>
              </View>
            </Surface>

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
                    style={{ color: theme.colors.onSuccessContainer }}
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
                    <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                      {orderObj.payment_id}
                    </Text>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
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
                  }}
                >
                  NOTE : HOW TO ACCESS THIS PURCHASED MOCK TEST SERIES
                </Text>
                <Text
                  variant="labelSmall"
                  style={{ marginRight: 10, marginBottom: 5, marginLeft: 20 }}
                >
                  1. BY CLICKING THE MOCK TEST SERIES ON THE TOP OF THIS PAGE.
                </Text>
                <Text
                  variant="labelSmall"
                  style={{ marginRight: 10, marginBottom: 5, marginLeft: 20 }}
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
                      style={{ color: theme.colors.onErrorContainer }}
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
                      <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                        {orderObj.attempts + " attempts made."}
                      </Text>
                    </View>

                    <View style={{ justifyContent: "center" }}>
                      <Text
                        variant="titleMedium"
                        style={{ fontWeight: "bold" }}
                      >
                        {timeAgo.format(new Date(orderObj.last_payment_date))}
                      </Text>
                    </View>
                  </View>
                </Surface>
                <Button
                  style={{ margin: 5 }}
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
                    : "Retry Payment"}
                </Button>
              </View>
            )}

            {orderObj.status === "created" && (
              <Button
                style={{ margin: 5 }}
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
              <Text variant="labelSmall" style={{ margin: 10 }}>
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
          <Dialog.Title>{paymentError?.title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{paymentError?.description}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleErrorDialoge(false)}>
              Dismiss
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Fragment>
  );
}
