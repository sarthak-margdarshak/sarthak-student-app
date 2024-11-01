import { Dimensions, ScrollView, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { useEffect, useState } from "react";
import {
  appwriteDatabases,
  appwriteStorage,
} from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import ProductMediumComponent from "../../../sections/dashboard/mockSeries/ProductMediumComponent";
import { router, useLocalSearchParams } from "expo-router";
import ProductMediumComponentLoading from "../../../sections/dashboard/mockSeries/ProductMediumComponentLoading";
import { Toast } from "react-native-toast-notifications";

export default function ProductList() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const { standards, subjects, chapters } = useLocalSearchParams();

  const [ProductList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        var query = [
          Query.notEqual("$id", APPWRITE_API.documents.dummyProduct),
          Query.equal("published", true),
          Query.orderDesc("$updatedAt"),
          Query.limit(100),
        ];

        if (standards !== undefined) {
          query.push(Query.search("standards", standards));
        }
        if (subjects !== undefined) {
          query.push(Query.search("subjects", subjects));
        }
        if (chapters !== undefined) {
          query.push(Query.search("chapters", chapters));
        }

        var x = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          query
        );

        for (let i in x.documents) {
          for (let j in x.documents[i].images) {
            x.documents[i].images[j] = appwriteStorage.getFilePreview(
              APPWRITE_API.buckets.productFiles,
              x.documents[i].images[j],
              undefined,
              undefined,
              undefined
            ).href;
          }

          for (let j in x.documents[i].standards) {
            x.documents[i].standards[j] = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.standards,
              x.documents[i].standards[j]
            );
          }

          for (let j in x.documents[i].subjects) {
            x.documents[i].subjects[j] = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.subjects,
              x.documents[i].subjects[j]
            );
          }
        }
        setProductList(x.documents);
      } catch (error) {
        Toast.show(error.message, {
          type: "danger",
          textStyle: { fontFamily: "Laila-Regular" },
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  return (
    <View>
      <Appbar.Header>
        {router.canGoBack() && (
          <Appbar.BackAction onPress={() => router.back()} />
        )}
        <Appbar.Content
          titleStyle={{ fontFamily: "Laila-Regular" }}
          title="Mock Test Series"
        />
      </Appbar.Header>

      <ScrollView
        style={{
          height: Dimensions.get("window").height,
          backgroundColor: theme.colors.surface,
        }}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        {loading ? (
          <ProductMediumComponentLoading count={4} />
        ) : (
          <>
            {ProductList.map((product) => (
              <ProductMediumComponent key={product?.$id} product={product} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
