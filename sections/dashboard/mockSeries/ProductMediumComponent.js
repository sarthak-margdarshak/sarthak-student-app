import { router } from "expo-router";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import { PATH_DASHBOARD } from "../../../routes/paths";

export default function ProductMediumComponent({ product }) {
  return (
    <Card
      style={{ margin: 5 }}
      onPress={() => router.push(PATH_DASHBOARD.product.view(product?.$id))}
    >
      <Card.Cover source={{ uri: product?.images[0] }} />
      <Card.Title title={product?.name} subtitle={product?.description} />
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ alignContent: "flex-start" }}>
            <View style={{ flexDirection: "row" }}>
              <Text variant="bodyMedium" style={{ fontWeight: "bold" }}>
                {"Standard - "}
              </Text>
              {product?.standards?.map((standard) => (
                <Text key={standard?.$id} variant="bodyMedium">
                  {standard?.name + ", "}
                </Text>
              ))}
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text variant="bodyMedium" style={{ fontWeight: "bold" }}>
                {"Subjects - "}
              </Text>
              {product?.subjects?.map((subject) => (
                <Text key={subject?.$id} variant="bodyMedium">
                  {subject?.name + ", "}
                </Text>
              ))}
            </View>
          </View>

          <View
            style={{
              alignItems: "flex-end",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
                {"₹" + product?.sellPrice}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                variant="bodySmall"
                style={{
                  fontWeight: "bold",
                  textDecorationLine: "line-through",
                }}
              >
                {"₹" + product?.mrp}
              </Text>
            </View>
            <Text></Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
