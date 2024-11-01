import { useEffect, useState } from "react";
import { Dimensions, RefreshControl, ScrollView, View } from "react-native";
import { useAuthContext } from "../../auth/useAuthContext";
import ProductMediumComponentLoading from "../../sections/dashboard/mockSeries/ProductMediumComponentLoading";
import { Button, Text, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { PATH_DASHBOARD } from "../../routes/paths";
import { appwriteDatabases, appwriteStorage } from "../../auth/AppwriteContext";
import { APPWRITE_API } from "../../config-global";
import { NoDataFoundDark } from "../../components/SVG/NoDataFoundDark";
import { NoDataFoundLight } from "../../components/SVG/NoDataFoundLight";
import { langPath, useLocales } from "../../locales";
import ProductSmallComponent from "../../sections/dashboard/mockSeries/ProductSmallComponent";

export default function PurchasedProductFragment() {
  const { studentProfile } = useAuthContext();
  const theme = useTheme();
  const { translate } = useLocales();

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
      // ToastAndroid.show(error.message, ToastAndroid.LONG);
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
            <View
              style={{
                height: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {theme.dark ? <NoDataFoundDark /> : <NoDataFoundLight />}

              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurfaceDisabled, marginTop: 50 }}
              >
                {translate(
                  langPath.section.dashboard.dashboardFragments.purchased.noData
                    .title
                )}
              </Text>

              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceDisabled, marginTop: 10 }}
              >
                {translate(
                  langPath.section.dashboard.dashboardFragments.purchased.noData
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
                <ProductSmallComponent product={product} key={product?.$id} />
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
