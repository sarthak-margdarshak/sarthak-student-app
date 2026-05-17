"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { appwriteDatabases } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API, TEST_STATUS } from "@/config-global";
import { Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { useAppContent } from "@/hook/app/useAppContent";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { labels } from "@/lib/labels";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Lock, AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { PATH_DASHBOARD } from "@/routes/paths";
import MockTestHeader from "@/components/sections/mock-test/mock-test-header";
import MockTestAttemptsList from "@/components/sections/mock-test/mock-test-attempts-list";
import MockTestProgress from "@/components/sections/mock-test/mock-test-progress";

export default function MockTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getMockTest, setCurrentPageName } = useAppContent();
  const { user } = useAuthContext();
  const [mockTestId, setMockTestId] = useState(null);
  const productId = searchParams.get("productId");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [mockTest, setMockTest] = useState(null);
  const [inProgressAttempt, setInProgressAttempt] = useState(null);
  const [currLang, setCurrLang] = useState(searchParams.get("lang"));

  useEffect(() => {
    // Fetch mock test details and attempts
    const fetchMockTestAndAttempts = async () => {
      const c =
        user &&
        productId &&
        user.labels.findIndex(
          (label) =>
            label === labels.founder ||
            label === labels.admin ||
            label === productId,
        ) !== -1;
      setHasSubscription(c);
      if (!c) {
        setLoading(false);
        return;
      }
      const id = window.location.pathname.split("/")[3];
      setMockTestId(id);
      try {
        const x = await getMockTest(id);
        setMockTest(x);
        setCurrentPageName(x?.[currLang]?.name || x?.name);

        const attemptsData = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTestAttempts,
          [
            Query.equal("studentId", user.$id),
            Query.equal("mockTestId", id),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ],
        );

        // Find any in-progress or created attempt
        const inProgress = attemptsData.documents.find(
          (attempt) =>
            attempt.status === TEST_STATUS.IN_PROGRESS ||
            attempt.status === TEST_STATUS.CREATED,
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

  // Check if productId is null or user doesn't have subscription - show blocked access page
  if (!productId || !hasSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-md w-full mx-4">
          <Card className="p-8 text-center shadow-2xl border-red-200 dark:border-red-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Blocked
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {!productId
                ? "You don't have permission to access this mock test. This content requires a valid mock test series subscription."
                : "You don't have an active subscription for this mock test series. Please purchase the series to access this content."}
            </p>

            <div className="space-y-3">
              {productId && (
                <Button
                  onClick={() => router.push(`/product/${productId}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  View Product Details
                </Button>
              )}

              <Button
                onClick={() => router.push(PATH_DASHBOARD.root)}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>

              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help? Contact support for assistance.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
      {mockTest?.availableLang?.length > 1 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Select Language
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                Choose your preferred language for the test
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockTest.availableLang.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setCurrLang(lang);
                    setCurrentPageName(
                      mockTest?.[lang]?.name || mockTest?.name,
                    );
                  }}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300
                    uppercase tracking-wide
                    ${
                      currLang === lang
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                        : "bg-white text-gray-600 hover:bg-white/80 hover:text-blue-600 shadow-sm"
                    }
                  `}
                >
                  {lang}
                  {currLang === lang && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      <MockTestHeader
        mockTest={mockTest}
        inProgressAttempt={inProgressAttempt}
        mockTestId={mockTestId}
        currLang={currLang}
      />

      <MockTestAttemptsList attempts={attempts} currLang={currLang} />

      <MockTestProgress attempts={attempts} />
    </div>
  );
}
