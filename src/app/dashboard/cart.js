import { Dimensions, RefreshControl, ScrollView, View } from "react-native";
import { Appbar, Button, Surface, Text, useTheme } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";
import { useEffect, useState } from "react";
import { appwriteDatabases, appwriteStorage } from "../../auth/AppwriteContext";
import { APPWRITE_API } from "../../config-global";
import { router } from "expo-router";
import { PATH_DASHBOARD } from "../../routes/paths";
import { ID } from "appwrite";
import { EmptyCartDark } from "../../components/SVG/EmptyCartDark";
import { EmptyCartLight } from "../../components/SVG/EmptyCartLight";
import { langPath, useLocales } from "../../locales";
import ProductMediumComponentLoading from "../../sections/dashboard/mockSeries/ProductMediumComponentLoading";
import ProductMediumComponent from "../../sections/dashboard/mockSeries/ProductMediumComponent";

export default function CartFragment() {
  const theme = useTheme();
  const { studentProfile, updateCart } = useAuthContext();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalBill, setTotalBill] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      var tmpProducts = [];
      var tmpBill = 0;
      for (let i in studentProfile?.cart) {
        var product = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          studentProfile.cart[i]
        );

        for (let j in product.images) {
          product.images[j] = appwriteStorage.getFilePreview(
            APPWRITE_API.buckets.productFiles,
            product.images[j],
            undefined,
            undefined,
            undefined
          ).href;
        }

        for (let j in product.standards) {
          product.standards[j] = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.standards,
            product.standards[j]
          );
        }

        for (let j in product.subjects) {
          product.subjects[j] = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.subjects,
            product.subjects[j]
          );
        }

        tmpProducts.push(product);
        tmpBill += product.sellPrice;
      }
      setProducts(tmpProducts);
      setTotalBill(tmpBill);
    } catch (error) {
      // ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [studentProfile]);

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const x = await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.orders,
        ID.unique(),
        {
          amount_total: totalBill * 100,
          amount_to_be_paid: totalBill * 100,
          studentId: studentProfile.$id,
          products: products.map((value) => value.$id),
          status: "created",
        }
      );
      for (let i in products) {
        updateCart(products[i].$id, -1);
      }
      router.push(PATH_DASHBOARD.orders.view(x.$id));
    } catch (error) {
      // ToastAndroid.show(error.message, ToastAndroid.LONG);
      console.log(error.message);
    }
    setPlacingOrder(false);
  };

  return (
    <View>
      <Appbar.Header>
        {router.canGoBack() && (
          <Appbar.BackAction onPress={() => router.back()} />
        )}
        <Appbar.Content
          titleStyle={{ fontFamily: "Laila-Regular" }}
          title="Cart"
        />
      </Appbar.Header>

      <ScrollView
        style={{
          height: Dimensions.get("window").height,
          backgroundColor: theme.colors.surface,
          margin: 2,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
      >
        {loading ? (
          <ProductMediumComponentLoading count={3} />
        ) : (
          <View>
            {products.length === 0 ? (
              <View
                style={{
                  height: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme.dark ? <EmptyCartDark /> : <EmptyCartLight />}

                <Text
                  variant="bodyLarge"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 50,
                  }}
                >
                  {translate(
                    langPath.section.dashboard.dashboardFragments.cart.empty
                      .title
                  )}
                </Text>

                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 10,
                  }}
                >
                  {translate(
                    langPath.section.dashboard.dashboardFragments.cart.empty
                      .description
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
                {products.map((product) => (
                  <ProductMediumComponent
                    product={product}
                    key={product?.$id}
                    onRemove={() => updateCart(product?.$id, -1)}
                    cardePage
                  />
                ))}
                <Surface style={{ borderRadius: 15 }}>
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
                        variant="headlineLarge"
                        style={{ fontWeight: "bold" }}
                      >
                        {"₹" + totalBill}
                      </Text>

                      <Text
                        variant="headlineSmall"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Amount to be paid
                      </Text>
                    </View>

                    <View style={{ justifyContent: "center" }}>
                      <Button
                        mode="contained"
                        icon="cart-check"
                        onPress={placeOrder}
                        loading={placingOrder}
                      >
                        Checkout
                      </Button>
                    </View>
                  </View>
                </Surface>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
