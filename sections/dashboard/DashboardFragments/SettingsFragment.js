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
import { Dimensions, Linking, ScrollView } from "react-native";
import { Divider, List, RadioButton, useTheme } from "react-native-paper";
import { langPath, useLocales } from "../../../locales";
import { appwriteAccount } from "../../../auth/AppwriteContext";
import { useAuthContext } from "../../../auth/useAuthContext";
import { useThemeContext } from "../../../theme/useThemeContext";

export default function SettingsFragment() {
  const { updateTheme } = useThemeContext();
  const theme = useTheme();
  const { translate, allLangs, currentLang, onChangeLang } = useLocales();
  const { user } = useAuthContext();

  const [preferenceLanguage, setPreferenceLanguage] = useState(currentLang);
  const [preferenceTheme, setPreferenceTheme] = useState("system_default");

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
          title={translate(
            langPath.section.dashboard.dashboardFragments.settingsFragments
              .language
          )}
          id="1"
          theme={theme}
          left={() => <List.Icon icon="alphabet-greek" />}
          style={{ borderRadius: 10, paddingLeft: 5 }}
        >
          <RadioButton.Group
            onValueChange={(newValue) => {
              setPreferenceLanguage(newValue);
              onChangeLang(newValue);
              appwriteAccount.updatePrefs({ ...user?.prefs, lang: newValue });
            }}
            value={preferenceLanguage}
          >
            {allLangs.map((lang) => (
              <RadioButton.Item
                label={lang.label}
                value={lang.value}
                key={lang.value}
                theme={theme}
              />
            ))}
          </RadioButton.Group>
        </List.Accordion>

        <List.Accordion
          title={translate(
            langPath.section.dashboard.dashboardFragments.settingsFragments
              .theme
          )}
          theme={theme}
          id="2"
          left={() => <List.Icon icon="theme-light-dark" />}
          style={{ borderRadius: 10, paddingLeft: 5 }}
        >
          <RadioButton.Group
            onValueChange={(newValue) => {
              setPreferenceTheme(newValue);
              updateTheme(newValue);
              appwriteAccount.updatePrefs({ ...user?.prefs, theme: newValue });
            }}
            value={preferenceTheme}
          >
            <RadioButton.Item
              label={translate(
                langPath.section.dashboard.dashboardFragments.settingsFragments
                  .themeType.system_default
              )}
              theme={theme}
              value="system_default"
            />
            <RadioButton.Item
              label={translate(
                langPath.section.dashboard.dashboardFragments.settingsFragments
                  .themeType.light
              )}
              theme={theme}
              value="light"
            />
            <RadioButton.Item
              label={translate(
                langPath.section.dashboard.dashboardFragments.settingsFragments
                  .themeType.dark
              )}
              theme={theme}
              value="dark"
            />
          </RadioButton.Group>
        </List.Accordion>

        <Divider style={{ marginTop: 5 }} theme={theme} />

        <List.Item
          left={() => <List.Icon icon="star-outline" />}
          right={() => <List.Icon icon="chevron-right" />}
          title={translate(
            langPath.section.dashboard.dashboardFragments.settingsFragments
              .rate_app
          )}
          theme={theme}
          onPress={() => console.log("Rate")}
          style={{ paddingLeft: 5, marginTop: 5 }}
        />

        <List.Item
          left={() => <List.Icon icon="chat-plus-outline" />}
          right={() => <List.Icon icon="chevron-right" />}
          title={translate(
            langPath.section.dashboard.dashboardFragments.settingsFragments
              .send_feedback
          )}
          theme={theme}
          onPress={() =>
            Linking.openURL("https://www.sarthakmargdarshak.in/contact-us")
          }
          style={{ paddingLeft: 5 }}
        />

        <List.Item
          left={() => <List.Icon icon="help-circle-outline" />}
          right={() => <List.Icon icon="chevron-right" />}
          title={translate(
            langPath.section.dashboard.dashboardFragments.settingsFragments
              .help_center
          )}
          theme={theme}
          onPress={() =>
            Linking.openURL("https://www.sarthakmargdarshak.in/faqs")
          }
          style={{ paddingLeft: 5 }}
        />

        <List.Item
          left={() => <List.Icon icon="information-outline" />}
          right={() => <List.Icon icon="chevron-right" />}
          title={translate(
            langPath.section.dashboard.dashboardFragments.settingsFragments
              .about
          )}
          theme={theme}
          onPress={() =>
            Linking.openURL("https://www.sarthakmargdarshak.in/about-us")
          }
          style={{ paddingLeft: 5 }}
        />
      </List.AccordionGroup>
    </ScrollView>
  );
}
