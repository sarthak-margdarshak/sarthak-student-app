import { View } from "react-native";
import { Card, Text } from "react-native-paper";

export default function TestHeader({ standard, subject, chapter, testName, concepts }) {
  return (
    <Card mode='elevated' style={{ margin: 5 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="bodyMedium">Standard - </Text>
            <Text variant="bodySmall">{standard}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="bodyMedium">Subject - </Text>
            <Text variant="bodySmall">{subject}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="bodyMedium">Chapter - </Text>
            <Text variant="bodySmall">{chapter}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="bodyMedium">Test Name - </Text>
            <Text variant="bodySmall">{testName}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text variant="bodyMedium">Concepts - </Text>
          <Text variant="bodySmall">{concepts}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}