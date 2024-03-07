import { useLocalSearchParams, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, BackHandler, RefreshControl, ScrollView, View } from "react-native";
import { Appbar, Avatar, Divider, Text, TextInput, Tooltip } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";
import UploadImage from "../../components/UploadImage";
import * as ImagePicker from 'expo-image-picker';
import { SnackbarContext } from "../../hooks/useSnackbar";
import AuthGuard from "../../auth/AuthGuard";
import NavigationEffect from "../../components/NavigationEffect";

export default function ProfilePage() {
  const { id } = useLocalSearchParams();
  const { user } = useAuthContext();
  const { showSnackbar } = useContext(SnackbarContext);

  const [avatarLebel, setAvatarLebel] = useState('AA');
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [emailId, setEmailId] = useState(user?.email || '');
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [changeDetected, setChangeDetected] = useState(false);

  useEffect(() => {
    // const temp = user?.name.split(' ');
    // var x = temp[0].at(0).toUpperCase();
    // if (temp.length !== 1) {
    //   x += temp[1].at(0).toUpperCase();
    // }
    // setAvatarLebel(x)
    const backHandler = BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => backHandler.remove();

  }, [])

  const goBack = () => {
    if (changeDetected) {
      Alert.alert('Hold on!', 'Your changes has not been saved yet. Please click save button on top right corner.', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Discart Changes', onPress: () => router.back() },
      ]);
      return true;
    } else {
      router.back()
      return true;
    }
  }

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!_image.canceled) {
      setChangeDetected(true)
      setImage(_image.assets[0].uri)
    }
  }

  const submit = async () => {
    showSnackbar('Saving')
    setChangeDetected(false)
    setEditMode(false)
  }

  return (
    <AuthGuard>
      <NavigationEffect>
        <Appbar.Header
          elevated={true}
        >
          <Appbar.BackAction onPress={goBack} />
          <Appbar.Content title={user?.name} titleStyle={{ fontWeight: 'bold' }} />
          {!editMode ?
            <Tooltip title="Edit">
              <Appbar.Action icon='account-edit' onPress={() => setEditMode(true)} />
            </Tooltip> :
            <Tooltip title="Save">
              <Appbar.Action icon='content-save' onPress={submit} />
            </Tooltip>}
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
          refreshControl={
            <RefreshControl refreshing={false} />
          }
        >
          <View style={{ alignSelf: 'center' }}>

            <UploadImage image={image} editMode={editMode} avatarLebel={avatarLebel} addImage={addImage} />
          </View>

          <Divider
            style={{
              marginTop: 20,
              marginBottom: 20,
              marginLeft: 5,
              marginRight: 5
            }} />
          <Text
            style={{
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 10,
              marginRight: 10
            }}
            variant="labelLarge"
          >
            Personal Information
          </Text>

          <Text
            style={{
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 15,
              marginRight: 15
            }}
            variant="labelMedium"
          >
            Full Name
          </Text>
          <TextInput
            style={{
              marginTop: 5,
              marginBottom: 10,
              marginLeft: 15,
              marginRight: 15
            }}
            mode="outlined"
            value={name}
            left={<TextInput.Icon icon="account" />}
            readOnly={!editMode}
            onChangeText={(text) => {
              setName(text)
              setChangeDetected(true)
            }}
          />

          <Divider
            style={{
              marginTop: 20,
              marginBottom: 20,
              marginLeft: 5,
              marginRight: 5
            }}
          />
          <Text
            style={{
              marginTop: 10,
              marginBottom: 20,
              marginLeft: 5,
              marginRight: 5
            }}
            variant="labelLarge"
          >
            Contact Information
          </Text>

          <Text
            style={{
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 15,
              marginRight: 15
            }}
            variant="labelMedium"
          >
            Email ID
          </Text>
          <TextInput
            style={{
              marginTop: 5,
              marginBottom: 10,
              marginLeft: 15,
              marginRight: 15
            }}
            mode="outlined"
            value={emailId}
            readOnly={!editMode}
            left={<TextInput.Icon icon="email" />}
            keyboardType='email-address'
            onChangeText={(e) => {
              setEmailId(e)
              setChangeDetected(true)
            }}
          />

          <Text
            style={{
              marginTop: 5,
              marginBottom: 5,
              marginLeft: 15,
              marginRight: 15
            }}
            variant="labelMedium"
          >
            Phone Number
          </Text>
          <TextInput
            style={{
              marginTop: 5,
              marginBottom: 10,
              marginLeft: 15,
              marginRight: 15
            }}
            mode="outlined"
            value={phone}
            readOnly={!editMode}
            keyboardType='phone-pad'
            left={<TextInput.Icon icon="phone" />}
            onChangeText={(e) => {
              setPhone(e)
              setChangeDetected(true)
            }}
          />
        </ScrollView>
      </NavigationEffect>
    </AuthGuard>
  )
}