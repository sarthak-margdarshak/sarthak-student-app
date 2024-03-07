import { useLocalSearchParams, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, BackHandler, RefreshControl, ScrollView, View } from "react-native";
import { Appbar, Divider, List, RadioButton, Text, TextInput } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";
import { SnackbarContext } from "../../hooks/useSnackbar";
import NavigationEffect from "../../components/NavigationEffect";
import AuthGuard from "../../auth/AuthGuard";

export default function SettingsPage() {
  const { user } = useAuthContext();
  const { showSnackbar } = useContext(SnackbarContext);

  const [preferenceTheme, setPreferenceTheme] = useState('system_default');
  const [preferenceLanguage, setPreferenceLanguage] = useState('en');

  return (
    <AuthGuard>
      <NavigationEffect>
        <Appbar.Header
          elevated={true}
        >
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title='Settings' titleStyle={{ fontWeight: 'bold' }} />
        </Appbar.Header>
        <ScrollView
          style={{
            margin: 10
          }}
          contentContainerStyle={{
            paddingBottom: 100
          }}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          <List.AccordionGroup>
            <List.Accordion title="Theme" id="1" left={() => <List.Icon icon='theme-light-dark' />} style={{borderRadius: 20, paddingLeft: 10}}>
              <RadioButton.Group onValueChange={newValue => setPreferenceTheme(newValue)} value={preferenceTheme}>
                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                  <RadioButton value="system_default" />
                  <Text style={{ justifyContent: 'space-evenly' }} onPress={() => setPreferenceTheme('system_default')}>System Default</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                  <RadioButton value="light" />
                  <Text style={{ justifyContent: 'space-evenly' }} onPress={() => setPreferenceTheme('light')}>Light</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                  <RadioButton value="dark" />
                  <Text style={{ justifyContent: 'space-evenly' }} onPress={() => setPreferenceTheme('dark')}>Dark</Text>
                </View>
              </RadioButton.Group>
            </List.Accordion>
            <List.Accordion title="Language" id="2" left={() => <List.Icon icon='alphabet-greek' />}  style={{borderRadius: 20, paddingLeft: 10, marginBottom: 10}}>
              <RadioButton.Group onValueChange={newValue => setPreferenceTheme(newValue)} value={preferenceLanguage}>
                <View style={{ flexDirection: 'row', marginLeft: 20, marginBottom: 10, alignItems: 'center' }}>
                  <RadioButton value="en" />
                  <Text style={{ justifyContent: 'space-evenly' }} onPress={() => setPreferenceLanguage('en')}>English</Text>
                </View>
              </RadioButton.Group>
            </List.Accordion>
            <Divider />
            <List.Item
              left={() => <List.Icon icon='star' />} 
              title='Rate Sarthak' 
              onPress={() => console.log('Rate')}  
              style={{borderRadius: 20, paddingLeft: 10, marginTop: 10}} />
            <List.Item left={() => <List.Icon icon='chat-plus' />} title='Send Feedback' onPress={() => console.log('Feedback')}  style={{borderRadius: 20, paddingLeft: 10}} />
            <List.Item left={() => <List.Icon icon='help-circle' />} title='Help Center' onPress={() => console.log('Help')}  style={{borderRadius: 20, paddingLeft: 10}} />
            <List.Item left={() => <List.Icon icon='information-variant' />} title='About' onPress={() => console.log('About')}  style={{borderRadius: 20, paddingLeft: 10}} />
          </List.AccordionGroup>
        </ScrollView>
      </NavigationEffect>
    </AuthGuard>
  )
}