import { Slot, router } from "expo-router";
import AuthGuard from "../../auth/AuthGuard";
import { Appbar, Banner, BottomNavigation, Divider, FAB, Menu } from "react-native-paper";
import { useAuthContext } from "../../auth/useAuthContext";
import { useState } from "react";
import HomeScreen from "../../sections/dashboard/HomeScreen";
import AllMockScreen from "../../sections/dashboard/AllMockScreen";
import MyMockScreen from "../../sections/dashboard/MyMock";
import ComboPlanScreen from "../../sections/dashboard/ComboPlans";
import { Platform } from "react-native";
import VerifyEmailComponent from "../../sections/auth/VerifyEmailComponent";

export default function DashboardLayout() {

  const { user, logout, currentDashboardIndex, setCurrentDashboardIndex } = useAuthContext();
  const [index, setIndex] = useState(currentDashboardIndex);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'allMock', title: 'All Mock', focusedIcon: 'book-open', unfocusedIcon: 'book-open-outline' },
    { key: 'myMock', title: 'My Mock', focusedIcon: 'badge-account-horizontal', unfocusedIcon: 'badge-account-horizontal-outline' },
    { key: 'comboPlans', title: 'Combo Plans', focusedIcon: 'cart', unfocusedIcon: 'cart-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    allMock: AllMockScreen,
    myMock: MyMockScreen,
    comboPlans: ComboPlanScreen,
  });

  const [visible, setVisible] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(!user?.emailVerification);
  const [showEmailVerifyDialog, setShowEmailVerifyDialog] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <AuthGuard>
      <Appbar.Header
        elevated={true}
      >
        <Appbar.Content title="Sarthak" titleStyle={{ fontWeight: 'bold' }} />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon='account' onPress={openMenu} />}>
          <Menu.Item title={user?.name} />
          <Menu.Item title={user?.email} />
          <Menu.Item onPress={() => {router.push('/profile/'+user?.$id)}} title="Profile" leadingIcon='account-settings' />
          <Menu.Item onPress={() => {router.push('/profile/settings')}} title="Settings" leadingIcon='cog' />
          <Divider />
          <Menu.Item onPress={logout} title="Logout" leadingIcon='logout' />
        </Menu>
      </Appbar.Header>
      <Banner
        visible={bannerVisible}
        actions={[
          {
            label: 'Ignore',
            onPress: () => setBannerVisible(false),
          },
          {
            label: 'Verify',
            onPress: () => setShowEmailVerifyDialog(true),
          },
        ]}
        icon='email-alert'
      >
        Your account is not verified. To attempt / To purchase any plan, Your account should be verified. Please verify your account. If already verfied, please ignore.
      </Banner>
      <Slot />
      <BottomNavigation
        style={{
          left: 0,
          right: 0,
          bottom: 0,
        }}
        navigationState={{ index, routes }}
        onIndexChange={(i) => {setCurrentDashboardIndex(i); setIndex(i)}}
        renderScene={renderScene}
      />
      <FAB
        icon='chat'
        onPress={() => console.log('Pressed')}
        style={{
          bottom: Platform.OS === 'ios' ? 130 : 100,
          right: 20,
          position: 'absolute'
        }}
      />
      <VerifyEmailComponent visible={showEmailVerifyDialog} hideDialog={() => setShowEmailVerifyDialog(false)} />
    </AuthGuard>
  );
}