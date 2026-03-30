"use client";

import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
  size?: number | string;
  title?: string;
}

export default function ComposedAnalyticsChart({
  data,
  size = 300,
  title = "Analytics Overview",
}: Props) {
  return (
    <div className="bg-white ">

      {/* 🔹 Title */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h2>

      {/* 🔹 Chart */}
      <div className="w-full " style={{ height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              width={40}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />

            <Legend wrapperStyle={{ fontSize: "12px" }} />

            {/* 🔹 Area */}
            <Area
              type="monotone"
              dataKey="amt"
              fill="#6366f1"
              stroke="#6366f1"
              fillOpacity={0.15}
            />

            {/* 🔹 Bar */}
            <Bar
              dataKey="pv"
              barSize={18}
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
            />

            {/* 🔹 Line */}
            <Line
              type="monotone"
              dataKey="uv"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3 }}
            />

            {/* 🔹 Scatter */}
            <Scatter dataKey="cnt" fill="#ef4444" />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}