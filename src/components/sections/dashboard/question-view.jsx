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
import { Loader2, Lightbulb, Check, X } from "lucide-react";
import { useAppContent } from "@/hook/app/useAppContent";

export default function QuestionView({
  questionId,
  userAnswer,
  questionIndex,
  lang,
}) {
  const { getQuestion } = useAppContent();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealLoading, setRevealLoading] = useState(false);

  // Load question from local storage on mount
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const storedQuestion = await getQuestion(questionId);
        setQuestion(storedQuestion);
        setLoading(false);
      } catch (error) {
        console.error("Error loading question:", error);
      }
    };
    loadQuestion();
  }, [questionId]);

  const revealAnswer = async () => {
    if (answer) return;

    try {
      setRevealLoading(true);
      const questionWithAnswer = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId
      );

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
    const userAnswerIndex = userAnswer.charCodeAt(0) - 65;
    return answer.answerOptions[userAnswerIndex] ? "correct" : "incorrect";
  };

  const answerStatus = getAnswerStatus();

  const getStatusColor = () => {
    switch (answerStatus) {
      case "correct":
        return "bg-green-500";
      case "incorrect":
        return "bg-red-500";
      case "skipped":
        return "bg-yellow-500";
      default:
        return "bg-gray-200";
    }
  };

  const getOptionStyle = (option, index) => {
    const optionLetter = String.fromCharCode(65 + index);
    const isUserAnswer = optionLetter === userAnswer;

    // Default Style
    let style = "relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-default";

    // Pre-reveal state
    if (!answer) {
      if (isUserAnswer) return `${style} border-blue-500 bg-blue-50/50`;
      return `${style} border-transparent bg-gray-50 hover:bg-gray-100`;
    }

    // Post-reveal state
    const isCorrectAnswer = answer.answerOptions[index];

    if (isCorrectAnswer) {
      return `${style} border-green-500 bg-green-50/50 shadow-sm`;
    }
    if (isUserAnswer && !isCorrectAnswer) {
      return `${style} border-red-500 bg-red-50/50`;
    }

    return `${style} border-transparent bg-gray-50 opacity-60`;
  };

  if (loading || !question) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2 animate-pulse">
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-md bg-white ring-1 ring-gray-200/50 mb-6">
      {/* Status Strip */}
      {answerStatus && (
        <div className={`h-1.5 w-full ${getStatusColor()}`} />
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm">
              {questionIndex}
            </span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Question
            </span>
          </div>

          {answerStatus && (
            <Badge
              variant={
                answerStatus === "correct"
                  ? "success"
                  : answerStatus === "incorrect"
                    ? "destructive"
                    : "outline"
              }
              className="capitalize px-3 py-1 text-xs font-semibold shadow-sm"
            >
              {answerStatus === "correct" && <Check className="w-3 h-3 mr-1" />}
              {answerStatus === "incorrect" && <X className="w-3 h-3 mr-1" />}
              {answerStatus}
            </Badge>
          )}
        </div>

        {/* Question Content */}
        <div className="prose prose-slate max-w-none mb-8">
          <div className="text-lg font-medium text-slate-900 leading-relaxed">
            <ReactKatex>
              {question[lang]?.contentQuestion || question.contentQuestion}
            </ReactKatex>
          </div>
          {question.coverQuestion && (
            <div className="mt-4 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src={question.coverQuestion}
                alt="Question illustration"
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid gap-3 mb-8">
          {(question[lang]?.contentOptions || question.contentOptions).map(
            (option, index) => (
              <div
                key={index}
                className={getOptionStyle(option, index)}
              >
                <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold transition-colors
                  ${!answer && String.fromCharCode(65 + index) === userAnswer ? "border-blue-500 text-blue-600 bg-white" : "border-slate-200 text-slate-500 bg-white"}
                  ${answer && answer.answerOptions[index] ? "border-green-500 text-green-600 bg-white" : "border-slate-200 text-slate-500 bg-white"}
                  ${answer && String.fromCharCode(65 + index) === userAnswer && !answer.answerOptions[index] ? "border-red-500 text-red-600 bg-white" : ""}
                `}>
                  {String.fromCharCode(65 + index)}
                </div>

                <div className="flex-grow pt-1 text-slate-700">
                  <ReactKatex>{option}</ReactKatex>
                  {question.coverOptions?.[index] && (
                    <img
                      src={question.coverOptions[index]}
                      alt={`Option ${String.fromCharCode(65 + index)} illustration`}
                      className="mt-3 rounded-md max-w-full h-auto max-h-[200px] border border-slate-100"
                    />
                  )}
                </div>

                {/* Status Indicator Icon */}
                {answer && (
                  <div className="flex-shrink-0 ml-2">
                    {answer.answerOptions[index] && (
                      <div className="bg-green-100 p-1 rounded-full">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                    {String.fromCharCode(65 + index) === userAnswer && !answer.answerOptions[index] && (
                      <div className="bg-red-100 p-1 rounded-full">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Solution Section */}
        {answer && (answer.contentAnswer || answer.coverAnswer) && (
          <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50/30 p-5 mt-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>
            <div className="flex items-center gap-2 mb-3 text-blue-700 font-semibold">
              <Lightbulb className="w-5 h-5 fill-blue-500/20" />
              <span>Explanation</span>
            </div>

            {answer.contentAnswer && (
              <div className="prose prose-sm prose-blue max-w-none text-slate-700 leading-relaxed">
                <ReactKatex>{answer.contentAnswer}</ReactKatex>
              </div>
            )}

            {answer.coverAnswer && (
              <div className="mt-4 rounded-lg overflow-hidden border border-blue-100 bg-white p-2">
                <img
                  src={answer.coverAnswer}
                  alt="Explanation illustration"
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
          </div>
        )}

        {/* Reveal Answer Button */}
        {!answer && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button
              onClick={revealAnswer}
              disabled={revealLoading}
              size="lg"
              className="min-w-[200px] bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-semibold rounded-full shadow-sm"
            >
              {revealLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Solution...
                </>
              ) : (
                "Reveal Answer"
              )}
            </Button>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              CLICK TO SEE DETAILED EXPLANATION
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
