"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactKatex from "@pkasila/react-katex";
import {
  appwriteDatabases,
  appwriteStorage,
} from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react"; // Import loader icon

export default function QuestionView({
  questionId,
  userAnswer,
  questionIndex,
}) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealLoading, setRevealLoading] = useState(false);

  // Load question from local storage on mount
  useEffect(() => {
    const loadQuestion = () => {
      try {
        const storedQuestion = JSON.parse(
          localStorage.getItem(`question_${questionId}`)
        );
        setQuestion(storedQuestion);
        setLoading(false);
      } catch (error) {
        console.error("Error loading question:", error);
      }
    };
    loadQuestion();
  }, [questionId]);

  const revealAnswer = async () => {
    // If answer is already fetched, just return
    if (answer) return;

    try {
      setRevealLoading(true);
      // Fetch the answer from Appwrite
      const questionWithAnswer = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId
      );

      // Generate URL for coverAnswer if it exists
      const answerData = {
        answerOptions: questionWithAnswer.answerOptions,
        contentAnswer: questionWithAnswer.contentAnswer,
        coverAnswer: questionWithAnswer.coverAnswer
          ? appwriteStorage.getFileView(
              APPWRITE_API.buckets.sarthakDatalakeBucket,
              questionWithAnswer.coverAnswer
            )
          : null,
      };

      setAnswer(answerData);
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setRevealLoading(false);
    }
  };

  const getAnswerStatus = () => {
    if (!answer) return null;
    if (!userAnswer) return "skipped";

    // Convert user answer letter to index (A=0, B=1, etc)
    const userAnswerIndex = userAnswer.charCodeAt(0) - 65;

    // Check if user's answer matches the correct answer position
    return answer.answerOptions[userAnswerIndex] ? "correct" : "incorrect";
  };

  const getOptionStyle = (option, index) => {
    const baseStyle = "border-2 transition-colors";
    const optionLetter = String.fromCharCode(65 + index);
    const isUserAnswer = optionLetter === userAnswer;

    // Before answer reveal, just highlight user's selection
    if (!answer && isUserAnswer) {
      return `${baseStyle} border-blue-500 bg-blue-50`;
    }

    // After answer reveal, show correct/incorrect status
    if (answer) {
      const isCorrectAnswer = answer.answerOptions[index];

      if (isCorrectAnswer) {
        return `${baseStyle} border-green-500 bg-green-50`;
      }
      if (isUserAnswer && !isCorrectAnswer) {
        return `${baseStyle} border-red-500 bg-red-50`;
      }
    }

    return baseStyle;
  };

  if (loading || !question) {
    return <div>Loading...</div>;
  }

  return (
    <Card
      className={`p-3 ${
        getAnswerStatus() === "correct"
          ? "border-green-500"
          : getAnswerStatus() === "incorrect"
          ? "border-red-500"
          : getAnswerStatus() === "skipped"
          ? "border-yellow-500"
          : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium text-gray-600">
          Question {questionIndex}
        </div>
        {getAnswerStatus() && (
          <Badge
            variant={
              getAnswerStatus() === "correct"
                ? "success"
                : getAnswerStatus() === "incorrect"
                ? "destructive"
                : "outline"
            }
          >
            {getAnswerStatus() === "correct"
              ? "Correct"
              : getAnswerStatus() === "incorrect"
              ? "Incorrect"
              : "Skipped"}
          </Badge>
        )}
      </div>

      <div className="prose max-w-none">
        <ReactKatex>{question.contentQuestion}</ReactKatex>
        {question.coverQuestion && (
          <div>
            <img
              src={question.coverQuestion}
              alt="Question illustration"
              className="max-w-full rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {question.contentOptions.map((option, optionIndex) => (
          <Card
            key={optionIndex}
            className={`p-3 ${getOptionStyle(option, optionIndex)}`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <div className="font-medium">
                  {String.fromCharCode(65 + optionIndex)}.
                </div>
                <div className="flex-1">
                  <ReactKatex>{option}</ReactKatex>
                  {question.coverOptions?.[optionIndex] && (
                    <div className="mt-2">
                      <img
                        src={question.coverOptions[optionIndex]}
                        alt={`Option ${String.fromCharCode(
                          65 + optionIndex
                        )} illustration`}
                        className="max-w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              {answer && (
                <div className="text-xs ml-7">
                  {answer.answerOptions[optionIndex] && (
                    <span className="text-green-600">Correct Answer</span>
                  )}
                  {String.fromCharCode(65 + optionIndex) === userAnswer && (
                    <span
                      className={`${
                        answer.answerOptions[optionIndex]
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {answer.answerOptions[optionIndex] ? " • " : ""}Your
                      Answer
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {answer && (answer.contentAnswer || answer.coverAnswer) && (
        <div className="mt-6 p-4 border-2 border-blue-500 rounded-lg">
          <h3 className="font-medium mb-3">Solution Explanation:</h3>
          {answer.contentAnswer && (
            <div className="prose max-w-none mb-4">
              <ReactKatex>{answer.contentAnswer}</ReactKatex>
            </div>
          )}
          {answer.coverAnswer && (
            <div className="mt-2">
              <img
                src={answer.coverAnswer}
                alt="Answer explanation"
                className="max-w-full rounded-lg"
              />
            </div>
          )}
        </div>
      )}

      {!answer && (
        <>
          <Button
            onClick={revealAnswer}
            className="w-full"
            variant="outline"
            disabled={revealLoading}
          >
            {revealLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Revealing Answer...
              </>
            ) : (
              "Reveal Answer"
            )}
          </Button>
          <p className="text-sm text-gray-500 text-center">
            Try solving once again before revealing the answer
          </p>
        </>
      )}
    </Card>
  );
}
