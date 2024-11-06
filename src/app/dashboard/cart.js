import { Dimensions, ScrollView, View } from "react-native";
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
import { Toast } from "react-native-toast-notifications";

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

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const x = await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.orders,
        ID.unique(),
        {
          amount_total: parseFloat(totalBill) * 100,
          amount_to_be_paid: parseFloat(totalBill) * 100,
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
      Toast.show(error.message, {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    }
    setPlacingOrder(false);
  };

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
          title="Cart"
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
                    fontFamily: "Laila-Regular",
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
                    fontFamily: "Laila-Regular",
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
                  labelStyle={{ fontFamily: "Laila-Regular" }}
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
                    cartPage
                  />
                ))}

                <Surface
                  style={{
                    padding: 5,
                    marginTop: 5,
                    marginBottom: 5,
                    backgroundColor: theme.colors.infoContainer,
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
                    <View>
                      <Text
                        variant="bodyLarge"
                        style={{
                          fontWeight: "bold",
                          fontFamily: "Laila-Regular",
                        }}
                      >
                        {"₹" + totalBill}
                      </Text>

                      <Text
                        variant="bodySmall"
                        style={{
                          fontFamily: "Laila-Regular",
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
                        style={{
                          borderRadius: 10,
                        }}
                        labelStyle={{ fontFamily: "Laila-Regular" }}
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
