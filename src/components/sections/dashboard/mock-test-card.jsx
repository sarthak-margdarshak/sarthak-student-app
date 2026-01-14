"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight } from "lucide-react";
import { useAppContent } from "@/hook/app/useAppContent";

export default function MockTestCard({ mockTestId, productId, lang }) {
  const { getMockTest } = useAppContent();

  const [loading, setLoading] = useState(
    localStorage.getItem(`mock_test_${mockTestId}`)
      ? false
      : true
  );
  const [mockTest, setMockTest] = useState(
    localStorage.getItem(`mock_test_${mockTestId}`)
      ? JSON.parse(localStorage.getItem(`mock_test_${mockTestId}`))
      : {}
  );

  useEffect(() => {
    async function fetchData() {
      const x = await getMockTest(mockTestId);
      setMockTest(x);
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  return (
    <Link
      href={PATH_DASHBOARD.mockTest(mockTestId, productId, lang)}
      className="group"
    >
      <div
        className={`relative bg-white rounded-xl shadow-sm border p-6 transition-all duration-300 overflow-hidden border-gray-100 hover:shadow-lg hover:border-blue-200 hover:scale-[1.02] hover:bg-gradient-to-br from-white via-blue-50 to-white`}
      >
        {/* Shiny effect overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
          <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </div>

        {loading ? (
          <div>
            <Skeleton className="h-[40px] rounded-full m-1" />
            <Skeleton className="h-[20px] rounded-full m-1" />
            <Skeleton className="h-[20px] rounded-full m-1" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {mockTest?.[lang]?.name || mockTest?.name}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <p className="text-sm text-gray-500">
                  {mockTest?.[lang]?.description || mockTest?.description}
                </p>
                <div className="flex gap-4 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${mockTest?.level?.toLowerCase() === "hard"
                      ? "bg-red-50 text-red-600 group-hover:bg-red-100"
                      : mockTest?.level?.toLowerCase() === "medium"
                        ? "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100"
                        : "bg-green-50 text-green-600 group-hover:bg-green-100"
                      }`}
                  >
                    Level: {mockTest?.level}
                  </span>
                  <span className="text-xs bg-green-50 text-green-600 group-hover:bg-green-100 px-2 py-1 rounded-full transition-colors">
                    {mockTest?.questions?.length} Questions
                  </span>
                </div>

                {mockTest?.availableLang?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[10px] text-gray-400 font-medium self-center mr-1">
                      Available In:
                    </span>
                    {mockTest.availableLang.map((lang) => (
                      <span
                        key={lang}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700"
                      >
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-500 transform group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link >
  );
}
