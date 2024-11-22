import { useEffect, useState } from "react";
import { Chip, useTheme } from "react-native-paper";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";

export default function DescChip({ id, type }) {
  const theme = useTheme();

  const [item, setItem] = useState({});
  const [backgroundColor, setBackgroundColor] = useState();

  useEffect(() => {
    const fetchData = async () => {
      var collection = "";
      var bg = "";
      if (type === "standard") {
        collection = APPWRITE_API.collections.standards;
        bg = theme.colors.successContainer;
      } else if (type === "subject") {
        collection = APPWRITE_API.collections.subjects;
        bg = theme.colors.warningContainer;
      } else if (type === "chapter") {
        collection = APPWRITE_API.collections.chapters;
        bg = theme.colors.inversePrimary;
      } else if (type === "concept") {
        collection = APPWRITE_API.collections.concepts;
        bg = theme.colors.infoContainer;
      }

      setBackgroundColor(bg);

      setItem(
        await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          collection,
          id
        )
      );
    };
    fetchData();
  }, [id]);

  return (
    <Chip
      style={{ margin: 2, backgroundColor: backgroundColor }}
      textStyle={{
        fontSize: 12,
        fontFamily: "Laila-Regular",
      }}
    >
      {item?.name}
    </Chip>
  );
}
