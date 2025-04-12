"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  appwriteDatabases,
  downloadMockTest,
} from "@/hook/auth/AppwriteContext";
import { APPWRITE_API, TEST_STATUS } from "@/config-global";
import { ID, Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { useAppContent } from "@/hook/app/useAppContent";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudIcon } from "lucide-react";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MockTestPage() {
  const router = useRouter();
  const { setCurrentPageName } = useAppContent();
  const { user } = useAuthContext();
  const [mockTestId, setMockTestId] = useState(
    window.location.pathname.split("/")[3]
  );

  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [mockTest, setMockTest] = useState(null);
  const [inProgressAttempt, setInProgressAttempt] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreatingAttempt, setIsCreatingAttempt] = useState(false);

  useEffect(() => {
    // Fetch mock test details and attempts
    const fetchMockTestAndAttempts = async () => {
      const id = window.location.pathname.split("/")[3];
      setMockTestId(id);
      try {
        setLoading(true);
        await downloadMockTest(id);
        const mockTestData = JSON.parse(
          localStorage.getItem(`mock_test_${id}`)
        );
        setMockTest(mockTestData);
        setCurrentPageName(`${mockTestData.name}`);

        const attemptsData = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTestAttempts,
          [
            Query.equal("studentId", user.$id),
            Query.equal("mockTestId", id),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ]
        );

        // Find any in-progress or created attempt
        const inProgress = attemptsData.documents.find(
          (attempt) =>
            attempt.status === TEST_STATUS.IN_PROGRESS ||
            attempt.status === TEST_STATUS.CREATED
        );
        setInProgressAttempt(inProgress);
        setAttempts(attemptsData.documents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMockTestAndAttempts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId, user]);

  // Create new attempt
  const createNewAttempt = async () => {
    try {
      setIsCreatingAttempt(true);
      // Initialize arrays with correct length based on questions from either source
      const questionsCount = mockTest.questions?.length || 0;
      const emptyAnswers = new Array(questionsCount).fill("");

      const attempt = await appwriteDatabases.createDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTestAttempts,
        ID.unique(),
        {
          mockTestId: mockTestId,
          studentId: user.$id,
          status: TEST_STATUS.CREATED,
          marked_answers: emptyAnswers,
          duration_in_seconds: mockTest.duration * 60,
          time_remaining_in_seconds: mockTest.duration * 60,
          total_marks: questionsCount || 0,
        }
      );
      setIsCreatingAttempt(false);

      router.push(PATH_DASHBOARD.attempt(attempt.$id));
    } catch (error) {
      console.error("Error creating attempt:", error);
    }
  };

  // Handle resume/start attempt
  const handleAttempt = () => {
    if (inProgressAttempt) {
      router.push(PATH_DASHBOARD.attempt(inProgressAttempt.$id));
    } else {
      setDialogOpen(true);
    }
  };

  const startTest = (isDummy) => {
    if (isDummy) {
      // Handle dummy test start
      router.push(PATH_DASHBOARD.attempt("dummy"));
    } else {
      // Handle real test start
      createNewAttempt();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-36" />
        <Skeleton className="h-[200px]" />
        <div className="grid gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 space-y-6">
      {/* Top section with test details */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{mockTest?.name}</h1>
            <Button onClick={handleAttempt} size="lg" className="px-8">
              {inProgressAttempt ? "Resume Test" : "Start Test"}
            </Button>
          </div>

          <p className="text-gray-600 w-full">{mockTest?.description}</p>

          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-2">
              <CloudIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm">
                Duration: {Math.floor(mockTest?.duration || 0)} minutes
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Badge variant="secondary" className="text-sm">
              {mockTest?.questions?.length} Marks
            </Badge>
            {mockTest?.level && (
              <Badge
                variant="outline"
                className={`text-sm ${
                  mockTest.level.toLowerCase() === "easy"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : mockTest.level.toLowerCase() === "medium"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                Level: {mockTest?.level}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Choose Test Mode</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to attempt this test or try a practice (dummy) test
              first?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreatingAttempt}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => startTest(true)}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isCreatingAttempt}
            >
              Practice Test
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => startTest(false)}
              className="bg-green-500 hover:bg-green-600"
              disabled={isCreatingAttempt}
            >
              {isCreatingAttempt ? "Creating..." : "Actual Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Attempts list */}
      <div className="grid gap-4">
        {attempts.map((attempt, index) => (
          <Card
            key={attempt.$id}
            className="p-4 hover:border-blue-200 cursor-pointer transition-all"
            onClick={() => router.push(PATH_DASHBOARD.attempt(attempt.$id))}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600">
                    Attempt #{attempts.length - index}
                  </span>
                </div>
                <h3 className="font-medium">
                  {new Date(attempt.$createdAt).toLocaleDateString()}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(attempt.$createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  attempt.status === TEST_STATUS.COMPLETED
                    ? "bg-green-100 text-green-800"
                    : attempt.status === TEST_STATUS.IN_PROGRESS
                    ? "bg-amber-100 text-amber-800"
                    : attempt.status === TEST_STATUS.EXPIRED
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {attempt.status.charAt(0).toUpperCase() +
                  attempt.status.slice(1).replace("_", " ")}
              </div>
            </div>

            {attempt.status === TEST_STATUS.COMPLETED && (
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <div className="flex-1">
                    <Progress
                      value={
                        (attempt.obtained_marks / attempt.total_marks) * 100
                      }
                    />
                  </div>
                  <div className="text-sm font-medium">
                    {attempt.obtained_marks}/{attempt.total_marks}
                  </div>
                </div>
                {attempt.test_ended && (
                  <p className="text-xs text-gray-500 mt-2">
                    Ended: {new Date(attempt.test_ended).toLocaleString()}
                    {attempt.test_ended_by && ` (${attempt.test_ended_by})`}
                  </p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Progress chart */}
      {attempts.filter((a) => a.status === TEST_STATUS.COMPLETED).length >
        0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...attempts]
                  .filter((attempt) => attempt.status === TEST_STATUS.COMPLETED)
                  .reverse()
                  .map((attempt) => ({
                    attempt: new Date(
                      attempt.test_started
                    ).toLocaleDateString(),
                    marks: (attempt.obtained_marks / attempt.total_marks) * 100,
                  }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attempt" />
                <YAxis unit="%" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="marks"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
