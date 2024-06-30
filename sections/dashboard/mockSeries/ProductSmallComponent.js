import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ImageBackground, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { PATH_DASHBOARD } from "../../../routes/paths";

export default function ProductSmallComponent({ product }) {
  const theme = useTheme();
  return (
    <Card
      mode="contained"
      style={{ margin: 5 }}
      onPress={() => router.push(PATH_DASHBOARD.product.view(product?.$id))}
    >
      <View style={styles.article}>
        <ImageBackground
          style={styles.image}
          source={{ uri: product?.images[0] }}
          alt="background"
          blurRadius={5}
        >
          <LinearGradient
            colors={[theme.colors.inverseSurface, "#00000000"]}
            style={{ height: "100%", width: "100%" }}
          ></LinearGradient>
        </ImageBackground>
        <Text
          variant="titleLarge"
          style={{
            color: theme.colors.inverseOnSurface,
            textAlign: "center",
            position: "absolute",
            top: 20,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            fontWeight: "bold",
          }}
        >
          {product?.name}
        </Text>
      </View>
    </Card>
  );
}

const styles = {
  article: {
    height: 120,
    position: "relative",
    overflow: "hidden",
    borderRadius: 5,
  },
  image: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  header: {
    textAlign: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "fit-content",
    margin: "auto",
  },
};
