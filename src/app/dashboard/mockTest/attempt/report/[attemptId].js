import { Stack, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import { appwriteDatabases } from "../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../config-global";

export default function AttemptReport() {
  const { attemptId } = useLocalSearchParams();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [correctQuestion, setCorrectQuestion] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.attempts,
        attemptId
      );
      setCorrectQuestion(x.correct_questions);
      setIncorrectQuestions(x.incorrect_questions);
      setSkippedQuestions(x.skipped_questions);
      setLoading(false);
    };
    fetchData();
  }, [attemptId]);

  return (
    <Fragment>
      <Stack.Screen
        options={{
          title: "Test Report",
        }}
      />

      <ScrollView
        style={{
          height: Dimensions.get("window").height,
          backgroundColor: theme.colors.surface,
          padding: 10,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <View>
          <Text variant="labelLarge" style={{ margin: 5 }}>
            Correct Questions - {correctQuestion}
          </Text>
          <Text variant="labelLarge" style={{ margin: 5 }}>
            Incorrect Questions - {incorrectQuestions}
          </Text>
          <Text variant="labelLarge" style={{ margin: 5 }}>
            Skipped Questions - {skippedQuestions}
          </Text>

          <Divider />

          <Text variant="headlineSmall" style={{ margin: 5 }}>
            Total Marks - {correctQuestion} out of{" "}
            {correctQuestion + incorrectQuestions + skippedQuestions}
          </Text>

          <Divider />
        </View>
      </ScrollView>
    </Fragment>
  );
}
