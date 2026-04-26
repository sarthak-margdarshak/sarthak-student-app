"use client";

import { useEffect, useMemo, useState } from "react";
import { Query } from "appwrite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APPWRITE_API, TEST_STATUS } from "@/config-global";
import {
  appwriteDatabases,
  timeAgo,
} from "@/hook/auth/AppwriteContext";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { useAppContent } from "@/hook/app/useAppContent";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

function formatStatus(status) {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

function getStatusVariant(status) {
  switch (status) {
    case TEST_STATUS.COMPLETED:
      return "default";
    case TEST_STATUS.IN_EVALUATION:
      return "secondary";
    case TEST_STATUS.IN_PROGRESS:
      return "secondary";
    case TEST_STATUS.CREATED:
      return "outline";
    default:
      return "outline";
  }
}

function getActionLabel(status) {
  if (status === TEST_STATUS.COMPLETED) return "View Report";
  if (status === TEST_STATUS.IN_EVALUATION) return "View Evaluation";
  if (status === TEST_STATUS.IN_PROGRESS || status === TEST_STATUS.CREATED) {
    return "Resume Attempt";
  }
  return "Open Attempt";
}

export default function AttemptHistoryPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { setCurrentPageName, getMockTest, getProduct } = useAppContent();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPageName("Attempt History");
  }, [setCurrentPageName]);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!user?.$id) {
        setAttempts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.mockTestAttempts,
          [
            Query.equal("studentId", user.$id),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ]
        );

        const mockTestCache = {};
        const productCache = {};

        const enriched = await Promise.all(
          response.documents.map(async (attempt) => {
            const mockTestId = attempt.mockTestId;
            const productId = attempt.productId;

            let mockTest = null;
            if (mockTestId) {
              if (!mockTestCache[mockTestId]) {
                mockTestCache[mockTestId] = await getMockTest(mockTestId);
              }
              mockTest = mockTestCache[mockTestId];
            }

            let product = null;
            if (productId) {
              if (!productCache[productId]) {
                productCache[productId] = await getProduct(productId);
              }
              product = productCache[productId];
            }

            return {
              ...attempt,
              mockTestName: mockTest?.name || "Unknown Mock Test",
              productName: product?.name || "Unknown Product",
            };
          })
        );

        setAttempts(enriched);
      } catch (error) {
        console.error("Error fetching attempt history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [getMockTest, getProduct, user]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="space-y-3 mt-20">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      );
    }

    if (attempts.length === 0) {
      return (
        <div className="mt-20 text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No Attempts Yet</h2>
          <p className="text-gray-600">
            You have not attempted any mock tests yet.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-20 space-y-3">
        {attempts.map((attempt) => (
          <Card key={attempt.$id} className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Attempt ID: {attempt.$id}</p>
                <h3 className="text-base font-semibold">{attempt.mockTestName}</h3>
                <p className="text-xs text-gray-500">
                  {timeAgo.format(new Date(attempt.$createdAt))}
                </p>
              </div>

              <div className="flex flex-col items-start gap-2 md:items-end">
                <Badge variant={getStatusVariant(attempt.status)}>
                  {formatStatus(attempt.status)}
                </Badge>
                <Button
                  size="sm"
                  onClick={() => router.push(PATH_DASHBOARD.attempt(attempt.$id, attempt.lang))}
                >
                  {getActionLabel(attempt.status)}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }, [attempts, loading, router]);

  return <div className="container mx-auto">{content}</div>;
}
