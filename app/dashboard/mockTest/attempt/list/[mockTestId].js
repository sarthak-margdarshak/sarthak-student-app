import { Stack, router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  ToastAndroid,
  View,
} from "react-native";
import {
  Button,
  Dialog,
  Divider,
  List,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { Skeleton } from "react-native-skeletons";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import {
  appwriteDatabases,
  timeAgo,
} from "../../../../../auth/AppwriteContext";
import { APPWRITE_API } from "../../../../../config-global";
import { ID, Query } from "appwrite";
import { useAuthContext } from "../../../../../auth/useAuthContext";

export default function MockTestAttemptsList() {
  const { mockTestId } = useLocalSearchParams();
  const theme = useTheme();
  const { studentProfile } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [mockTest, setMockTest] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [creatingAttempt, setCreatingAttempt] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const y = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        mockTestId,
        [Query.select(["name", "questions", "duration"])]
      );
      setMockTest(y);

      const x = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.attempts,
        [
          Query.equal("mockTestId", mockTestId),
          Query.equal("studentId", studentProfile.$id),
          Query.orderDesc("$createdAt"),
          Query.select([
            "status",
            "time_remaining_in_seconds",
            "duration_in_seconds",
          ]),
          Query.limit(100),
        ]
      );
      setAttempts(x.documents);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [mockTestId]);

  const createAnAttempt = async (real) => {
    setCreatingAttempt(true);
    try {
      var arr;
      var tmpMockTestId;
      var duration = 0;
      if (real) {
        arr = new Array(mockTest?.questions?.length);
        tmpMockTestId = mockTestId;
        duration = mockTest.duration * 60;
      } else {
        arr = new Array(11);
        tmpMockTestId = APPWRITE_API.documents.dummyTest;
        duration = 600;
      }

      const x = await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.attempts,
        ID.unique(),
        {
          mockTestId: tmpMockTestId,
          studentId: studentProfile.$id,
          answers: arr,
          questionStatus: arr,
          evaluated_answers: arr,
          status: "created",
          duration_in_seconds: duration,
          time_remaining_in_seconds: duration,
        }
      );

      router.push(
        PATH_DASHBOARD.mockTest.appear(x.$id) +
          "?duration=" +
          x.time_remaining_in_seconds
      );
    } catch (error) {}
    setCreatingAttempt(false);
    setVisible(false);
  };

  const navigateNext = (id, status, duration) => {
    if (status === "complete") {
      router.push(PATH_DASHBOARD.mockTest.attempReport(id));
    } else {
      router.push(PATH_DASHBOARD.mockTest.appear(id) + "?duration=" + duration);
    }
  };

  return (
    <Fragment>
      <Stack.Screen
        options={{
          title: loading ? "Mock Test Name" : mockTest?.name,
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
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
      >
        {loading ? (
          <Skeleton
            count={10}
            height={50}
            color={theme.colors.inverseOnSurface}
          />
        ) : (
          <View>
            <Button
              mode="elevated"
              onPress={() => setVisible(true)}
              loading={creatingAttempt}
              disabled={
                attempts.findIndex(
                  (attempt) => attempt.status !== "complete"
                ) !== -1
              }
            >
              Appear the mock test
            </Button>

            <Divider bold style={{ marginTop: 15 }} />

            <List.Section title="All Attempts till now">
              {attempts?.map((attempt, index) => (
                <View key={attempt.$id}>
                  <List.Item
                    title={"Attempt - " + (attempts.length - index)}
                    description={
                      timeAgo.format(new Date(attempt.$updatedAt)) +
                      "  |  " +
                      attempt.status +
                      "  |  " +
                      (attempt.status !== "complete"
                        ? "Click to complete"
                        : "Report")
                    }
                    onPress={() =>
                      navigateNext(
                        attempt.$id,
                        attempt.status,
                        attempt.time_remaining_in_seconds
                      )
                    }
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={
                          attempt.status === "complete"
                            ? "check-circle-outline"
                            : "progress-clock"
                        }
                      />
                    )}
                    right={(props) => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                  />
                  <Divider />
                </View>
              ))}
            </List.Section>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Caution</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Before you proceed to attempt the actual test. You can try a dummy
              test to get a experience
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => createAnAttempt(false)}>
              Try a Dummy Test
            </Button>
            <Button onPress={() => createAnAttempt(true)} mode="contained">
              Attempt the test
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Fragment>
  );
}
