import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  Chip,
  Divider,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import {
  appwriteDatabases,
  appwriteStorage,
} from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { Skeleton } from "react-native-skeletons";
import { useAuthContext } from "../../../auth/useAuthContext";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Carousel } from "react-bootstrap";

export default function productView() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const { studentProfile, updateCart } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (studentProfile.purchased.findIndex((value) => value === id) !== -1) {
        setPurchased(true);
      }
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        id
      );
      for (let j in x.images) {
        x.images[j] = appwriteStorage.getFilePreview(
          APPWRITE_API.buckets.productFiles,
          x.images[j],
          undefined,
          undefined,
          undefined
        ).href;
      }

      for (let j in x.standards) {
        x.standards[j] = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.standards,
          x.standards[j]
        );
      }

      for (let j in x.subjects) {
        x.subjects[j] = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.subjects,
          x.subjects[j]
        );
      }

      for (let j in x.chapters) {
        x.chapters[j] = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.chapters,
          x.chapters[j]
        );
      }

      for (let j in x.concepts) {
        x.concepts[j] = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.concepts,
          x.concepts[j]
        );
      }

      setAddedToCart(
        studentProfile?.cart.findIndex((value) => value === id) !== -1
      );
      setProduct(x);
    } catch (error) {
      // ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const addToCart = async () => {
    await updateCart(id, 1);
    setAddedToCart(true);
  };

  const attempt = async () => {
    router.push(PATH_DASHBOARD.mockTest.list(id));
  };

  const goToCart = async () => {
    router.push(PATH_DASHBOARD.root + "?pagesIndex=2");
  };

  return (
    <Fragment>
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
          title={product?.name}
        />
      </Appbar.Header>

      <ScrollView
        style={{
          height: Dimensions.get("window").height,
          backgroundColor: theme.colors.surface,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        {loading ? (
          <View>
            <Skeleton
              height={(Dimensions.get("window").width * 3) / 4}
              style={{ marginBottom: 10 }}
              color={theme.colors.inverseOnSurface}
            />

            <Skeleton
              height={100}
              style={{ marginBottom: 10 }}
              color={theme.colors.infoContainer}
            />

            <Skeleton
              height={80}
              style={{ marginBottom: 10 }}
              color={theme.colors.inverseOnSurface}
            />

            <Skeleton
              height={300}
              style={{ marginBottom: 10 }}
              color={theme.colors.inverseOnSurface}
            />
          </View>
        ) : (
          <View>
            <Carousel>
              {product?.images?.map((image) => (
                <Carousel.Item interval={5000} key={image}>
                  <img
                    className="d-block w-100"
                    src={image}
                    alt="First slide"
                  />
                </Carousel.Item>
              ))}
            </Carousel>

            <Surface
              style={{
                padding: 5,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: theme.colors.infoContainer,
              }}
            >
              <Text
                variant="headlineSmall"
                style={{
                  margin: 5,
                  color: theme.colors.onInfoContainer,
                  fontFamily: "Laila-Regular",
                }}
              >
                {product?.name}
              </Text>

              <Text
                variant="labelLarge"
                style={{
                  margin: 10,
                  color: theme.colors.onInfoContainer,
                  fontFamily: "Laila-Regular",
                }}
              >
                {product?.description}
              </Text>
            </Surface>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 15,
              }}
            >
              {!purchased && !addedToCart && (
                <View>
                  <Text
                    variant="bodyLarge"
                    style={{ fontWeight: "bold", fontFamily: "Laila-Regular" }}
                  >
                    {"₹" + product?.sellPrice}
                  </Text>

                  <Text
                    variant="bodySmall"
                    style={{
                      fontWeight: "bold",
                      textDecorationLine: "line-through",
                      color: theme.colors.surfaceDisabled,
                      fontFamily: "Laila-Regular",
                    }}
                  >
                    {"₹" + product?.mrp}
                  </Text>
                </View>
              )}

              <View style={{ justifyContent: "space-evenly", width: 200 }}>
                {purchased && (
                  <Button
                    mode="contained"
                    icon="test-tube"
                    onPress={attempt}
                    style={{ backgroundColor: theme.colors.success }}
                    labelStyle={{ fontFamily: "Laila-Regular" }}
                  >
                    Attempt
                  </Button>
                )}

                {addedToCart && (
                  <Button
                    mode="contained"
                    icon="cart-arrow-right"
                    onPress={goToCart}
                    labelStyle={{ fontFamily: "Laila-Regular" }}
                  >
                    Go to Cart
                  </Button>
                )}

                {!addedToCart && !purchased && (
                  <Button icon="cart-plus" mode="contained" onPress={addToCart}>
                    Add to Cart
                  </Button>
                )}
              </View>
            </View>

            <Surface style={{ borderRadius: 15, padding: 5, margin: 5 }}>
              <Text
                variant="titleSmall"
                style={{
                  fontFamily: "Laila-Regular",
                  fontWeight: "bold",
                  margin: 5,
                  marginTop: 15,
                }}
              >
                Mock Highlights
              </Text>

              <Divider bold />

              <View
                style={{ flexDirection: "row", margin: 5, flexWrap: "wrap" }}
              >
                <Chip
                  style={{
                    margin: 2,
                    backgroundColor: theme.colors.errorContainer,
                  }}
                  textStyle={{
                    fontSize: 12,
                    fontFamily: "Laila-Regular",
                  }}
                >
                  {product?.mockTestIds?.length + " Mock Tests Available"}
                </Chip>
              </View>

              {product?.standards?.length !== 0 && <Divider />}

              <View
                style={{ flexDirection: "row", margin: 5, flexWrap: "wrap" }}
              >
                {product?.standards?.map((standard) => (
                  <Chip
                    key={standard?.$id}
                    style={{ margin: 2 }}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: "Laila-Regular",
                    }}
                  >
                    {standard?.name}
                  </Chip>
                ))}
              </View>

              {product?.subjects?.length !== 0 && <Divider />}

              <View
                style={{ flexDirection: "row", margin: 5, flexWrap: "wrap" }}
              >
                {product?.subjects?.map((subject) => (
                  <Chip
                    key={subject?.$id}
                    style={{
                      margin: 2,
                      backgroundColor: theme.colors.warningContainer,
                    }}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: "Laila-Regular",
                    }}
                  >
                    {subject?.name}
                  </Chip>
                ))}
              </View>

              {product?.chapters?.length !== 0 && <Divider />}

              <View
                style={{ flexDirection: "row", margin: 5, flexWrap: "wrap" }}
              >
                {product?.chapters?.map((chapter) => (
                  <Chip
                    key={chapter?.$id}
                    style={{
                      margin: 2,
                      backgroundColor: theme.colors.inversePrimary,
                    }}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: "Laila-Regular",
                    }}
                  >
                    {chapter?.name}
                  </Chip>
                ))}
              </View>

              {product?.concepts?.length !== 0 && <Divider />}

              <View
                style={{ flexDirection: "row", margin: 5, flexWrap: "wrap" }}
              >
                {product?.concepts?.map((concept) => (
                  <Chip
                    key={concept?.$id}
                    style={{
                      margin: 2,
                      backgroundColor: theme.colors.infoContainer,
                    }}
                    textStyle={{
                      fontSize: 12,
                      fontFamily: "Laila-Regular",
                    }}
                  >
                    {concept?.name}
                  </Chip>
                ))}
              </View>
            </Surface>
          </View>
        )}
      </ScrollView>
    </Fragment>
  );
}
