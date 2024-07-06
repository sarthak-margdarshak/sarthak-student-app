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
import { Dimensions, ScrollView, View } from "react-native";
import { Divider, List, RadioButton, Text, useTheme } from "react-native-paper";

export default function SettingsFragment() {
  const [preferenceLanguage, setPreferenceLanguage] = useState("en");
  const theme = useTheme();

  return (
    <ScrollView
      style={{
        height: Dimensions.get("window").height,
        backgroundColor: theme.colors.surface,
        padding: 10,
      }}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets={true}
    >
      <List.AccordionGroup>
        <List.Accordion
          title="Language"
          id="2"
          left={() => <List.Icon icon="alphabet-greek" />}
          style={{ borderRadius: 20, paddingLeft: 10, marginBottom: 10 }}
        >
          <RadioButton.Group
            onValueChange={(newValue) => setPreferenceLanguage(newValue)}
            value={preferenceLanguage}
          >
            <View
              style={{
                flexDirection: "row",
                marginLeft: 20,
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <RadioButton value="en" />
              <Text
                style={{ justifyContent: "space-evenly" }}
                onPress={() => setPreferenceLanguage("en")}
              >
                English
              </Text>
            </View>
          </RadioButton.Group>
        </List.Accordion>
        <Divider />
        <List.Item
          left={() => <List.Icon icon="star" />}
          title="Rate Sarthak"
          onPress={() => console.log("Rate")}
          style={{ borderRadius: 20, paddingLeft: 10, marginTop: 10 }}
        />
        <List.Item
          left={() => <List.Icon icon="chat-plus" />}
          title="Send Feedback"
          onPress={() => console.log("Feedback")}
          style={{ borderRadius: 20, paddingLeft: 10 }}
        />
        <List.Item
          left={() => <List.Icon icon="help-circle" />}
          title="Help Center"
          onPress={() => console.log("Help")}
          style={{ borderRadius: 20, paddingLeft: 10 }}
        />
        <List.Item
          left={() => <List.Icon icon="information-variant" />}
          title="About"
          onPress={() => console.log("About")}
          style={{ borderRadius: 20, paddingLeft: 10 }}
        />
      </List.AccordionGroup>
    </ScrollView>
  );
}
