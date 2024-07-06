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
import { Stack, router } from "expo-router";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { Skeleton } from "react-native-skeletons";

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
            Query.select(["standards"]),
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
          title: "Classes",
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
              List of all Classes
            </Text>
            <Skeleton
              height={50}
              count={5}
              color={theme.colors.inverseOnSurface}
            />
          </View>
        ) : (
          <List.Section>
            <List.Subheader>List of all Subjects</List.Subheader>
            <Divider bold />
            {standardList.map((standard) => (
              <Fragment key={standard?.$id}>
                <List.Item
                  title={standard?.name}
                  onPress={() =>
                    router.push(
                      "/dashboard/product/list?standards=" + standard?.$id
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
