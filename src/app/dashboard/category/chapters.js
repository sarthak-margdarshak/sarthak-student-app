import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Appbar, Divider, List, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { router } from "expo-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Skeleton } from "react-native-skeletons";
import { Toast } from "react-native-toast-notifications";

export default function chapters() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [chapterList, setChapterList] = useState([]);
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
            Query.select(["chapters", "$id"]),
          ]
        );

        var chapters = new Map();
        for (let i in x) {
          for (j in x[i].chapters) {
            const y = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.chapters,
              x[i].chapters[j]
            );
            if (!chapters.has(y.$id)) {
              chapters.set(y.$id, y.name);
            }
          }
        }
        var z = [];
        chapters.forEach((value, key) => z.push({ $id: key, name: value }));
        setChapterList(z);
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
          title="All Chapters"
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
            List of all Chapters
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
              {chapterList.map((chapter) => (
                <Fragment key={chapter?.$id}>
                  <List.Item
                    title={chapter?.name}
                    right={(props) => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                    titleStyle={{ fontFamily: "Laila-Regular" }}
                    onPress={() =>
                      router.push(
                        PATH_DASHBOARD.product.list +
                          "?chapters=" +
                          chapter?.$id
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
