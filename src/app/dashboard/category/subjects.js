import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Appbar, Divider, List, Text, useTheme } from "react-native-paper";
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
            Query.select(["subjects", "$id"]),
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
          title="All Subjects"
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
              {subjectsList.map((subject) => (
                <Fragment key={subject?.$id}>
                  <List.Item
                    title={subject?.name}
                    titleStyle={{ fontFamily: "Laila-Regular" }}
                    right={(props) => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                    onPress={() =>
                      router.push(
                        "/dashboard/product/list?subjects=" + subject?.$id
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
