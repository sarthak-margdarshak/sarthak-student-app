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

import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { FAB, Icon, Surface, Text, useTheme } from "react-native-paper";
import {
  appwriteDatabases,
  appwriteStorage,
} from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Query } from "appwrite";
import ProductSmallComponent from "./ProductSmallComponent";
import { useAuthContext } from "../../../auth/useAuthContext";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../routes/paths";

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
            Query.limit(5),
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
        // ToastAndroid.show(error.message, ToastAndroid.LONG);
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
          All Mock Series
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
          <Link href={PATH_DASHBOARD.product.list}>see more</Link>
        </Text>
        <Icon source="arrow-right-drop-circle" />
      </View>

      {loading ? (
        <View style={styles.app}>
          <Row>
            <Col numRows={2}>
              <Skeleton
                style={{ margin: 5 }}
                height={110}
                width="95%"
                count={2}
                color={theme.colors.inverseOnSurface}
              />
            </Col>

            <Col numRows={2}>
              <Skeleton
                style={{ margin: 5 }}
                height={110}
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
            <Col numRows={2}>
              {productList.length >= 1 && (
                <ProductSmallComponent product={productList[0]} />
              )}
            </Col>
            <Col numRows={2}>
              {productList.length >= 2 && (
                <ProductSmallComponent product={productList[1]} />
              )}
            </Col>
          </Row>

          {productList.length >= 3 && (
            <Row>
              <Col numRows={2}>
                {productList.length >= 3 && (
                  <ProductSmallComponent product={productList[2]} />
                )}
              </Col>

              <Col numRows={2}>
                {productList.length === 4 && (
                  <ProductSmallComponent product={productList[3]} />
                )}
                {productList.length >= 5 && (
                  <FAB
                    icon="arrow-right-drop-circle"
                    style={{
                      margin: 3,
                      alignContent: "center",
                      borderRadius: 5,
                    }}
                    customSize={120}
                    onPress={() => router.push(PATH_DASHBOARD.product.list)}
                  />
                )}
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
