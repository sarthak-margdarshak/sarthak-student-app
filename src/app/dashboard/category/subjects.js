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
import { Dimensions, ScrollView, View } from "react-native";
import { Divider, List, Text, useTheme } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { AppwriteHelper } from "../../../auth/AppwriteHelper";
import { Stack, router } from "expo-router";
import { Skeleton } from "react-native-skeletons";

export default function subjects() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [subjectsList, setSubjectsList] = useState([]);
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
            Query.select(["subjects"]),
          ]
        );

        var subjects = new Map();
        for (let i in x) {
          for (j in x[i].subjects) {
            const y = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.subjects,
              x[i].subjects[j]
            );
            if (!subjects.has(y.$id)) {
              subjects.set(y.$id, y.name);
            }
          }
        }
        var z = [];
        subjects.forEach((value, key) => z.push({ $id: key, name: value }));
        setSubjectsList(z);
      } catch (error) {
        // ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Subjects",
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
              List of all Subjects
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
            {subjectsList.map((subject) => (
              <Fragment key={subject?.$id}>
                <List.Item
                  title={subject?.name}
                  onPress={() =>
                    router.push(
                      "/dashboard/product/list?subjects=" + subject?.$id
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
