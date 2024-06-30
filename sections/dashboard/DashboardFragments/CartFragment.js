import { Dimensions, ScrollView, ToastAndroid, View } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { useEffect, useState } from "react";
import ProductMediumComponentLoading from "../mockSeries/ProductMediumComponentLoading";
import {
  appwriteDatabases,
  appwriteStorage,
} from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import ProductMediumComponent from "../mockSeries/ProductMediumComponent";
import { router } from "expo-router";
import { PATH_DASHBOARD } from "../../../routes/paths";

export default function CartFragment() {
  const theme = useTheme();
  const { studentProfile, updateCart } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalBill, setTotalBill] = useState(0);

  useEffect(() => {
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
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      setLoading(false);
    };
    fetchData();
  }, [studentProfile]);

  return (
    <ScrollView
      style={{
        height: Dimensions.get("window").height,
        backgroundColor: theme.colors.surface,
        margin: 10,
      }}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets={true}
    >
      {loading ? (
        <ProductMediumComponentLoading count={3} />
      ) : (
        <View>
          {products.length === 0 ? (
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
                  <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
                    Empty Cart
                  </Text>
                </View>

                <View style={{ justifyContent: "center" }}>
                  <Button
                    mode="contained"
                    icon="file-find"
                    onPress={() => router.push(PATH_DASHBOARD.product.list)}
                  >
                    Explore Mock Series
                  </Button>
                </View>
              </View>
            </Surface>
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
                    <Button mode="contained" icon="cart-check">
                      Buy
                    </Button>
                  </View>
                </View>
              </Surface>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
