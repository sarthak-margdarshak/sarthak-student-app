"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { appwriteDatabases } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { toast } from "sonner";
import { PieChart } from "@/components/ui/pie-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, HelpCircle, Clock, Award } from "lucide-react";

export default function TestReport({ attemptObj }) {
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(attemptObj);
  const [mockTest, setMockTest] = useState(null);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        // Prepare pie chart data
        setPieData([
          {
            name: "Correct",
            value: attemptData.correct_questions,
            color: "bg-green-500",
          },
          {
            name: "Incorrect",
            value: attemptData.incorrect_questions,
            color: "bg-red-500",
          },
          {
            name: "Skipped",
            value: attemptData.skipped_questions,
            color: "bg-yellow-500",
          },
        ]);
      } catch (error) {
        toast.error("Error loading report: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptData();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Progress value={undefined} />
        <p className="text-sm text-gray-500">Loading test report...</p>
      </div>
    );
  }

  const percentageScore =
    (attempt.correct_questions / attempt.total_marks) * 100;
  const timeSpent =
    attempt.duration_in_seconds - attempt.time_remaining_in_seconds;
  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="container max-w-4xl py-6 space-y-6">
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
                {attempt.correct_questions} / {attempt.total_marks}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={percentageScore >= 40 ? "success" : "destructive"}>
              {percentageScore.toFixed(1)}%
            </Badge>
            <span className="text-sm text-gray-500">
              {percentageScore >= 40 ? "Passed" : "Failed"}
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

      {/* Detailed Analysis */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Question-wise Analysis</h2>
        <ScrollArea className="h-[400px] rounded-md border">
          <Table>
            <TableCaption>A detailed analysis of your answers</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Q.No</TableHead>
                <TableHead>Your Answer</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTest?.questions.map((question, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {attempt.answers[index] ? attempt.answers[index] : "-"}
                  </TableCell>
                  <TableCell>{question.answerOption}</TableCell>
                  <TableCell>
                    {!attempt.answers[index] ? (
                      <Badge variant="outline">Skipped</Badge>
                    ) : attempt.answers[index] === question.answerOption ? (
                      <Badge variant="success">Correct</Badge>
                    ) : (
                      <Badge variant="destructive">Incorrect</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
