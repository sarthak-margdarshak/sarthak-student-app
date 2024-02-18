import { Dimensions, Platform, ScrollView, useColorScheme, View } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';


export default function SarthakAppBackground({ children }) {

  const theme = useTheme();
  const defaultColorScheme = useColorScheme();
  if (defaultColorScheme === 'dark') {
    theme.colors = darkTheme.colors;
    theme.dark = true;
  } else {
    theme.colors = lightTheme.colors;
  }

  var windowWidth;
  const platform = Platform.OS;
  if (platform === 'web') {
    windowWidth = 400;
  } else {
    windowWidth = Dimensions.get('screen').width;
  }

  return (
    <PaperProvider theme={theme}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          width: windowWidth,
          height: Dimensions.get('screen').height,
          alignSelf: 'center',
          backgroundColor: theme.colors.background,
        }}>
        {children}
      </View>
    </PaperProvider>
  );
}

