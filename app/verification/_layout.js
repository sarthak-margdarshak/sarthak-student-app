import { Slot } from "expo-router";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import Logofull from '../../assets/logo/logo_full.svg';
import { Text, useTheme } from "react-native-paper";
import * as Linking from 'expo-linking';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ExternalVerificationLayout() {

  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <View
            style={{
              height: Dimensions.get('window').height,
            }}
          >
            <Logofull width={250} height={90} />
            <View
              style={{
                justifyContent: 'center',
                paddingTop: 60,
              }}>
              <Slot />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 10,
                }}
              >
                <Text style={{ margin: 1 }}>Designed By - Sarthak Margdarshak</Text>
                <Text style={{ margin: 1, fontWeight: 'bold' }}>Having any trouble?</Text>
                <Text style={{ margin: 1 }}>Contact Us At :-</Text>
                <Pressable
                  style={{ margin: 1 }}
                  onPress={() => Linking.openURL('mailto:sarthakmargdarshak@gmail.com')}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: theme.colors.secondary,
                      textDecorationLine: 'underline',
                      margin: 1
                    }}
                  >
                    sarthakmargdarshak@gmail.com
                  </Text>
                </Pressable>
                <Pressable
                  style={{ margin: 1 }}
                  onPress={() => Linking.openURL('tel:+918340378552')}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: theme.colors.secondary,
                      textDecorationLine: 'underline'
                    }}
                  >
                    +91 834-037-8552
                  </Text>
                </Pressable>
                <Text style={{ margin: 3 }}>{"© " + (new Date().getFullYear()) + " | All rights reserved | SARTHAK"}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}