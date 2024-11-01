import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Divider, Icon, Surface, Text, useTheme } from "react-native-paper";
import {
  appwriteDatabases,
  appwriteStorage,
} from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import ProductSmallComponent from "./ProductSmallComponent";
import { useAuthContext } from "../../../auth/useAuthContext";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Toast } from "react-native-toast-notifications";
import { Col, Container, Row } from "react-bootstrap";
import { Skeleton } from "react-native-skeletons";

export default function AllProductComponent() {
  const theme = useTheme();
  const { user } = useAuthContext();

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        var x = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.products,
          [
            Query.notEqual("$id", APPWRITE_API.documents.dummyProduct),
            Query.equal("published", true),
            Query.limit(4),
          ]
        );

        for (let i in x.documents) {
          for (let j in x.documents[i].images) {
            x.documents[i].images[j] = appwriteStorage.getFilePreview(
              APPWRITE_API.buckets.productFiles,
              x.documents[i].images[j],
              undefined,
              undefined,
              undefined
            ).href;
          }
        }
        setProductList(x.documents);
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
      {(loading || productList.length != 0) && (
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
                All Mock Series
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
                <Link href={PATH_DASHBOARD.product.list}>see more</Link>
              </Text>
              <Icon source="arrow-right-drop-circle" />
            </View>

            <Container>
              {loading && (
                <Row>
                  <Col xs={6}>
                    <Skeleton height={120} style={{ margin: 3 }} />
                  </Col>
                  <Col xs={6}>
                    <Skeleton height={120} style={{ margin: 3 }} />
                  </Col>
                  <Col xs={6}>
                    <Skeleton height={120} style={{ margin: 3 }} />
                  </Col>
                  <Col xs={6}>
                    <Skeleton height={120} style={{ margin: 3 }} />
                  </Col>
                </Row>
              )}
              {!loading && (
                <Row>
                  {productList.map((product) => (
                    <Col xs={6} key={product.$id}>
                      <ProductSmallComponent product={product} />
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
