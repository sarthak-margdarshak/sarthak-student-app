import { Link } from "expo-router";
import { View } from "react-native";
import { Divider, Icon, Surface, Text, useTheme } from "react-native-paper";
import BoxTextComponent from "./BoxTextComponent";
import { useAuthContext } from "../../../auth/useAuthContext";
import { useEffect, useState } from "react";
import { appwriteDatabases } from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Toast } from "react-native-toast-notifications";
import { Col, Container, Row } from "react-bootstrap";

export default function ClasswiseComponent() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [standardsList, setStandardsList] = useState([]);
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
            Query.select(["standards"]),
            Query.limit(8),
          ]
        );

        var standards = new Map();
        for (let i in x.documents) {
          for (j in x.documents[i].standards) {
            const y = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.standards,
              x.documents[i].standards[j]
            );
            if (!standards.has(y.$id)) {
              standards.set(y.$id, y.name);
            }
          }
        }
        var z = [];
        standards.forEach((value, key) => z.push({ $id: key, name: value }));
        setStandardsList(z);
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
      {(loading || standardsList.length != 0) && (
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
                Class
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
                <Link href={PATH_DASHBOARD.category.standards}>see more</Link>
              </Text>
              <Icon source="arrow-right-drop-circle" />
            </View>

            <Container>
              {loading && (
                <Row>
                  <Col xs={3} style={{ marginBottom: 5 }}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3} style={{ marginBottom: 5 }}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3} style={{ marginBottom: 5 }}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3} style={{ marginBottom: 5 }}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3} style={{ marginBottom: 5 }}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3} style={{ marginBottom: 5 }}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3} style={{ marginBottom: 5 }}>
                    <Skeleton height={70} />
                  </Col>
                  <Col xs={3} style={{ marginBottom: 5 }}>
                    <Skeleton height={70} />
                  </Col>
                </Row>
              )}

              {!loading && (
                <Row>
                  {standardsList.map((standard) => (
                    <Col xs={3} key={standard?.$id} style={{ marginBottom: 5 }}>
                      <BoxTextComponent
                        title={standard?.name}
                        link={
                          PATH_DASHBOARD.product.list +
                          "?standards=" +
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
