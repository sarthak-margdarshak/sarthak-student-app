import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Appbar, Divider, Surface, Text, useTheme } from "react-native-paper";
import { appwriteDatabases } from "../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../config-global";
import { Col, Container, Row } from "react-bootstrap";
import { Skeleton } from "react-native-skeletons";
import { Toast } from "react-native-toast-notifications";
import QuestionReport from "../../../../../sections/appearTest/QuestionReport";

export default function AttemptReport() {
  const { attemptId } = useLocalSearchParams();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [correctQuestion, setCorrectQuestion] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const x = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.attempts,
          attemptId
        );
        setCorrectQuestion(x.correct_questions);
        setIncorrectQuestions(x.incorrect_questions);
        setSkippedQuestions(x.skipped_questions);
        setAnswers(x.answers);

        const questionIds = (
          await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.mockTest,
            x.mockTestId
          )
        ).questions;

        var tmpQ = [];

        for (let i in questionIds) {
          tmpQ.push(
            await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.questions,
              questionIds[i]
            )
          );
        }
        setQuestions(tmpQ);
      } catch (error) {
        Toast.show(error.message, {
          type: "danger",
          textStyle: { fontFamily: "Laila-Regular" },
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [attemptId]);

  return (
    <Fragment>
      <Appbar.Header>
        {router.canGoBack() && (
          <Appbar.BackAction onPress={() => router.back()} />
        )}
        {!router.canGoBack() && (
          <img
            src="https://api.sarthakmargdarshak.in/v1/storage/buckets/672a50aa003599f495e8/files/672a50c8003897892e6a/view?project=671f66a0001e5803f481&project=671f66a0001e5803f481&mode=admin"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="sarthak-logo"
            style={{ margin: 3 }}
            onClick={() => {
              router.dismissAll();
              router.replace(PATH_DASHBOARD.root);
            }}
          />
        )}
        <Appbar.Content
          titleStyle={{ fontFamily: "Laila-Regular" }}
          title="Report"
        />
      </Appbar.Header>

      <ScrollView
        style={{
          height: Dimensions.get("window").height - 70,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        {loading ? (
          <View>
            <Skeleton
              height={100}
              color={theme.colors.inverseOnSurface}
              style={{ marginBottom: 10 }}
            />
            <Skeleton
              height={50}
              color={theme.colors.inverseOnSurface}
              style={{ marginBottom: 10 }}
            />
            <Skeleton
              height={150}
              count={10}
              color={theme.colors.inverseOnSurface}
              style={{ marginBottom: 10 }}
            />
          </View>
        ) : (
          <View>
            <Surface elevation={1} style={{ margin: 10, padding: 10 }}>
              <Container>
                <Row style={{ alignItems: "center" }}>
                  <Col xs={4}>
                    <Text
                      variant="headlineLarge"
                      style={{
                        fontFamily: "Laila-Regular",
                        fontWeight: "bold",
                      }}
                    >
                      {Math.round(
                        (correctQuestion * 100) /
                          (correctQuestion +
                            incorrectQuestions +
                            skippedQuestions)
                      ) + "%"}
                    </Text>
                  </Col>

                  <Col xs={3}>
                    <View
                      style={{
                        width: 50,
                        height: 80,
                        borderRadius: 50,
                        borderColor: "black",
                        borderWidth: 2,
                      }}
                    >
                      <View
                        style={{
                          marginTop: 38,
                          width: 48,
                          height: 1,
                          borderColor: "black",
                          borderWidth: 1,
                        }}
                      />

                      <Text
                        variant="bodyLarge"
                        style={{
                          marginTop: 6,
                          marginLeft: 15,
                          fontFamily: "Laila-Regular",
                          fontWeight: "bold",
                        }}
                      >
                        {correctQuestion +
                          incorrectQuestions +
                          skippedQuestions}
                      </Text>

                      <Text
                        variant="bodyLarge"
                        style={{
                          marginTop: -55,
                          marginLeft: 15,
                          fontFamily: "Laila-Regular",
                          fontWeight: "bold",
                        }}
                      >
                        {correctQuestion}
                      </Text>
                    </View>
                  </Col>

                  <Col xs={5}>
                    <View>
                      <Text style={{ fontFamily: "Laila-Regular" }}>
                        {"Correct - " + correctQuestion + " "}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontFamily: "Laila-Regular" }}>
                        {"Incorrect - " + incorrectQuestions + " "}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontFamily: "Laila-Regular" }}>
                        {"Skipped - " + skippedQuestions + " "}
                      </Text>
                    </View>
                  </Col>
                </Row>
              </Container>
            </Surface>

            <Divider bold />

            {questions?.map((question, index) => (
              <QuestionReport
                key={index}
                sn={index + 1}
                question={question.contentQuestion}
                optionA={question.contentOptionA}
                optionB={question.contentOptionB}
                optionC={question.contentOptionC}
                optionD={question.contentOptionD}
                contentAnswer={question.contentAnswer}
                optionMarked={answers[index]}
                answer={question.answerOption}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Fragment>
  );
}
