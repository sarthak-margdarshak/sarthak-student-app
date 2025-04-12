"use client";

import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselQuestionNext,
  CarouselQuestionPrevious,
  CarouselQuestionTo,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { appwriteDatabases } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API, TEST_STATUS } from "@/config-global";
import { toast } from "sonner";
import Instructions from "./instructions";
import { useAppContent } from "@/hook/app/useAppContent";
import { LayoutGrid } from "lucide-react";
import ReactKatex from "@pkasila/react-katex";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestAttempt({ attemptObj }) {
  const { setCurrentPageName } = useAppContent();
  const [attempt, setAttempt] = useState(attemptObj);
  const [mockTest, setMockTest] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testPage, setTestPage] = useState(0); // 0: instructions, 1: test, 2: submitting, 3: submitted
  const [questionGridOpen, setQuestionGridOpen] = useState(false);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);

  // Initialize timer
  const time = new Date();
  time.setSeconds(
    time.getSeconds() + parseInt(attemptObj.time_remaining_in_seconds)
  );
  const { totalSeconds, seconds, minutes, hours, start, pause } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => submitTest("system"),
  });

  // Fetch test and attempt data
  useEffect(() => {
    const fetchTestData = async () => {
      setCurrentPageName("attempPage");
      setLoading(true);
      try {
        const x = JSON.parse(
          localStorage.getItem(`mock_test_${attemptObj.mockTestId}`)
        );
        setMockTest(x);
        const loadedQuestions = [];
        for (let questionId of x.questions) {
          loadedQuestions.push(
            JSON.parse(localStorage.getItem(`question_${questionId}`))
          );
        }
        setQuestions(loadedQuestions);
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    };

    fetchTestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTestAttempts,
        attempt.$id,
        {
          marked_answers: attempt?.marked_answers,
          time_remaining_in_seconds: totalSeconds,
          status: "in_progress",
        }
      );
      console.log("Progress saved successfully");
    };
    if (totalSeconds !== 0) {
      saveProgress();
    } else {
      submitTest("system");
    }
  }, [attempt?.marked_answers, totalSeconds]);

  const startTest = async () => {
    setTestPage(1);
    // Update attempt status if starting fresh
    if (attempt.duration_in_seconds === attempt.time_remaining_in_seconds) {
      appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTestAttempts,
        attempt.$id,
        { status: "in_progress" }
      );
    }
    start();
  };

  const submitTest = async (actionBy) => {
    try {
      pause();
      // Update attempt with results
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTestAttempts,
        attempt?.$id,
        {
          marked_answers: attempt?.marked_answers,
          time_remaining_in_seconds: totalSeconds,
          status: TEST_STATUS.IN_EVALUATION,
          test_ended_by: actionBy,
          test_ended: new Date(),
        }
      );

      // TODO: Call function to evaluate test and update results

      toast.success("Test submitted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAnswer = (index, option) => {
    const marked_answers = [...attempt.marked_answers];

    if (marked_answers[index] === option) {
      marked_answers[index] = "";
    } else {
      marked_answers[index] = option;
    }

    setAttempt({
      ...attempt,
      marked_answers: marked_answers,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        {/* Skeleton Header */}
        <div className="sticky top-0 z-50 bg-white border-b -mb-4 w-full">
          <div className="container max-w-4xl mx-auto flex justify-between items-center p-4">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-4">
              <div className="text-sm space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Skeleton Main Content */}
        <div className="container max-w-4xl py-6 px-4 w-full">
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Navigation */}
        <div className="fixed inset-x-0 bottom-0 w-full bg-white border-t py-4 px-6">
          <div className="container max-w-4xl mx-auto flex justify-between items-center">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b -mb-4 w-full">
        <div className="container max-w-4xl mx-auto flex justify-between items-center p-4">
          {testPage === 0 && (
            <Button size="lg" onClick={startTest}>
              {attempt.status === "in_progress" ? "Resume Test" : "Start Test"}
            </Button>
          )}
          {testPage === 1 && (
            <Button
              onClick={() => setConfirmExitOpen(true)}
              variant="destructive"
              disabled={testPage !== 1}
            >
              Submit Test
            </Button>
          )}

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div>Time Remaining</div>
              <div className="font-mono">
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuestionGridOpen(true)}
              disabled={testPage !== 1}
            >
              <LayoutGrid />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl py-6 px-4 w-full">
        {testPage === 0 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h1 className="text-xl font-semibold mb-2">{mockTest.name}</h1>
              <p className="text-gray-600">{mockTest.description}</p>
              <div className="flex gap-4 mt-4">
                <div className="text-sm text-gray-600">
                  Duration: {mockTest.duration} minutes
                </div>
                <div className="text-sm text-gray-600">
                  Questions: {mockTest.questions?.length}
                </div>
              </div>
            </Card>

            <Instructions />

            <div className="flex justify-end">
              <Button size="lg" onClick={startTest}>
                {attempt.status === "in_progress"
                  ? "Resume Test"
                  : "Start Test"}
              </Button>
            </div>
          </div>
        )}

        {testPage === 1 && (
          <div className="space-y-6">
            {/* Swipe hint message - moved above questions */}
            <div className="text-center text-sm text-gray-500">
              Swipe left or right to navigate between questions
            </div>

            <Carousel
              className="w-full max-w-[800px] mx-auto"
              opts={{
                align: "center",
                loop: false,
              }}
            >
              <CarouselContent className="px-4">
                {questions?.map((question, index) => (
                  <CarouselItem key={index} className="md:basis-full">
                    <Card className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium">
                          Question {index + 1} of {mockTest.questions.length}
                        </h2>
                        <div className="text-sm text-gray-600">
                          Marks: +1, -0
                        </div>
                      </div>

                      <div className="prose max-w-none mb-8">
                        <ReactKatex>{question.contentQuestion}</ReactKatex>
                        {question.coverQuestion && (
                          <div className="mt-4">
                            <img
                              src={question.coverQuestion}
                              alt="Question illustration"
                              className="max-w-full rounded-lg"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {question.contentOptions.map((option, optionIndex) => (
                          <Card
                            key={optionIndex}
                            className={`p-4 cursor-pointer transition ${
                              attempt.marked_answers[index] ===
                              String.fromCharCode(65 + optionIndex)
                                ? "border-blue-500 bg-blue-50"
                                : "hover:border-gray-300"
                            }`}
                            onClick={() =>
                              changeAnswer(
                                index,
                                String.fromCharCode(65 + optionIndex)
                              )
                            }
                          >
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
                          </Card>
                        ))}
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="fixed inset-x-0 bottom-0 w-full bg-white border-t py-4 px-6">
                <div className="container max-w-4xl mx-auto flex justify-between items-center">
                  <CarouselQuestionPrevious
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 w-32 shadow-sm hover:shadow-md transition-all"
                  />

                  <CarouselQuestionNext
                    variant="default"
                    size="lg"
                    className="flex items-center gap-2 w-32 shadow-sm hover:shadow-md transition-all"
                  />
                </div>
              </div>

              {/* Question Grid Dialog */}
              <Dialog
                open={questionGridOpen}
                onOpenChange={setQuestionGridOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Question Navigator</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 p-4">
                    {attempt.marked_answers?.map((answer, index) => (
                      <CarouselQuestionTo
                        index={index}
                        key={index}
                        variant={
                          answer === "" ||
                          answer === null ||
                          answer === undefined
                            ? "outline"
                            : "default"
                        }
                        customAction={() => {
                          setQuestionGridOpen(false);
                        }}
                      />
                    ))}
                  </div>
                  <div className="p-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Button variant="default">x</Button>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Button variant="outline">x</Button>
                      <span>Not Answered</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Carousel>
          </div>
        )}
      </div>

      {/* Confirm Exit Dialog */}
      <Dialog open={confirmExitOpen} onOpenChange={setConfirmExitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to submit the test? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmExitOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => submitTest("user")}>
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
