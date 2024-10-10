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

import { Link } from "expo-router";
import { ToastAndroid, View } from "react-native";
import { FAB, Icon, Surface, Text, useTheme } from "react-native-paper";
import BoxTextComponent from "./BoxTextComponent";
import { useAuthContext } from "../../../auth/useAuthContext";
import { useEffect, useState } from "react";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Skeleton } from "react-native-skeletons";

export default function SubjectWiseComponent() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const x = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          [
            Query.notEqual("$id", APPWRITE_API.documents.dummyProduct),
            Query.equal("published", true),
            Query.select(["subjects"]),
            Query.limit(5),
          ]
        );

        var subjects = new Map();
        for (let i in x.documents) {
          for (j in x.documents[i].subjects) {
            const y = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.subjects,
              x.documents[i].subjects[j]
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
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      setLoading(false);
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
            flex: 1,
            flexDirection: "row",
          }}
          variant="titleLarge"
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
          variant="titleMedium"
        >
          <Link href={PATH_DASHBOARD.category.subjects}>see more</Link>
        </Text>
        <Icon source="arrow-right-drop-circle" />
      </View>

      {loading ? (
        <View style={styles.app}>
          <Row>
            <Col numRows={1}>
              <Skeleton
                style={{ margin: 5 }}
                height={60}
                width="95%"
                count={2}
                color={theme.colors.inverseOnSurface}
              />
            </Col>

            <Col numRows={1}>
              <Skeleton
                style={{ margin: 5 }}
                height={60}
                width="95%"
                count={2}
                color={theme.colors.inverseOnSurface}
              />
            </Col>

            <Col numRows={1}>
              <Skeleton
                style={{ margin: 5 }}
                height={60}
                width="95%"
                count={2}
                color={theme.colors.inverseOnSurface}
              />
            </Col>

            <Col numRows={1}>
              <Skeleton
                style={{ margin: 5 }}
                height={60}
                width="95%"
                count={2}
                color={theme.colors.inverseOnSurface}
              />
            </Col>
          </Row>
        </View>
      ) : (
        <View style={styles.app}>
          <Row>
            <Col numRows={1}>
              {subjectsList.length >= 1 && (
                <BoxTextComponent
                  title={subjectsList[0].name}
                  link={
                    PATH_DASHBOARD.product.list +
                    "?subjects=" +
                    subjectsList[0]?.$id
                  }
                />
              )}
            </Col>
            <Col numRows={1}>
              {subjectsList.length >= 2 && (
                <BoxTextComponent
                  title={subjectsList[1].name}
                  link={
                    PATH_DASHBOARD.product.list +
                    "?subjects=" +
                    subjectsList[1]?.$id
                  }
                />
              )}
            </Col>
            <Col numRows={1}>
              {subjectsList.length >= 3 && (
                <BoxTextComponent
                  title={subjectsList[2].name}
                  link={
                    PATH_DASHBOARD.product.list +
                    "?subjects=" +
                    subjectsList[2]?.$id
                  }
                />
              )}
            </Col>
            <Col numRows={1}>
              {subjectsList.length >= 4 && (
                <BoxTextComponent
                  title={subjectsList[3].name}
                  link={
                    PATH_DASHBOARD.product.list +
                    "?subjects=" +
                    subjectsList[3]?.$id
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
                      PATH_DASHBOARD.product.list +
                      "?subjects=" +
                      subjectsList[4]?.$id
                    }
                  />
                )}
              </Col>
              <Col numRows={1}>
                {subjectsList.length >= 6 && (
                  <BoxTextComponent
                    title={subjectsList[5].name}
                    link={
                      PATH_DASHBOARD.product.list +
                      "?subjects=" +
                      subjectsList[5]?.$id
                    }
                  />
                )}
              </Col>
              <Col numRows={1}>
                {subjectsList.length >= 7 && (
                  <BoxTextComponent
                    title={subjectsList[6].name}
                    link={
                      PATH_DASHBOARD.product.list +
                      "?subjects=" +
                      subjectsList[6]?.$id
                    }
                  />
                )}
              </Col>
              <Col numRows={1}>
                {subjectsList.length === 8 && (
                  <BoxTextComponent
                    title={subjectsList[7].name}
                    link={
                      PATH_DASHBOARD.product.list +
                      "?subjects=" +
                      subjectsList[7]?.$id
                    }
                  />
                )}
                {/* {subjectsList.length >= 9 && (
                  <FAB
                    icon="arrow-right-drop-circle"
                    style={{
                      margin: 3,
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                    customSize={70}
                    onPress={() =>
                      router.push(PATH_DASHBOARD.category.subjects)
                    }
                  />
                )} */}
              </Col>
            </Row>
          )}
        </View>
      )}
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
