import { Dimensions, View } from 'react-native';
import LogoSingle from '../assets/logo/logo_single.svg'
import { ActivityIndicator } from 'react-native-paper';

export default function LoadingScreen() {

  return (
    <View style={{
      height: 400,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <LogoSingle width={100} height={100} />
      <ActivityIndicator animating={true} />
    </View>
  );
}
