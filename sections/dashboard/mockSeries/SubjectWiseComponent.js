import { Link } from "expo-router";
import { View } from "react-native";
import { FAB, Icon, Surface, Text, useTheme } from "react-native-paper";
import BoxTextComponent from "./BoxTextComponent";
import { useAuthContext } from "../../../auth/useAuthContext";
import { useEffect, useState } from "react";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";

export default function SubjectWiseComponent() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [subjectsList, setSubjectsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const x = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        [
          Query.equal("published", true),
          Query.select(["subjects"]),
          Query.limit(5),
        ]
      );

      var subjects = new Set();
      for (let i in x.documents) {
        for (j in x.documents[i].subjects) {
          subjects.add(
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.subjects,
              x.documents[i].subjects[j]
            )
          );
        }
      }
      setSubjectsList([...subjects]);
    };
    fetchData();
  }, [user]);

  return (
    <Surface
      style={{ padding: 8, width: "100%", borderRadius: 10, marginTop: 5 }}
      mode="flat"
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            width: 100,
            marginLeft: 2,
            fontWeight: "bold",
            textDecorationLine: "underline",
            flex: 1,
            flexDirection: "row",
          }}
        >
          Subjects
        </Text>
        <Text
          style={{
            textAlign: "right",
            marginRight: 2,
            fontWeight: "bold",
            textDecorationLine: "underline",
            color: theme.colors.tertiary,
            justifyContent: "space-evenly",
            marginTop: -3,
          }}
        >
          <Link href="/dashboard/subjects">see more</Link>
        </Text>
        <Icon source="arrow-right-drop-circle" />
      </View>

      <View style={styles.app}>
        <Row>
          <Col numRows={1}>
            {subjectsList.length >= 1 && (
              <BoxTextComponent
                title={subjectsList[0].name}
                link={
                  "/dashboard/product/list?subjects=" + subjectsList[0]?.$id
                }
              />
            )}
          </Col>
          <Col numRows={1}>
            {subjectsList.length >= 2 && (
              <BoxTextComponent
                title={subjectsList[1].name}
                link={
                  "/dashboard/product/list?subjects=" + subjectsList[1]?.$id
                }
              />
            )}
          </Col>
          <Col numRows={1}>
            {subjectsList.length >= 3 && (
              <BoxTextComponent
                title={subjectsList[2].name}
                link={
                  "/dashboard/product/list?subjects=" + subjectsList[2]?.$id
                }
              />
            )}
          </Col>
          <Col numRows={1}>
            {subjectsList.length >= 4 && (
              <BoxTextComponent
                title={subjectsList[3].name}
                link={
                  "/dashboard/product/list?subjects=" + subjectsList[3]?.$id
                }
              />
            )}
          </Col>
        </Row>

        {subjectsList.length >= 5 && (
          <Row>
            <Col numRows={1}>
              {subjectsList.length >= 5 && (
                <BoxTextComponent
                  title={subjectsList[4].name}
                  link={
                    "/dashboard/product/list?subjects=" + subjectsList[4]?.$id
                  }
                />
              )}
            </Col>
            <Col numRows={1}>
              {subjectsList.length >= 6 && (
                <BoxTextComponent
                  title={subjectsList[5].name}
                  link={
                    "/dashboard/product/list?subjects=" + subjectsList[5]?.$id
                  }
                />
              )}
            </Col>
            <Col numRows={1}>
              {subjectsList.length >= 7 && (
                <BoxTextComponent
                  title={subjectsList[6].name}
                  link={
                    "/dashboard/product/list?subjects=" + subjectsList[6]?.$id
                  }
                />
              )}
            </Col>
            <Col numRows={1}>
              {subjectsList.length === 8 && (
                <BoxTextComponent
                  title={subjectsList[7].name}
                  link={
                    "/dashboard/product/list?subjects=" + subjectsList[7]?.$id
                  }
                />
              )}
              {subjectsList.length >= 9 && (
                <FAB
                  icon="arrow-right-drop-circle"
                  style={{
                    margin: 3,
                    justifyContent: "center",
                    borderRadius: 5,
                  }}
                  customSize={70}
                  onPress={() => router.push("/dashboard/subjects")}
                />
              )}
            </Col>
          </Row>
        )}
      </View>
    </Surface>
  );
}

const styles = {
  app: {
    flex: 4, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: "auto",
  },
  row: {
    flexDirection: "row",
  },
  "1col": {
    flex: 1,
  },
  "2col": {
    flex: 2,
  },
  "3col": {
    flex: 3,
  },
  "4col": {
    flex: 4,
  },
};

// RN Code
const Col = ({ numRows, children }) => {
  return <View style={styles[`${numRows}col`]}>{children}</View>;
};

const Row = ({ children }) => <View style={styles.row}>{children}</View>;
