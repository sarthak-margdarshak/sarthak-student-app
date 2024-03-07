import { Animated, Dimensions } from "react-native";
import { useRef } from "react";

export default function NavigationEffect({ children }) {

  const pan = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  Animated.timing(pan, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true
  }).start();

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan }]
      }}
    >
      {children}
    </Animated.View>
  )
}