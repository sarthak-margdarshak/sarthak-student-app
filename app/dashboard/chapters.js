import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { Divider, List, useTheme } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";
import { appwriteDatabases } from "../../auth/AppwriteContext";
import { APPWRITE_API } from "../../config-global";
import { Query } from "appwrite";
import { AppwriteHelper } from "../../auth/AppwriteHelper";
import { router } from "expo-router";

export default function chapters() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [chapterList, setChapterList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const x = await AppwriteHelper.listAllDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        [Query.equal("published", true), Query.select(["chapters"])]
      );

      var chapters = new Set();
      for (let i in x) {
        for (j in x[i].chapters) {
          chapters.add(
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.chapters,
              x[i].chapters[j]
            )
          );
        }
      }

      setChapterList([...chapters]);
    };
    fetchData();
  }, [user]);

  return (
    <ScrollView
      style={{
        height: Dimensions.get("window").height,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets={true}
    >
      <List.Section>
        <List.Subheader>List of all Subjects</List.Subheader>
        <Divider bold />
        {chapterList.map((chapter) => (
          <Fragment key={chapter?.$id}>
            <List.Item
              title={chapter?.name}
              onPress={() =>
                router.push("/dashboard/product/list?chapters=" + chapter?.$id)
              }
            />
            <Divider />
          </Fragment>
        ))}
      </List.Section>
    </ScrollView>
  );
}
