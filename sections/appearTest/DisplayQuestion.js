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

import { useState } from "react";
import { Card, Text } from "react-native-paper";

export default function DisplayQuestion({
  sn,
  question,
  optionA,
  optionB,
  optionC,
  optionD,
}) {
  const [options, setOptions] = useState({
    a: "outlined",
    b: "outlined",
    c: "outlined",
    d: "outlined",
  });

  const changeOption = (option) => {
    if (option === "a") {
      setOptions({
        a: "contained",
        b: "outlined",
        c: "outlined",
        d: "outlined",
      });
    } else if (option === "b") {
      setOptions({
        a: "outlined",
        b: "contained",
        c: "outlined",
        d: "outlined",
      });
    } else if (option === "c") {
      setOptions({
        a: "outlined",
        b: "outlined",
        c: "contained",
        d: "outlined",
      });
    } else if (option === "d") {
      setOptions({
        a: "outlined",
        b: "outlined",
        c: "outlined",
        d: "contained",
      });
    }
  };

  return (
    <>
      <Text style={{ marginLeft: 15 }} variant="headlineSmall">
        Q. {sn}
      </Text>
      <Text
        style={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }}
        variant="titleMedium"
      >
        {question}
      </Text>
      <Card
        onPress={() => changeOption("a")}
        mode={options.a}
        style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
      >
        <Card.Content>
          <Text variant="bodyMedium">{optionA}</Text>
        </Card.Content>
      </Card>

      <Card
        onPress={() => changeOption("b")}
        mode={options.b}
        style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
      >
        <Card.Content>
          <Text variant="bodyMedium">{optionB}</Text>
        </Card.Content>
      </Card>

      <Card
        onPress={() => changeOption("c")}
        mode={options.c}
        style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
      >
        <Card.Content>
          <Text variant="bodyMedium">{optionC}</Text>
        </Card.Content>
      </Card>

      <Card
        onPress={() => changeOption("d")}
        mode={options.d}
        style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
      >
        <Card.Content>
          <Text variant="bodyMedium">{optionD}</Text>
        </Card.Content>
      </Card>
    </>
  );
}
