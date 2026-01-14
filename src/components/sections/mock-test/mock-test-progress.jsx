"use client";

import { Card } from "@/components/ui/card";
import { TEST_STATUS } from "@/config-global";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function MockTestProgress({ attempts }) {
    const completedAttempts = attempts.filter(
        (a) => a.status === TEST_STATUS.COMPLETED
    );

    if (completedAttempts.length === 0) {
        return null;
    }

    return (
        <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={[...completedAttempts].reverse().map((attempt) => ({
                            attempt: new Date(attempt.$createdAt).toLocaleDateString(),
                            marks: (attempt.obtained_marks / attempt.total_marks) * 100,
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="attempt" />
                        <YAxis unit="%" />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="marks"
                            stroke="#2563eb"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
