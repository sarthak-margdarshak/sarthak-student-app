import { useState } from "react";
import { View } from "react-native";
import {
  Card,
  Divider,
  Icon,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

var Latex = require("react-latex");

export default function QuestionReport({
  sn,
  question,
  optionA,
  optionB,
  optionC,
  optionD,
  contentAnswer,
  optionMarked,
  answer,
}) {
  const theme = useTheme();

  const [options, setOptions] = useState({
    a: optionMarked === "A" || answer === "A" ? "contained" : "outlined",
    b: optionMarked === "B" || answer === "B" ? "contained" : "outlined",
    c: optionMarked === "C" || answer === "C" ? "contained" : "outlined",
    d: optionMarked === "D" || answer === "D" ? "contained" : "outlined",
  });

  const [status, setStatus] = useState(
    optionMarked === ""
      ? "skipped"
      : optionMarked === answer
      ? "correct"
      : "incorrect"
  );

  return (
    <Surface
      elevation={1}
      style={{
        margin: 10,
        marginTop: 20,
        paddingBottom: 20,
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
            status === "skipped"
              ? theme.colors.infoContainer
              : status === "correct"
              ? theme.colors.successContainer
              : theme.colors.errorContainer,
          color:
            status === "skipped"
              ? theme.colors.onInfoContainer
              : status === "correct"
              ? theme.colors.onSuccessContainer
              : theme.colors.onErrorContainer,
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
          {status === "correct" ? (
            <Icon source="checkbox-marked" size={30} />
          ) : (
            <Icon source="close-box" size={30} />
          )}
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
        mode={options.a}
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          backgroundColor:
            answer === "A"
              ? theme.colors.successContainer
              : optionMarked === "A"
              ? theme.colors.errorContainer
              : theme.colors.background,
        }}
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
      {optionMarked === "A" && (
        <Text
          variant="labelSmall"
          style={{ fontFamily: "Laila-Regular", marginLeft: 15 }}
        >
          Your Answer
        </Text>
      )}
      {answer === "A" && (
        <Text
          variant="labelSmall"
          style={{ fontFamily: "Laila-Regular", marginLeft: 15 }}
        >
          Correct Answer
        </Text>
      )}

      <Card
        mode={options.b}
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          backgroundColor:
            answer === "B"
              ? theme.colors.successContainer
              : optionMarked === "B"
              ? theme.colors.errorContainer
              : theme.colors.background,
        }}
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
      {optionMarked === "B" && (
        <Text
          variant="labelSmall"
          style={{ fontFamily: "Laila-Regular", marginLeft: 15 }}
        >
          Your Answer
        </Text>
      )}
      {answer === "B" && (
        <Text
          variant="labelSmall"
          style={{ fontFamily: "Laila-Regular", marginLeft: 15 }}
        >
          Correct Answer
        </Text>
      )}

      <Card
        mode={options.c}
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          backgroundColor:
            answer === "C"
              ? theme.colors.successContainer
              : optionMarked === "C"
              ? theme.colors.errorContainer
              : theme.colors.background,
        }}
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
      {optionMarked === "C" && (
        <Text
          variant="labelSmall"
          style={{ fontFamily: "Laila-Regular", marginLeft: 15 }}
        >
          Your Answer
        </Text>
      )}
      {answer === "C" && (
        <Text
          variant="labelSmall"
          style={{ fontFamily: "Laila-Regular", marginLeft: 15 }}
        >
          Correct Answer
        </Text>
      )}

      <Card
        mode={options.d}
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          backgroundColor:
            answer === "D"
              ? theme.colors.successContainer
              : optionMarked === "D"
              ? theme.colors.errorContainer
              : theme.colors.background,
        }}
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
      {optionMarked === "D" && (
        <Text
          variant="labelSmall"
          style={{ fontFamily: "Laila-Regular", marginLeft: 15 }}
        >
          Your Answer
        </Text>
      )}
      {answer === "D" && (
        <Text
          variant="labelSmall"
          style={{ fontFamily: "Laila-Regular", marginLeft: 15 }}
        >
          Correct Answer
        </Text>
      )}

      <Divider bold style={{ marginTop: 5 }} />
      <Divider bold />
      <Divider bold />

      <Card
        mode={options.d}
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          backgroundColor: theme.colors.infoContainer,
        }}
      >
        <Card.Title
          title="Explanation :-"
          titleStyle={{ fontFamily: "Laila-Regular" }}
        />
        <Card.Content>
          <View
            style={{
              fontFamily: "Laila-Regular",
            }}
          >
            <Latex>{contentAnswer}</Latex>
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );
}
