import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
  Appbar,
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
import { Toast } from "react-native-toast-notifications";
import { NoEventLight } from "../../../../../components/SVG/NoEventLight";

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
        [Query.select(["name", "questions", "duration", "$id"])]
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
            "$id",
            "$updatedAt",
          ]),
          Query.limit(100),
        ]
      );
      setAttempts(x.documents);
    } catch (error) {
      Toast.show(error.message, {
        type: "danger",
        textStyle: { fontFamily: "Laila-Regular" },
      });
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
        const c = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTest,
          APPWRITE_API.documents.dummyTest
        );
        arr = new Array(c?.questions?.length);
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
          title={mockTest?.name}
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
              labelStyle={{ fontFamily: "Laila-Regular" }}
              style={{
                marginLeft: 50,
                marginRight: 50,
                marginTop: 10,
                borderRadius: 10,
              }}
            >
              Appear the mock test
            </Button>

            <Divider bold style={{ marginTop: 15 }} />

            {attempts.length === 0 ? (
              <View
                style={{
                  height: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NoEventLight />

                <Text
                  variant="bodyLarge"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 50,
                    fontFamily: "Laila-Regular",
                  }}
                >
                  No Attempt
                </Text>

                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 10,
                    fontFamily: "Laila-Regular",
                  }}
                >
                  You have not made any attempts till now.
                </Text>
              </View>
            ) : (
              <List.Section
                title="All Attempts till now"
                style={{ fontFamily: "Laila-Regular" }}
              >
                {attempts?.map((attempt, index) => (
                  <View key={attempt.$id}>
                    <List.Item
                      title={"Attempt - " + (attempts.length - index)}
                      titleStyle={{ fontFamily: "Laila-Regular" }}
                      description={
                        timeAgo.format(new Date(attempt.$updatedAt)) +
                        "  |  " +
                        attempt.status +
                        "  |  " +
                        (attempt.status !== "complete"
                          ? "Click to complete"
                          : "Report")
                      }
                      descriptionStyle={{ fontFamily: "Laila-Regular" }}
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
            )}
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
