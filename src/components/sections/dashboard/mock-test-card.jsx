"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import Link from "next/link";
import { useEffect, useState } from "react";
import { appwriteDatabases } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { Query } from "appwrite";
import { Skeleton } from "@/components/ui/skeleton";

export default function MockTestCard({ mockTestId }) {
  const [loading, setLoading] = useState(true);
  const [mockTest, setMockTest] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        mockTestId,
        [Query.select(["$id", "name", "description"])]
      );
      setMockTest(x);
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link href={PATH_DASHBOARD.mockTest(mockTestId)} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-blue-100 hover:scale-102">
        {loading ? (
          <div>
            <Skeleton className="h-[40px] rounded-full m-1" />
            <Skeleton className="h-[20px] rounded-full m-1" />
            <Skeleton className="h-[20px] rounded-full m-1" />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {mockTest?.name}
              </h3>
              <p className="text-sm text-gray-500">{mockTest?.description}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
