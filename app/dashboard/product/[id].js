import { Stack, useLocalSearchParams } from "expo-router";
import { Fragment } from "react";
import { Dimensions, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function productView() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  return (
    <Fragment>
      <Stack.Screen
        options={{
          title: id,
        }}
      />
      <ScrollView
        style={{
          height: Dimensions.get("window").height,
          backgroundColor: theme.colors.surface,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
          // paddingTop: 80,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <Text>{id}</Text>
      </ScrollView>
    </Fragment>
  );
}
