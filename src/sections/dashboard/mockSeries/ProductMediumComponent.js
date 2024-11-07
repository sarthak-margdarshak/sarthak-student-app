import { router } from "expo-router";
import { View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { PATH_DASHBOARD } from "../../../routes/paths";

export default function ProductMediumComponent({
  product,
  cartPage,
  onRemove,
}) {
  const theme = useTheme();
  return (
    <Card
      style={{ margin: 5, padding: 5, paddingBottom: 10 }}
      onPress={() => router.push(PATH_DASHBOARD.product.view(product?.$id))}
    >
      <Card.Cover source={{ uri: product?.images[0] }} />
      <Card.Title
        title={product?.name}
        subtitle={product?.description}
        subtitleNumberOfLines={2}
        titleStyle={{ fontFamily: "Laila-Regular" }}
        subtitleStyle={{ fontFamily: "Laila-Regular" }}
      />
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ alignContent: "flex-start" }}>
            {product?.standards?.length !== 0 && (
              <View style={{ flexDirection: "row" }}>
                <Text
                  variant="bodySmall"
                  style={{ fontWeight: "bold", fontFamily: "Laila-Regular" }}
                >
                  {"Standard - "}
                </Text>
                {product?.standards?.map((standard) => (
                  <Text
                    key={standard?.$id}
                    variant="bodySmall"
                    style={{ fontFamily: "Laila-Regular" }}
                  >
                    {standard?.name + ", "}
                  </Text>
                ))}
              </View>
            )}

            {product?.subjects?.length !== 0 && (
              <View style={{ flexDirection: "row" }}>
                <Text
                  variant="bodySmall"
                  style={{ fontWeight: "bold", fontFamily: "Laila-Regular" }}
                >
                  {"Subjects - "}
                </Text>
                {product?.subjects?.map((subject) => (
                  <Text
                    key={subject?.$id}
                    variant="bodySmall"
                    style={{ fontFamily: "Laila-Regular" }}
                  >
                    {subject?.name + ", "}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {cartPage && (
            <View
              style={{
                alignItems: "flex-end",
              }}
            >
              <Text
                variant="headlineSmall"
                style={{ fontWeight: "bold", fontFamily: "Laila-Regular" }}
              >
                {"₹" + product?.sellPrice}
              </Text>

              <Text
                variant="bodySmall"
                style={{
                  textDecorationLine: "line-through",
                  color: theme.colors.surfaceDisabled,
                  fontFamily: "Laila-Regular",
                }}
              >
                {"₹" + product?.mrp}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
      {cartPage && (
        <Card.Actions>
          <Button
            icon="delete"
            onPress={onRemove}
            labelStyle={{ fontFamily: "Laila-Regular" }}
          >
            Remove from Cart
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
}
