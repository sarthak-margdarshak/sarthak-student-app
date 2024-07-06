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

import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, ToastAndroid, View } from "react-native";
import { Divider, List, Text, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { Stack, router } from "expo-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Skeleton } from "react-native-skeletons";

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
            Query.select(["chapters"]),
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
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Chapters",
        }}
      />
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
        {loading ? (
          <View style={{ padding: 10 }}>
            <Text
              variant="titleLarge"
              style={{ fontWeight: "bold", margin: 10 }}
            >
              List of all Chapters
            </Text>
            <Skeleton
              height={50}
              count={5}
              color={theme.colors.inverseOnSurface}
            />
          </View>
        ) : (
          <List.Section>
            <List.Subheader>List of all Chapters</List.Subheader>
            <Divider bold />
            {chapterList.map((chapter) => (
              <Fragment key={chapter?.$id}>
                <List.Item
                  title={chapter?.name}
                  onPress={() =>
                    router.push(
                      PATH_DASHBOARD.product.list + "?chapters=" + chapter?.$id
                    )
                  }
                />
                <Divider />
              </Fragment>
            ))}
          </List.Section>
        )}
      </ScrollView>
    </View>
  );
}
