import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { Divider, List, useTheme } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";
import { appwriteDatabases } from "../../auth/AppwriteContext";
import { APPWRITE_API } from "../../config-global";
import { Query } from "appwrite";
import { AppwriteHelper } from "../../auth/AppwriteHelper";
import { router } from "expo-router";

export default function standards() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [standardList, setStandardList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const x = await AppwriteHelper.listAllDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        [Query.equal("published", true), Query.select(["standards"])]
      );

      var standards = new Set();
      for (let i in x) {
        for (j in x[i].standards) {
          standards.add(
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.standards,
              x[i].standards[j]
            )
          );
        }
      }

      setStandardList([...standards]);
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
    </ScrollView>
  );
}
