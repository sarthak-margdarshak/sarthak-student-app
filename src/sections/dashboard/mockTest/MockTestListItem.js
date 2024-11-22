import { useEffect, useState } from "react";
import { Chip, List, useTheme } from "react-native-paper";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Query } from "appwrite";
import { router } from "expo-router";

export default function MockTestListItem({ id }) {
  const theme = useTheme();
  const [mockTest, setMockTest] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        id,
        [Query.select(["name", "description", "level", "$id"])]
      );
      setMockTest(x);
    };
    fetchData();
  }, [id]);

  return (
    <List.Item
      title={mockTest.name}
      titleStyle={{ fontFamily: "Laila-Regular" }}
      description={mockTest.description}
      descriptionStyle={{ fontFamily: "Laila-Regular" }}
      descriptionNumberOfLines={6}
      titleNumberOfLines={3}
      onPress={() =>
        router.push(PATH_DASHBOARD.mockTest.attempts(mockTest.$id))
      }
      right={(props) => (
        <>
          <Chip
            {...props}
            mode="outlined"
            textStyle={{ fontFamily: "Laila-Regular" }}
            selectedColor={
              mockTest.level === "HARD"
                ? theme.colors.error
                : mockTest.level === "MEDIUM"
                ? theme.colors.info
                : theme.colors.success
            }
          >
            {mockTest.level}
          </Chip>
          <List.Icon {...props} icon="chevron-right" />
        </>
      )}
    />
  );
}
