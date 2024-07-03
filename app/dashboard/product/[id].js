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

import { Stack, router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  ToastAndroid,
  View,
} from "react-native";
import { Button, Divider, Surface, Text, useTheme } from "react-native-paper";
import {
  appwriteDatabases,
  appwriteStorage,
} from "../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../config-global";
import { LinearGradient } from "expo-linear-gradient";
import { Skeleton } from "react-native-skeletons";
import { useAuthContext } from "../../../auth/useAuthContext";
import { PATH_DASHBOARD } from "../../../routes/paths";

export default function productView() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const { studentProfile, updateCart } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [currPic, setCurrPic] = useState(
    "https://api.sarthakmargdarshak.in/v1/storage/buckets/66831750aac03d4d2f6e/files/6685c28dcbdbebdf0c91/view?project=6639f48744439b98db71&mode=admin"
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (
          studentProfile.purchased.findIndex((value) => value === id) !== -1
        ) {
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
        setCurrPic(x?.images[0]);

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
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const addToCart = async () => {
    await updateCart(id, 1);
    setAddedToCart(true);
  };

  const attempt = async () => {
    console.log("Attempting the series");
  };

  const goToCart = async () => {
    router.push(PATH_DASHBOARD.root + "?pagesIndex=2");
  };

  return (
    <Fragment>
      <Stack.Screen
        options={{
          title: loading ? "Series Name" : product?.name,
        }}
      />
      <ScrollView
        style={{
          height: Dimensions.get("window").height,
          backgroundColor: theme.colors.surface,
          padding: 10,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
          // paddingTop: 80,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        {loading ? (
          <View>
            <Skeleton
              height={300}
              style={{ marginBottom: 10 }}
              color={theme.colors.inverseOnSurface}
            />

            <Divider bold style={{ margin: 15 }} />

            <Skeleton
              height={100}
              style={{ marginBottom: 10 }}
              color={theme.colors.inverseOnSurface}
            />

            <Divider bold style={{ margin: 15 }} />

            <Skeleton
              height={80}
              style={{ marginBottom: 10 }}
              color={theme.colors.inverseOnSurface}
            />

            <Divider bold style={{ margin: 15 }} />

            <Skeleton
              height={300}
              style={{ marginBottom: 10 }}
              color={theme.colors.inverseOnSurface}
            />
          </View>
        ) : (
          <View>
            <Surface style={{ borderRadius: 15, padding: 5 }}>
              <ImageBackground
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: 250,
                }}
                source={{ uri: currPic }}
                alt="background"
              />
              <ScrollView horizontal>
                {product?.images?.map((img) => (
                  <View onTouchStart={() => setCurrPic(img)} key={img}>
                    <ImageBackground
                      style={{
                        objectFit: "cover",
                        width: img === currPic ? 70 : 60,
                        height: img === currPic ? 50 : 40,
                        margin: 5,
                        borderStyle: "solid",
                        borderWidth: img === currPic ? 1 : 0,
                        borderColor: theme.colors.primary,
                      }}
                      source={{ uri: img }}
                      alt="background"
                    >
                      {img !== currPic && (
                        <LinearGradient
                          colors={[theme.colors.inverseSurface, "#00000000"]}
                          style={{ height: "100%", width: "100%" }}
                        />
                      )}
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            </Surface>

            <Divider bold style={{ margin: 15 }} />

            <Surface style={{ borderRadius: 15, padding: 5 }}>
              <Text
                variant="headlineLarge"
                style={{ fontWeight: "bold", margin: 5 }}
              >
                {product?.name}
              </Text>

              <Text variant="titleLarge" style={{ margin: 10 }}>
                {product?.description}
              </Text>
            </Surface>

            <Divider bold style={{ margin: 15 }} />

            <Surface style={{ borderRadius: 15, padding: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: 5,
                  padding: 5,
                }}
              >
                <View>
                  <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
                    {"₹" + product?.sellPrice}
                  </Text>

                  <Text
                    variant="headlineSmall"
                    style={{
                      fontWeight: "bold",
                      textDecorationLine: "line-through",
                      color: theme.colors.surfaceDisabled,
                    }}
                  >
                    {"₹" + product?.mrp}
                  </Text>
                </View>

                <View style={{ justifyContent: "center" }}>
                  {purchased && (
                    <Button mode="contained" icon="test-tube" onPress={attempt}>
                      Attempt
                    </Button>
                  )}

                  {addedToCart && (
                    <Button
                      mode="contained"
                      icon="cart-arrow-right"
                      onPress={goToCart}
                    >
                      Go to Cart
                    </Button>
                  )}

                  {!addedToCart && !purchased && (
                    <Button
                      icon="cart-plus"
                      mode="contained"
                      onPress={addToCart}
                    >
                      Add to Cart
                    </Button>
                  )}
                </View>
              </View>
            </Surface>

            <Divider bold style={{ margin: 15 }} />

            <Surface style={{ borderRadius: 15, padding: 5 }}>
              <Text
                variant="titleLarge"
                style={{ margin: 5, marginTop: 15, fontWeight: "bold" }}
              >
                Mock Test Series Details -
              </Text>

              <Divider style={{ margin: 10 }} />

              <View style={{ flexDirection: "row", margin: 5 }}>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  {"Standard - "}
                </Text>
                {product?.standards?.map((standard) => (
                  <Text key={standard?.$id} variant="titleSmall">
                    {standard?.name + ", "}
                  </Text>
                ))}
              </View>

              <View style={{ flexDirection: "row", margin: 5 }}>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  {"Subjects - "}
                </Text>
                {product?.subjects?.map((subject) => (
                  <Text key={subject?.$id} variant="titleSmall">
                    {subject?.name + ", "}
                  </Text>
                ))}
              </View>

              <View style={{ flexDirection: "row", margin: 5 }}>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  {"Chapters - "}
                </Text>
                {product?.chapters?.map((chapter) => (
                  <Text key={chapter?.$id} variant="titleSmall">
                    {chapter?.name + ", "}
                  </Text>
                ))}
              </View>

              <View style={{ flexDirection: "row", margin: 5 }}>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  {"Concepts - "}
                </Text>
                {product?.concepts?.map((concept) => (
                  <Text key={concept?.$id} variant="titleSmall">
                    {concept?.name + ", "}
                  </Text>
                ))}
              </View>

              <View style={{ flexDirection: "row", margin: 5 }}>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  {"Mock Tests Count - "}
                </Text>
                <Text variant="titleSmall">{product?.mockTestIds?.length}</Text>
              </View>
            </Surface>
          </View>
        )}
      </ScrollView>
    </Fragment>
  );
}
