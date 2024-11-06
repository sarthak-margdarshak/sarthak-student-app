import { router } from "expo-router";
import { View } from "react-native";
import { Card, Text, TouchableRipple, useTheme } from "react-native-paper";

export default function BoxTextComponent({ title, link }) {
  const theme = useTheme();

  return (
    <TouchableRipple onPress={() => router.push(link)}>
      <Card mode="contained">
        <View style={styles.article}>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurface,
              textAlign: "center",
              position: "absolute",
              top: 20,
              bottom: 0,
              left: 0,
              right: 0,
              margin: "auto",
              fontFamily: "Laila-Regular",
            }}
          >
            {title}
          </Text>
        </View>
      </Card>
    </TouchableRipple>
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
