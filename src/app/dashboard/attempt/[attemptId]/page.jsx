"use client";

import { Suspense, useEffect, useState } from "react";
import {
  appwriteClient,
  appwriteDatabases,
} from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { TEST_STATUS } from "@/config-global";
import TestAttempt from "@/components/sections/dashboard/test-attempt";
import TestReport from "@/components/sections/dashboard/test-report";
import TestEvaluation from "@/components/sections/dashboard/test-evaluation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

function AttemptPageLoading() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full max-w-3xl space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AttemptPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const lang = searchParams.get("lang");

  useEffect(() => {
    let unsubscribe;

    const fetchAttempt = async () => {
      const attemptId = window.location.pathname.split("/")[3];
      try {
        const attemptData = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTestAttempts,
          attemptId
        );
        setAttempt(attemptData);
      } catch (error) {
        console.error("Error fetching attempt:", error);
      } finally {
        setLoading(false);
      }

      unsubscribe = appwriteClient.subscribe(
        `databases.${APPWRITE_API.databaseId}.collections.${APPWRITE_API.collections.mockTestAttempts}.documents.${attemptId}`,
        (response) => {
          setAttempt(response.payload);
        }
      );
    };

    fetchAttempt();

    return () => {
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <AttemptPageLoading />;
  }

  if (!attempt) {
    return (
      <div className="container mx-auto p-8">
        <Card className="max-w-lg mx-auto p-6 text-center space-y-4">
          <h2 className="text-lg font-semibold">Could not load this attempt</h2>
          <p className="text-sm text-gray-500">
            The attempt may have been removed or you may not have access to it.
          </p>
          <Button onClick={() => router.back()}>Go back</Button>
        </Card>
      </div>
    );
  }

  if (attempt.status === TEST_STATUS.IN_EVALUATION) {
    return <TestEvaluation attempt={attempt} />;
  }

  if (attempt.status === TEST_STATUS.COMPLETED) {
    return <TestReport attempt={attempt} />;
  }

  return <TestAttempt attemptObj={attempt} lang={lang} />;
}

export default function AttemptPage() {
  return (
    <Suspense fallback={<AttemptPageLoading />}>
      <AttemptPageContent />
    </Suspense>
  );
}
