"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadMockTest } from "@/hook/auth/AppwriteContext";

export default function MockTestCard({ mockTestId }) {
  const [loading, setLoading] = useState(true);
  const [mockTest, setMockTest] = useState({});
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await downloadMockTest(mockTestId);
      setMockTest(JSON.parse(localStorage.getItem(`mock_test_${mockTestId}`)));
      setIsDownloaded(true);
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  return (
    <div
      className={`${!isDownloaded ? "cursor-not-allowed" : ""}`}
      title={!isDownloaded ? "Downloading test content..." : "Start test"}
    >
      <Link
        href={isDownloaded ? PATH_DASHBOARD.mockTest(mockTestId) : "#"}
        className={`group ${!isDownloaded ? "pointer-events-none" : ""}`}
      >
        <div
          className={`bg-white rounded-xl shadow-sm border p-6 transition-all
          ${
            isDownloaded
              ? "border-gray-100 hover:shadow-md hover:border-blue-100 hover:scale-102"
              : "border-gray-200 opacity-60"
          }`}
        >
          {loading ? (
            <div>
              <Skeleton className="h-[40px] rounded-full m-1" />
              <Skeleton className="h-[20px] rounded-full m-1" />
              <Skeleton className="h-[20px] rounded-full m-1" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {mockTest?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {mockTest?.description}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        mockTest?.level?.toLowerCase() === "hard"
                          ? "bg-red-50 text-red-600"
                          : mockTest?.level?.toLowerCase() === "medium"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      Level: {mockTest?.level}
                    </span>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                      {mockTest?.questions?.length} Questions
                    </span>
                  </div>
                </div>
                {!isDownloaded && (
                  <div className="text-sm text-gray-400">
                    <span className="animate-pulse">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
