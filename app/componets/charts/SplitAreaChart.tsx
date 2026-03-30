"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useChartHeight, useYAxisScale } from "recharts";

interface Props {
  data: any[];
  title?: string;
  dataKey?: string;
}

const Gradient = () => {
  const scale = useYAxisScale();
  const height = useChartHeight();

  const scaledZero = scale?.(0);

  if (scaledZero == null || height == null) return null;

  const ratio = scaledZero / height;

  return (
    <defs>
      <linearGradient
        id="splitColor"
        x1="0"
        x2="0"
        y1="0"
        y2={height}
        gradientUnits="userSpaceOnUse"
      >
        {/* Positive */}
        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
        <stop offset={`${ratio * 100}%`} stopColor="#22c55e" stopOpacity={0.1} />

        {/* Negative */}
        <stop offset={`${ratio * 100}%`} stopColor="#ef4444" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
      </linearGradient>
    </defs>
  );
};

export default function SplitAreaChart({
  data,
  title = "Performance",
  dataKey = "uv",
}: Props) {
  return (
    <div className="bg-white">

      {/* 🔹 Title */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h2>

      {/* 🔹 Chart */}
      <div className="w-full h-[228px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />

            <Gradient />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#111827"
              strokeWidth={2}
              fill="url(#splitColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}