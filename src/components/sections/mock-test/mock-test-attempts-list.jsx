"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TEST_STATUS } from "@/config-global";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";

export default function MockTestAttemptsList({ attempts }) {
    const router = useRouter();

    if (!attempts || attempts.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-4">
            {attempts.map((attempt, index) => (
                <Card
                    key={attempt.$id}
                    className="p-4 hover:border-blue-200 cursor-pointer transition-all"
                    onClick={() => router.push(PATH_DASHBOARD.attempt(attempt.$id))}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-blue-600">
                                    Attempt #{attempts.length - index}
                                </span>
                            </div>
                            <h3 className="font-medium">
                                {new Date(attempt.$createdAt).toLocaleDateString()}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {new Date(attempt.$createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                        <div
                            className={`px-3 py-1 rounded-full text-sm ${attempt.status === TEST_STATUS.COMPLETED
                                    ? "bg-green-100 text-green-800"
                                    : attempt.status === TEST_STATUS.IN_PROGRESS
                                        ? "bg-amber-100 text-amber-800"
                                        : attempt.status === TEST_STATUS.EXPIRED
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                }`}
                        >
                            {attempt.status.charAt(0).toUpperCase() +
                                attempt.status.slice(1).replace("_", " ")}
                        </div>
                    </div>

                    {attempt.status === TEST_STATUS.COMPLETED && (
                        <div>
                            <div className="flex items-center gap-4 mb-1">
                                <div className="flex-1">
                                    <Progress
                                        value={
                                            (attempt.obtained_marks / attempt.total_marks) * 100
                                        }
                                    />
                                </div>
                                <div className="text-sm font-medium">
                                    {attempt.obtained_marks}/{attempt.total_marks}
                                </div>
                            </div>
                            {attempt.test_ended && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Ended: {new Date(attempt.test_ended).toLocaleString()}
                                    {attempt.test_ended_by && ` (${attempt.test_ended_by})`}
                                </p>
                            )}
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
