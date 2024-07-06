import {
  BackHandler,
  Dimensions,
  ScrollView,
  StatusBar,
  ToastAndroid,
  View,
} from "react-native";
import DisplayQuestion from "../../../../sections/appearTest/DisplayQuestion";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  Modal,
  Portal,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper";
import { Fragment, useEffect, useState } from "react";
import {
  Stack,
  router,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import InstructionPage from "../../../../sections/appearTest/InstructionPage";
import { appwriteDatabases } from "../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../config-global";
import { Query } from "appwrite";
import { useTimer } from "react-timer-hook";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../../routes/paths";

export default function AppearMockTest() {
  const { attemptId, duration } = useLocalSearchParams();
  const theme = useTheme();
  const navigation = useNavigation();

  const time = new Date();
  time.setSeconds(time.getSeconds() + parseInt(duration));

  const { totalSeconds, seconds, minutes, hours, start, pause } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => submitTest("system"),
  });

  const [mockTest, setMockTest] = useState({});
  const [attempt, setAttempt] = useState({});
  const [loading, setLoading] = useState(false);
  const [testPage, setTestPage] = useState(0);
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [modelVisible, setModelVisible] = useState(false);
  const [backDialogVisible, setBackDialogVisible] = useState(false);
  const [backAction, setBackAction] = useState(null);
  const [backInitiatedBy, setBackInitiatedBy] = useState("user");

  useEffect(() => {
    const fetchMockTest = async () => {
      setLoading(true);
      try {
        const y = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.attempts,
          attemptId
        );
        setAttempt(y);
        var x = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTest,
          y.mockTestId,
          [Query.select(["name", "description", "questions", "duration"])]
        );

        for (let i in x.questions) {
          x.questions[i] = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.questions,
            x.questions[i],
            [
              Query.select([
                "coverOptionA",
                "coverOptionD",
                "coverOptionB",
                "coverOptionC",
                "coverQuestion",
                "contentQuestion",
                "contentOptionA",
                "contentOptionB",
                "contentOptionC",
                "contentOptionD",
                "answerOption",
              ]),
            ]
          );
        }

        setMockTest(x);
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      setLoading(false);
    };
    fetchMockTest();

    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      setBackDialogVisible(true);
      setBackAction(e.data.action);
    });
  }, [attemptId]);

  const submitTest = async (actionBy) => {
    try {
      pause();
      setTestPage(2);
      var answers = mockTest.questions.map((question) => question.answerOption);
      var skipped = 0;
      var correct = 0;
      var inCorrect = 0;
      for (let i in attempt.answers) {
        if (attempt.answers[i] === null || attempt.answers[i] === "") {
          skipped += 1;
        } else {
          if (attempt.answers[i] === answers[i]) {
            correct += 1;
          } else {
            inCorrect += 1;
          }
        }
      }
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.attempts,
        attemptId,
        {
          answers: attempt?.answers,
          questionStatus: attempt?.questionStatus,
          time_remaining_in_seconds: totalSeconds,
          status: "complete",
          test_ended_by: actionBy,
          test_ended: new Date(),
          evaluated_answers: answers,
          correct_questions: correct,
          incorrect_questions: inCorrect,
          skipped_questions: skipped,
        }
      );

      setTestPage(3);
      ToastAndroid.show("Test Submitted Successfully", ToastAndroid.LONG);

      setBackInitiatedBy("system");
      setTimeout(() => {
        router.replace(PATH_DASHBOARD.mockTest.attempReport(attemptId));
      }, 5000);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  const startTest = async () => {
    setTestPage(1);
    setCurrQuestionIndex(0);
    if (attempt.duration_in_seconds === attempt.time_remaining_in_seconds) {
      appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.attempts,
        attemptId,
        {
          answers: attempt?.answers,
          questionStatus: attempt?.questionStatus,
          time_remaining_in_seconds: totalSeconds,
          status: "in_progress",
          test_started: new Date(),
        }
      );
    }
    start();
  };

  function getProgressColor(radiant) {
    const successColor = theme.colors.success
      .replaceAll(" ", "")
      .split("(")[1]
      .split(")")[0]
      .split(",");
    const errorColor = theme.colors.error
      .replaceAll(" ", "")
      .split("(")[1]
      .split(")")[0]
      .split(",");
    var requiredR = Math.floor(
      parseInt(successColor[0]) * radiant +
        parseInt(errorColor[0]) * (1 - radiant)
    );
    var requiredG = Math.floor(
      parseInt(successColor[1]) * radiant +
        parseInt(errorColor[1]) * (1 - radiant)
    );
    var requiredB = Math.floor(
      parseInt(successColor[2]) * radiant +
        parseInt(errorColor[2]) * (1 - radiant)
    );
    return "rgb(" + requiredR + ", " + requiredG + ", " + requiredB + ")";
  }

  const nextQuestion = async (mode) => {
    if (currQuestionIndex !== mockTest?.questions?.length - 1) {
      var y = attempt?.questionStatus;
      if (mode === "mark") {
        y[currQuestionIndex] = "marked";
      }
      if (
        y[currQuestionIndex + 1] === null ||
        y[currQuestionIndex + 1] === ""
      ) {
        y[currQuestionIndex + 1] = "visited";
      }
      setAttempt({ ...attempt, questionStatus: y });
      setCurrQuestionIndex(currQuestionIndex + 1);
      saveState();
    }
  };

  const previousQuestion = async () => {
    if (currQuestionIndex !== 0) {
      setCurrQuestionIndex(currQuestionIndex - 1);
      saveState();
    }
  };

  const changeOptionCurr = (option) => {
    var x = attempt?.answers;
    var y = attempt?.questionStatus;
    if (x[currQuestionIndex] === option) {
      x[currQuestionIndex] = "";
      y[currQuestionIndex] = "visited";
    } else {
      x[currQuestionIndex] = option;
      y[currQuestionIndex] = "answered";
    }
    setAttempt({ ...attempt, answers: x, questionStatus: y });
  };

  const saveState = async () => {
    try {
      appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.attempts,
        attemptId,
        {
          answers: attempt?.answers,
          questionStatus: attempt?.questionStatus,
          time_remaining_in_seconds: totalSeconds,
          status: "in_progress",
        }
      );
    } catch (error) {}
  };

  if (totalSeconds % 10 === 0 && testPage === 1) {
    saveState();
  }

  return (
    <Fragment>
      <StatusBar backgroundColor={theme.colors.surface} />

      <SafeAreaView>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        {loading ? (
          <View
            style={{
              height: Dimensions.get("window").height,
              backgroundColor: theme.colors.surface,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <Skeleton
                  height={40}
                  width={120}
                  color={theme.colors.inverseOnSurface}
                />
              </View>

              <View style={{ justifyContent: "center" }}>
                <Skeleton
                  height={40}
                  width={40}
                  color={theme.colors.inverseOnSurface}
                />
              </View>
            </View>

            <Divider bold />
            <Divider bold />
            <Divider bold />

            <View style={{ padding: 10 }}>
              <Skeleton height={80} color={theme.colors.inverseOnSurface} />
            </View>

            <Divider bold />

            <Skeleton height={5} color={theme.colors.inverseOnSurface} />

            <Divider bold />

            <Skeleton height={30} color={theme.colors.inverseOnSurface} />

            <Divider bold />

            <Card style={{ margin: 10 }}>
              <Card.Content>
                <Skeleton
                  height={50}
                  count={10}
                  color={theme.colors.inverseOnSurface}
                />
              </Card.Content>
            </Card>

            <View
              style={{
                bottom: 0,
                position: "absolute",
                right: 0,
                left: 0,
                backgroundColor: theme.colors.outlineVariant,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <View style={{ justifyContent: "center" }}>
                  <Skeleton
                    height={40}
                    width={120}
                    color={theme.colors.inverseOnSurface}
                  />
                </View>

                <View style={{ justifyContent: "center" }}>
                  <Skeleton
                    height={40}
                    width={120}
                    color={theme.colors.inverseOnSurface}
                  />
                </View>

                <View style={{ justifyContent: "center" }}>
                  <Skeleton
                    height={40}
                    width={120}
                    color={theme.colors.inverseOnSurface}
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              height: Dimensions.get("window").height,
              backgroundColor: theme.colors.surface,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <Button
                  mode="contained"
                  onPress={() => submitTest("user")}
                  disabled={testPage !== 1}
                >
                  SUBMIT TEST
                </Button>
              </View>
              <View style={{ justifyContent: "center" }}>
                <IconButton
                  icon="apps"
                  onPress={() => setModelVisible(true)}
                  disabled={testPage !== 1}
                />
              </View>
            </View>

            <Divider bold />
            <Divider bold />
            <Divider bold />

            <Card mode="elevated" style={{ margin: 5 }}>
              <Card.Title
                title={mockTest.name}
                subtitle={mockTest.description}
              />
            </Card>

            <Divider bold />

            <ProgressBar
              animatedValue={totalSeconds / attempt.duration_in_seconds}
              color={getProgressColor(
                totalSeconds / attempt.duration_in_seconds
              )}
              style={{ height: 5 }}
            />

            <Divider bold />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <Text>
                  Duration -{" "}
                  {String(
                    Math.floor(
                      Math.floor(attempt.duration_in_seconds / 60) / 60
                    ) % 60
                  ).padStart(2, "0")}
                  :
                  {String(
                    Math.floor(
                      Math.floor(attempt.duration_in_seconds / 60) % 60
                    )
                  ).padStart(2, "0")}
                  :
                  {String(
                    Math.floor(attempt.duration_in_seconds % 60)
                  ).padStart(2, "0")}
                </Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Text>
                  Time Left - {String(hours).padStart(2, "0")}:
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </Text>
              </View>
            </View>

            <Divider bold />
            <Divider bold />

            <ScrollView style={{ marginBottom: 70 }}>
              {testPage === 0 && <InstructionPage />}

              {testPage === 1 && (
                <DisplayQuestion
                  key={mockTest?.questions[currQuestionIndex].$id}
                  sn={currQuestionIndex + 1}
                  question={
                    mockTest?.questions[currQuestionIndex]?.contentQuestion
                  }
                  optionA={
                    mockTest?.questions[currQuestionIndex]?.contentOptionA
                  }
                  optionB={
                    mockTest?.questions[currQuestionIndex]?.contentOptionB
                  }
                  optionC={
                    mockTest?.questions[currQuestionIndex]?.contentOptionC
                  }
                  optionD={
                    mockTest?.questions[currQuestionIndex]?.contentOptionD
                  }
                  optionMarked={attempt?.answers[currQuestionIndex]}
                  status={attempt?.questionStatus[currQuestionIndex]}
                  changeOption={changeOptionCurr}
                />
              )}

              {testPage === 2 && (
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 200,
                  }}
                >
                  <Avatar.Icon
                    size={200}
                    icon="progress-upload"
                    color={theme.colors.onInfo}
                    style={{ backgroundColor: theme.colors.info }}
                  />

                  <Text variant="labelLarge" style={{ marginTop: 15 }}>
                    PLEASE WAIT!! WE ARE SUBMITTING YOUR TEST
                  </Text>
                </View>
              )}

              {testPage === 3 && (
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 200,
                  }}
                >
                  <Avatar.Icon
                    size={200}
                    icon="text-box-check"
                    color={theme.colors.onSuccess}
                    style={{ backgroundColor: theme.colors.success }}
                  />

                  <Text variant="labelLarge" style={{ marginTop: 15 }}>
                    YOUR ANSWERS HAVE BEEN SUCCESSFULLY SUBMITTED.
                  </Text>
                  <Text variant="labelLarge" style={{ marginTop: 15 }}>
                    REDIRECTING YOU TO THE RESULT PAGE IN 5 seconds...
                  </Text>
                </View>
              )}
            </ScrollView>

            <View
              style={{
                bottom: 0,
                position: "absolute",
                right: 0,
                left: 0,
                backgroundColor: theme.colors.outlineVariant,
              }}
            >
              <Divider bold />
              {testPage === 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    padding: 10,
                  }}
                >
                  <View style={{ justifyContent: "center" }}>
                    <Button
                      icon="clock-start"
                      mode="contained-tonal"
                      onPress={startTest}
                    >
                      {attempt.status === "in_progress"
                        ? "RESUME TEST"
                        : "START TEST"}
                    </Button>
                  </View>
                </View>
              )}

              {testPage === 1 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                  }}
                >
                  <View style={{ justifyContent: "center" }}>
                    <Button
                      icon="chevron-left"
                      mode="elevated"
                      disabled={currQuestionIndex === 0}
                      onPress={previousQuestion}
                    >
                      PREVIOUS
                    </Button>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <Button
                      icon="map-marker-right"
                      mode="outlined"
                      onPress={() => nextQuestion("mark")}
                      disabled={
                        currQuestionIndex === mockTest?.questions?.length - 1
                      }
                    >
                      MARK & NEXT
                    </Button>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <Button
                      icon="chevron-right"
                      mode="contained-tonal"
                      onPress={() => nextQuestion("save")}
                      disabled={
                        currQuestionIndex === mockTest?.questions?.length - 1
                      }
                    >
                      NEXT
                    </Button>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>

      <Portal>
        <Modal
          visible={modelVisible}
          onDismiss={() => setModelVisible(false)}
          contentContainerStyle={{
            padding: 10,
            margin: 10,
          }}
          dismissable={false}
          dismissableBackButton
        >
          <Card>
            <Card.Title
              title="All Questions"
              subtitle="Navigate to the question by clicking on the question number"
              subtitleNumberOfLines={4}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  onPress={() => setModelVisible(false)}
                />
              )}
            />

            <Card.Content>
              {Array.from(
                { length: Math.ceil(attempt?.questionStatus?.length / 4) },
                (v, i) => attempt?.questionStatus?.slice(i * 4, i * 4 + 4)
              ).map((arrChunk, index) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    margin: 10,
                  }}
                  key={index}
                >
                  {arrChunk.map((currQuestionStatus, index2) => (
                    <Button
                      mode="contained"
                      style={{ width: 10 }}
                      key={index + "_" + index2}
                      buttonColor={
                        currQuestionStatus === "answered"
                          ? theme.colors.success
                          : currQuestionStatus === "marked"
                          ? theme.colors.warning
                          : theme.colors.info
                      }
                      textColor={
                        currQuestionStatus === "answered"
                          ? theme.colors.onSuccess
                          : currQuestionStatus === "marked"
                          ? theme.colors.onWarning
                          : theme.colors.onInfo
                      }
                      onPress={() => {
                        setCurrQuestionIndex(index * 4 + index2);
                        setModelVisible(false);
                      }}
                    >
                      {index * 4 + (index2 + 1)}
                    </Button>
                  ))}
                </View>
              ))}
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      <Portal>
        <Dialog
          visible={backDialogVisible}
          onDismiss={() => setBackDialogVisible(false)}
        >
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            {backInitiatedBy === "system" ? (
              <Text variant="bodyMedium">
                You are leaving this page. Please Click SURE to procceed
              </Text>
            ) : (
              <>
                <Text variant="bodyMedium">
                  Are you trying to finish the test, if yes, please click on the
                  SUBMIT button.
                </Text>
                <Text variant="bodyMedium">
                  If you want to go back due to some emergency, please click
                  SURE else click DISMISS. We will save all the states of your
                  test, you can come back anytime and appear the test.
                </Text>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setBackDialogVisible(false);
                navigation.dispatch(backAction);
              }}
            >
              SURE
            </Button>
            <Button onPress={() => setBackDialogVisible(false)}>DISMISS</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Fragment>
  );
}
