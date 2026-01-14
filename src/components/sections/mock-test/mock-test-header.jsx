"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudIcon } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { appwriteDatabases } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API, TEST_STATUS } from "@/config-global";
import { ID } from "appwrite";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { useAppContent } from "@/hook/app/useAppContent";

export default function MockTestHeader({
  mockTest,
  inProgressAttempt,
  mockTestId,
  currLang,
}) {
  const { getBookIndex, getQuestion } = useAppContent();
  const router = useRouter();
  const { user } = useAuthContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreatingAttempt, setIsCreatingAttempt] = useState(false);
  const [index, setIndex] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var tempIndex = {};
        if (mockTest.standardId) {
          const standard = await getBookIndex(mockTest.standardId);
          tempIndex.standard = standard;
        }
        if (mockTest.subjectId) {
          const subject = await getBookIndex(mockTest.subjectId);
          tempIndex.subject = subject;
        }
        if (mockTest.chapterId) {
          const chapter = await getBookIndex(mockTest.chapterId);
          tempIndex.chapter = chapter;
        }
        if (mockTest.topicId) {
          const topic = await getBookIndex(mockTest.topicId);
          tempIndex.topic = topic;
        }
        setIndex(tempIndex);

        mockTest.questions?.forEach(async (id) => {
          await getQuestion(id);
        });
        setIsDownloaded(true);
      } catch (error) {
        console.error("Error fetching mock test:", error);
      }
    };
    fetchData();
  }, [mockTestId]);

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
          lang: currLang,
        }
      );

      router.push(PATH_DASHBOARD.attempt(attempt.$id, currLang));
      setIsCreatingAttempt(false);
    } catch (error) {
      console.error("Error creating attempt:", error);
      setIsCreatingAttempt(false);
    }
  };

  // Handle resume/start attempt
  const handleAttempt = () => {
    if (inProgressAttempt) {
      router.push(PATH_DASHBOARD.attempt(inProgressAttempt.$id, currLang));
    } else {
      setDialogOpen(true);
    }
  };

  const startTest = (isDummy) => {
    if (isDummy) {
      router.push(PATH_DASHBOARD.attempt("dummy"));
    } else {
      createNewAttempt();
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">
              {mockTest?.[currLang]?.name || mockTest?.name}
            </h1>
            <Button disabled={!isDownloaded} onClick={handleAttempt} size="lg" className="px-8">
              {inProgressAttempt ? "Resume Test" : "Start Test"}
            </Button>
          </div>

          <p className="text-gray-600 w-full">
            {mockTest?.[currLang]?.description || mockTest?.description}
          </p>

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
                className={`text-sm ${mockTest.level.toLowerCase() === "easy"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : mockTest.level.toLowerCase() === "medium"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-red-100 text-red-800 border-red-200"
                  }`}
              >
                Level: {mockTest?.level}
              </Badge>
            )}

            <Badge variant="secondary" className="text-sm">
              {mockTest?.questions?.length} Questions
            </Badge>
          </div>

          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
            {index?.standard && (
              <div>
                👉{" "}
                <Badge variant="destructive">
                  Standard - {index.standard?.standard || index.standard?.name}
                </Badge>
              </div>
            )}
            {index?.subject && (
              <div>
                👉{" "}
                <Badge variant="destructive">
                  Subject - {index.subject?.subject || index.subject?.name}
                </Badge>
              </div>
            )}
            {index?.chapter && (
              <div>
                👉{" "}
                <Badge variant="destructive">
                  Chapter - {index.chapter?.chapter || index.chapter?.name}
                </Badge>
              </div>
            )}
            {index?.topic && (
              <div>
                👉{" "}
                <Badge variant="destructive">
                  Concept - {index.topic?.concept || index.topic?.name}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Mock Test</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-3 text-base font-semibold text-gray-900">
                  <CloudIcon className="w-5 h-5 text-blue-500" />
                  Ready to begin your assessment?
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      You will be redirected to a dedicated attempt page.
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Detailed instructions will appear first. Read them carefully before clicking <b>Start Test</b>.
                    </span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreatingAttempt}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                startTest(false);
                setDialogOpen(false);
              }}
              className="bg-green-500 hover:bg-green-600"
              disabled={isCreatingAttempt}
            >
              {isCreatingAttempt ? "Creating..." : "Start Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
