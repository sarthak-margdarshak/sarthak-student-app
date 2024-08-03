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

import { ScrollView } from "react-native";
import { Button, Divider, List, Text, TextInput } from "react-native-paper";
import { useAuthContext } from "../../../auth/useAuthContext";
import { router } from "expo-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { langPath, useLocales } from "../../../locales";

export default function ProfileFragment() {
  const { user, logout } = useAuthContext();
  const { translate } = useLocales();

  return (
    <ScrollView
      style={{
        margin: 10,
      }}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets={true}
    >
      <Text
        style={{
          marginTop: 10,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
        }}
        variant="labelLarge"
      >
        {translate(
          langPath.section.dashboard.dashboardFragments.ProfileFragments
            .pers_info
        )}
      </Text>

      <Text
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        variant="labelMedium"
      >
        {translate(
          langPath.section.dashboard.dashboardFragments.ProfileFragments
            .fullName
        )}
      </Text>

      <TextInput
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        mode="outlined"
        value={user?.name}
        left={<TextInput.Icon icon="account" />}
        readOnly
      />

      <Divider
        style={{
          marginTop: 5,
          marginBottom: 5,
        }}
      />

      <Text
        style={{
          marginTop: 10,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
        }}
        variant="labelLarge"
      >
        {translate(
          langPath.section.dashboard.dashboardFragments.ProfileFragments
            .contactInfo
        )}
      </Text>

      <Text
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        variant="labelMedium"
      >
        {translate(
          langPath.section.dashboard.dashboardFragments.ProfileFragments.emailId
        )}
      </Text>

      <TextInput
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
        mode="outlined"
        value={user?.email}
        readOnly
        left={<TextInput.Icon icon="email" />}
        keyboardType="email-address"
      />

      <Divider
        style={{
          marginTop: 5,
          marginBottom: 5,
        }}
      />

      <List.Item
        title={translate(
          langPath.section.dashboard.dashboardFragments.ProfileFragments
            .yourOrders
        )}
        left={(props) => <List.Icon {...props} icon="cart-arrow-up" />}
        right={() => <List.Icon icon="chevron-right" />}
        onPress={() => router.push(PATH_DASHBOARD.orders.list)}
      />

      <List.Item
        title={translate(langPath.app.dashboard.preferences.title)}
        left={(props) => <List.Icon {...props} icon="cog" />}
        right={() => <List.Icon icon="chevron-right" />}
        onPress={() => router.push(PATH_DASHBOARD.preferences)}
        style={{ borderRadius: 10 }}
      />

      <Button
        style={{
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          borderRadius: 10,
        }}
        icon="logout"
        mode="elevated"
        onPress={logout}
      >
        {translate(langPath.auth.logOut)}
      </Button>
    </ScrollView>
  );
}
