import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Appbar, Divider, List, Text, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { Stack, router } from "expo-router";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { Skeleton } from "react-native-skeletons";
import { Toast } from "react-native-toast-notifications";

export default function standards() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [standardList, setStandardList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const x = await AppwriteHelper.listAllDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          [
            Query.notEqual("$id", APPWRITE_API.documents.dummyProduct),
            Query.equal("published", true),
            Query.select(["standards", "$id"]),
          ]
        );

        var standards = new Map();
        for (let i in x) {
          for (j in x[i].standards) {
            const y = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.standards,
              x[i].standards[j]
            );
            if (!standards.has(y.$id)) {
              standards.set(y.$id, y.name);
            }
          }
        }
        var z = [];
        standards.forEach((value, key) => z.push({ $id: key, name: value }));
        setStandardList(z);
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
          title="All Classes"
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
        <List.Section>
          <List.Subheader
            style={{ fontWeight: "bold", fontFamily: "Laila-Regular" }}
          >
            List of all Classes
          </List.Subheader>
          <Divider bold />
          {loading ? (
            <Skeleton
              height={50}
              count={5}
              color={theme.colors.inverseOnSurface}
            />
          ) : (
            <View>
              {standardList.map((standard) => (
                <Fragment key={standard?.$id}>
                  <List.Item
                    title={standard?.name}
                    titleStyle={{ fontFamily: "Laila-Regular" }}
                    right={(props) => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                    onPress={() =>
                      router.push(
                        "/dashboard/product/list?standards=" + standard?.$id
                      )
                    }
                  />
                  <Divider />
                </Fragment>
              ))}
            </View>
          )}
        </List.Section>
      </ScrollView>
    </View>
  );
}
