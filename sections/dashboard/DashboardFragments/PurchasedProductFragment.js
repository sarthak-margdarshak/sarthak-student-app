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

import { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  ToastAndroid,
  View,
} from "react-native";
import { useAuthContext } from "../../../auth/useAuthContext";
import ProductMediumComponentLoading from "../mockSeries/ProductMediumComponentLoading";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import ProductMediumComponent from "../mockSeries/ProductMediumComponent";
import {
  appwriteDatabases,
  appwriteStorage,
} from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";

export default function PurchasedProductFragment() {
  const { studentProfile } = useAuthContext();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      var tmpProducts = [];
      for (let i in studentProfile?.purchased) {
        var product = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          studentProfile.purchased[i]
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
      }
      setProducts(tmpProducts);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
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
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
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
                  <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
                    No series
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
                <ProductMediumComponent product={product} key={product?.$id} />
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
