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

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ImageBackground, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

let images = [
  require("../../../../public/assets/images/books_0.jpg"),
  require("../../../../public/assets/images/books_1.jpg"),
  require("../../../../public/assets/images/books_2.jpg"),
  require("../../../../public/assets/images/books_3.jpg"),
  require("../../../../public/assets/images/books_4.jpg"),
  require("../../../../public/assets/images/books_5.jpg"),
  require("../../../../public/assets/images/books_6.jpg"),
  require("../../../../public/assets/images/books_7.jpg"),
  require("../../../../public/assets/images/books_8.jpg"),
  require("../../../../public/assets/images/books_9.jpg"),
  require("../../../../public/assets/images/books_1.jpg"),
  require("../../../../public/assets/images/books_11.jpg"),
  require("../../../../public/assets/images/books_12.jpg"),
  require("../../../../public/assets/images/books_13.jpg"),
  require("../../../../public/assets/images/books_14.jpg"),
];

export default function BoxTextComponent({ title, link }) {
  const theme = useTheme();

  return (
    <Card
      mode="contained"
      style={{ margin: 5 }}
      onPress={() => router.push(link)}
    >
      <View style={styles.article}>
        <ImageBackground
          style={styles.image}
          source={images[parseInt(Math.random() * 100) % 15]}
          alt="background"
          blurRadius={15}
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
          {title}
        </Text>
      </View>
    </Card>
  );
}

const styles = {
  article: {
    height: 70,
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
