"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function PieChart({ data }) {
  const COLORS = {
    "bg-green-500": "#22c55e",
    "bg-red-500": "#ef4444",
    "bg-yellow-500": "#eab308",
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          fill="#8884d8"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            name,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                className="text-sm"
                fill="currentColor"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {`${name} (${value})`}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[entry.color]} strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
