import { useState } from "react";
import { View } from "react-native";
import { Card, Divider, Surface, Text, useTheme } from "react-native-paper";

var Latex = require("react-latex");

export default function DisplayQuestion({
  sn,
  question,
  optionA,
  optionB,
  optionC,
  optionD,
  status,
  optionMarked,
  changeOption,
}) {
  const theme = useTheme();

  const [options, setOptions] = useState({
    a: optionMarked === "A" ? "contained" : "outlined",
    b: optionMarked === "B" ? "contained" : "outlined",
    c: optionMarked === "C" ? "contained" : "outlined",
    d: optionMarked === "D" ? "contained" : "outlined",
  });

  const changeOptionLocal = (option) => {
    if (option === "A") {
      setOptions({
        a: options.a === "contained" ? "outlined" : "contained",
        b: "outlined",
        c: "outlined",
        d: "outlined",
      });
    } else if (option === "B") {
      setOptions({
        a: "outlined",
        b: options.b === "contained" ? "outlined" : "contained",
        c: "outlined",
        d: "outlined",
      });
    } else if (option === "C") {
      setOptions({
        a: "outlined",
        b: "outlined",
        c: options.c === "contained" ? "outlined" : "contained",
        d: "outlined",
      });
    } else if (option === "D") {
      setOptions({
        a: "outlined",
        b: "outlined",
        c: "outlined",
        d: options.d === "contained" ? "outlined" : "contained",
      });
    }
  };

  return (
    <Surface
      elevation={1}
      style={{
        margin: 10,
        marginTop: 20,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          paddingStart: 15,
          paddingEnd: 15,
          backgroundColor:
            status === "answered"
              ? theme.colors.successContainer
              : status === "marked"
              ? theme.colors.warningContainer
              : theme.colors.infoContainer,
          color:
            status === "answered"
              ? theme.colors.onSuccessContainer
              : status === "marked"
              ? theme.colors.onWarningContainer
              : theme.colors.onInfoContainer,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <Text variant="headlineSmall" style={{ fontFamily: "Laila-Regular" }}>
            Question No: {sn}
          </Text>
        </View>

        <View style={{ justifyContent: "center" }}>
          <Text variant="labelLarge" style={{ fontFamily: "Laila-Regular" }}>
            Marking: +1, -0
          </Text>
        </View>
      </View>

      <Divider style={{ marginBottom: 20 }} />

      <View
        style={{
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 10,
          fontWeight: "bold",
          fontFamily: "Laila-Regular",
        }}
      >
        <Latex>{question}</Latex>
      </View>

      <Card
        onPress={() => {
          changeOption("A");
          changeOptionLocal("A");
        }}
        mode={options.a}
        style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
      >
        <Card.Content>
          <View
            style={{
              fontFamily: "Laila-Regular",
            }}
          >
            <Latex>{optionA}</Latex>
          </View>
        </Card.Content>
      </Card>

      <Card
        onPress={() => {
          changeOption("B");
          changeOptionLocal("B");
        }}
        mode={options.b}
        style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
      >
        <Card.Content>
          <View
            style={{
              fontFamily: "Laila-Regular",
            }}
          >
            <Latex>{optionB}</Latex>
          </View>
        </Card.Content>
      </Card>

      <Card
        onPress={() => {
          changeOption("C");
          changeOptionLocal("C");
        }}
        mode={options.c}
        style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
      >
        <Card.Content>
          <View
            style={{
              fontFamily: "Laila-Regular",
            }}
          >
            <Latex>{optionC}</Latex>
          </View>
        </Card.Content>
      </Card>

      <Card
        onPress={() => {
          changeOption("D");
          changeOptionLocal("D");
        }}
        mode={options.d}
        style={{ marginLeft: 10, marginRight: 10, marginBottom: 15 }}
      >
        <Card.Content>
          <View
            style={{
              fontFamily: "Laila-Regular",
            }}
          >
            <Latex>{optionD}</Latex>
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );
}
