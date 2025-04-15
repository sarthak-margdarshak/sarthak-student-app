"use client";

import { useEffect, useState } from "react";
import {
  appwriteClient,
  appwriteDatabases,
  downloadMockTest,
} from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { TEST_STATUS } from "@/config-global";
import TestAttempt from "@/components/sections/dashboard/test-attempt";
import TestReport from "@/components/sections/dashboard/test-report";
import TestEvaluation from "@/components/sections/dashboard/test-evaluation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AttemptPage() {
  const [attemptId, setAttemptId] = useState(
    window.location.pathname.split("/")[3]
  );
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      const id = window.location.pathname.split("/")[3];
      setAttemptId(id);
      try {
        const attemptData = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTestAttempts,
          id
        );
        setAttempt(attemptData);
        await downloadMockTest(attemptData.mockTestId);
      } catch (error) {
        console.error("Error fetching attempt:", error);
      } finally {
        setLoading(false);
      }

      appwriteClient.subscribe(
        `databases.${APPWRITE_API.databaseId}.collections.${APPWRITE_API.collections.mockTestAttempts}.documents.${id}`,
        (response) => {
          if (response.payload.status !== TEST_STATUS.IN_PROGRESS) {
            setAttempt(response.payload);
          }
        }
      );
    };

    fetchAttempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // If test is under evaluation, show evaluation progress
  if (attempt?.status === TEST_STATUS.IN_EVALUATION) {
    return <TestEvaluation />;
  }

  // If test is already completed, show result card
  if (attempt?.status === TEST_STATUS.COMPLETED) {
    return <TestReport attempt={attempt} />;
  }

  return <TestAttempt attemptObj={attempt} />;
}
