"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { appwriteDatabases, getUserName } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API, TEST_STATUS } from "@/config-global";
import { toast } from "sonner";
import { PieChart } from "@/components/ui/pie-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuestionView from "./question-view";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContent } from "@/hook/app/useAppContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Query } from "appwrite";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function TestReport({ attempt }) {
  const [loading, setLoading] = useState(true);
  const [mockTest, setMockTest] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userNames, setUserNames] = useState({});
  const { setCurrentPageName } = useAppContent();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        // Prepare pie chart data
        setPieData([
          {
            name: "Correct",
            value: attempt.correct_questions,
            color: "bg-green-500",
          },
          {
            name: "Incorrect",
            value: attempt.incorrect_questions,
            color: "bg-red-500",
          },
          {
            name: "Skipped",
            value: attempt.skipped_questions,
            color: "bg-yellow-500",
          },
        ]);

        const x = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTest,
          attempt.mockTestId
        );
        setMockTest(x);
        setCurrentPageName(`${x?.name} - Test Report`);

        // Fetch all attempts for this mock test
        const attempts = (
          await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.mockTestAttempts,
            [
              Query.equal("mockTestId", attempt.mockTestId),
              Query.equal("status", TEST_STATUS.COMPLETED),
              Query.orderDesc("percentage_marks"),
              Query.select([
                "studentId",
                "percentage_marks",
                "obtained_marks",
                "total_marks",
              ]),
              Query.limit(100),
            ]
          )
        ).documents;

        // Process attempts to keep only the first/best attempt per student
        const uniqueAttempts = attempts.reduce((acc, current) => {
          if (!acc.some((attempt) => attempt.studentId === current.studentId)) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Find user's rank in unique attempts
        const rank =
          uniqueAttempts.findIndex((a) => a.studentId === user.$id) + 1;
        setUserRank(rank);

        // Store unique rankings data
        setRankings(uniqueAttempts);

        // Fetch user names for all unique attempts
        const names = {};
        await Promise.all(
          uniqueAttempts.map(async (attempt) => {
            const name = await getUserName(attempt.studentId);
            names[attempt.studentId] = name;
          })
        );
        setUserNames(names);
      } catch (error) {
        toast.error("Error loading report: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptData();
  }, [attempt, setCurrentPageName]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Header Skeleton */}
          <div className="w-full max-w-3xl space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Main Content Card */}
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Section Skeletons */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <div className="pl-4 space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-3 w-2/3" />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Loading Indicator */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></div>
              <div className="relative flex h-full items-center justify-center rounded-full bg-red-500">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600">
                Loading Test Data
              </h3>
              <p className="text-sm text-gray-500">
                Please wait while we prepare your test report/environment...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeSpent =
    attempt.duration_in_seconds - attempt.time_remaining_in_seconds;
  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="container max-w-4xl py-6 space-y-6 mt-20">
      {/* Floating Ranking Button */}
      <ShimmerButton
        onClick={() => setIsRankingOpen(true)}
        className="fixed top-24 right-4 z-50 gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg"
        shimmerColor="#ffffff"
        shimmerDuration="2s"
        shimmerSize="0.1em"
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span>Rank #{userRank}</span>
        </div>
      </ShimmerButton>

      {/* Rankings Dialog */}
      <Dialog open={isRankingOpen} onOpenChange={setIsRankingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Rankings</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((rank, index) => (
                  <TableRow
                    key={index}
                    className={
                      rank.$id === attempt.$id ? "bg-muted" : undefined
                    }
                  >
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      {userNames[rank.studentId] || rank.studentId}
                    </TableCell>
                    <TableCell className="text-right">
                      {rank.percentage_marks}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Test Overview */}
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-2">{mockTest?.name}</h1>
        <p className="text-gray-600 mb-6">{mockTest?.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Time Spent</div>
              <div className="font-medium">
                {hours > 0 ? `${hours}h ` : ""}
                {minutes}m {seconds}s
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Score</div>
              <div className="font-medium">
                {attempt.obtained_marks} / {attempt.total_marks}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                attempt.percentage_marks >= 40 ? "success" : "destructive"
              }
            >
              {attempt.percentage_marks}%
            </Badge>
            <span className="text-sm text-gray-500">
              {attempt.percentage_marks >= 40 ? "Passed" : "Failed"}
            </span>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Stats */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Question Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Correct Answers</span>
              </div>
              <span className="font-medium">{attempt.correct_questions}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Incorrect Answers</span>
              </div>
              <span className="font-medium">{attempt.incorrect_questions}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-yellow-500" />
                <span>Skipped Questions</span>
              </div>
              <span className="font-medium">{attempt.skipped_questions}</span>
            </div>
          </div>
        </Card>

        {/* Performance Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
          <div className="w-full aspect-square">
            <PieChart data={pieData} />
          </div>
        </Card>
      </div>

      {/* Questions */}
      <Card className="p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold underline">Questions Review</h2>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              All
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter("correct")}
              size="sm"
              className={`w-full sm:w-auto text-xs sm:text-sm ${
                filter === "correct"
                  ? "bg-green-500 text-white hover:bg-green-600 border-green-500"
                  : "text-green-500 border-green-500 hover:bg-green-50"
              }`}
            >
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Correct</span>
              <span className="sm:hidden">Right</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter("incorrect")}
              size="sm"
              className={`w-full sm:w-auto text-xs sm:text-sm ${
                filter === "incorrect"
                  ? "bg-red-500 text-white hover:bg-red-600 border-red-500"
                  : "text-red-500 border-red-500 hover:bg-red-50"
              }`}
            >
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Incorrect</span>
              <span className="sm:hidden">Wrong</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilter("skipped")}
              size="sm"
              className={`w-full sm:w-auto text-xs sm:text-sm ${
                filter === "skipped"
                  ? "bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500"
                  : "text-yellow-500 border-yellow-500 hover:bg-yellow-50"
              }`}
            >
              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Skipped</span>
              <span className="sm:hidden">Skip</span>
            </Button>
          </div>
        </div>
        <ScrollArea className="h-full">
          <div className="space-y-8">
            {(() => {
              const filteredQuestions = mockTest.questions.filter(
                (questionId, index) => {
                  const status = attempt.evaluated_questions_status[index];
                  return filter === "all" || filter === status;
                }
              );

              if (filteredQuestions.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {filter === "all"
                        ? "No questions available"
                        : `No ${filter} questions in this section`}
                    </p>
                  </div>
                );
              }

              return filteredQuestions.map((questionId, index) => {
                const originalIndex = mockTest.questions.indexOf(questionId);
                return (
                  <div key={questionId}>
                    <QuestionView
                      questionId={questionId}
                      userAnswer={attempt.marked_answers[originalIndex]}
                      questionIndex={originalIndex + 1}
                    />
                  </div>
                );
              });
            })()}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
