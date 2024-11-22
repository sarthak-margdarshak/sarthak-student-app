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
import { Toast } from "react-native-toast-notifications";
import DescChip from "../../../sections/dashboard/product/DescChip";

export default function productView() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const { studentProfile, updateCart } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
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
      x.images = x?.images?.map(
        (imageId) =>
          appwriteStorage.getFilePreview(
            APPWRITE_API.buckets.productFiles,
            imageId,
            undefined,
            undefined,
            undefined
          ).href
      );

      setAddedToCart(
        studentProfile?.cart.findIndex((value) => value === id) !== -1
      );
      setProduct(x);
    } catch (error) {
      Toast.show(error.message, {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const addToCart = async () => {
    setAddingToCart(true);
    await updateCart(id, 1);
    Toast.show("Added to cart successfully", {
      type: "success",
      textStyle: { fontFamily: "Laila-Regular" },
    });
    setAddedToCart(true);
    setAddingToCart(true);
  };

  const attempt = async () => {
    router.push(PATH_DASHBOARD.mockTest.list(id));
  };

  const goToCart = async () => {
    router.push(PATH_DASHBOARD.cart);
  };

  return (
    <Fragment>
      <Appbar.Header>
        {router.canGoBack() && (
          <Appbar.BackAction onPress={() => router.back()} />
        )}
        {!router.canGoBack() && (
          <img
            src="https://api.sarthakmargdarshak.in/v1/storage/buckets/672a50aa003599f495e8/files/672a50c8003897892e6a/view?project=671f66a0001e5803f481&project=671f66a0001e5803f481&mode=admin"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="sarthak-logo"
            style={{ margin: 3 }}
            onClick={() => {
              router.dismissAll();
              router.replace(PATH_DASHBOARD.root);
            }}
          />
        )}
        <Appbar.Content
          titleStyle={{ fontFamily: "Laila-Regular" }}
          title={"Mock Test Series"}
        />
      </Appbar.Header>

      <ScrollView
        style={{
          height: Dimensions.get("window").height - 70,
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
              {product?.images?.map((image, index) => (
                <Carousel.Item interval={5000} key={index}>
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
                margin: 15,
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
                {!addedToCart && !purchased && (
                  <Button
                    icon="cart-plus"
                    mode="contained"
                    onPress={addToCart}
                    loading={addingToCart}
                    style={{ borderRadius: 10 }}
                    labelStyle={{ fontFamily: "Laila-Regular" }}
                  >
                    Add to Cart
                  </Button>
                )}
              </View>
            </View>

            {purchased && (
              <Button
                mode="contained"
                icon="test-tube"
                onPress={attempt}
                style={{
                  borderRadius: 10,
                  marginLeft: 50,
                  marginRight: 50,
                  marginBottom: 20,
                  backgroundColor: theme.colors.success,
                }}
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
                style={{
                  borderRadius: 10,
                  marginLeft: 50,
                  marginRight: 50,
                  marginBottom: 20,
                }}
                labelStyle={{ fontFamily: "Laila-Regular" }}
              >
                Go to Cart
              </Button>
            )}

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
                {product?.standards?.map((standard, index) => (
                  <DescChip key={index} id={standard} type="standard" />
                ))}
              </View>

              {product?.subjects?.length !== 0 && <Divider />}

              <View
                style={{ flexDirection: "row", margin: 5, flexWrap: "wrap" }}
              >
                {product?.subjects?.map((subject, index) => (
                  <DescChip key={index} id={subject} type="subject" />
                ))}
              </View>

              {product?.chapters?.length !== 0 && <Divider />}

              <View
                style={{ flexDirection: "row", margin: 5, flexWrap: "wrap" }}
              >
                {product?.chapters?.map((chapter, index) => (
                  <DescChip key={index} id={chapter} type="chapter" />
                ))}
              </View>

              {product?.concepts?.length !== 0 && <Divider />}

              <View
                style={{ flexDirection: "row", margin: 5, flexWrap: "wrap" }}
              >
                {product?.concepts?.map((concept, index) => (
                  <DescChip key={index} id={concept} type="concept" />
                ))}
              </View>
            </Surface>
          </View>
        )}
      </ScrollView>
    </Fragment>
  );
}
