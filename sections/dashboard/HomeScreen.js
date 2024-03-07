import { RefreshControl, ScrollView } from "react-native";
import MotivationBox from "./MotivationBox";

export default function HomeScreen() {
  return (
    <ScrollView
      style={{
        margin: 10
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => {}} />
      }
    >
      <MotivationBox />
    </ScrollView>
  )
}