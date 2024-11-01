import { Link } from "expo-router";
import { View } from "react-native";
import { Divider, Icon, Surface, Text, useTheme } from "react-native-paper";
import BoxTextComponent from "./BoxTextComponent";
import { useAuthContext } from "../../../auth/useAuthContext";
import { useEffect, useState } from "react";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Skeleton } from "react-native-skeletons";
import { Col, Container, Row } from "react-bootstrap";

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
      {(loading || subjectsList.length != 0) && (
        <View>
          <Surface
            style={{
              padding: 8,
              width: "100%",
              borderRadius: 10,
              marginTop: 5,
            }}
            elevation={0}
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
                  flex: 1,
                  flexDirection: "row",
                  fontFamily: "Laila-Regular",
                }}
                variant="titleSmall"
              >
                Subjects
              </Text>
              <Text
                style={{
                  textAlign: "right",
                  marginRight: 2,
                  textDecorationLine: "underline",
                  color: theme.colors.tertiary,
                  justifyContent: "space-evenly",
                  marginTop: -3,
                  fontFamily: "Laila-Regular",
                }}
                variant="bodySmall"
              >
                <Link href={PATH_DASHBOARD.category.subjects}>see more</Link>
              </Text>
              <Icon source="arrow-right-drop-circle" />
            </View>

            <Container>
              {loading && (
                <Row>
                  <Col xs={3}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3}>
                    <Skeleton height={70} />
                  </Col>
                </Row>
              )}

              {!loading && (
                <Row>
                  {subjectsList.map((subject) => (
                    <Col xs={3} key={subject?.$id}>
                      <BoxTextComponent
                        title={subject?.name}
                        link={
                          PATH_DASHBOARD.product.list +
                          "?subjects=" +
                          standard?.$id
                        }
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Container>
          </Surface>

          <Divider bold />
        </View>
      )}
    </View>
  );
}
