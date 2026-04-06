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
import { useState, useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="text-xs font-semibold text-gray-800 mb-2">
            {dataItem.fullName || label}
          </p>
          <div className="space-y-1">
            {payload.find((p: any) => p.dataKey === 'revenue') && (
              <p className="text-xs text-orange-600 font-bold">
                Revenue: ₹{payload.find((p: any) => p.dataKey === 'revenue')?.value?.toLocaleString('en-IN')}
              </p>
            )}
            {payload.find((p: any) => p.dataKey === 'units') && (
              <p className="text-xs text-green-600">
                Units: {payload.find((p: any) => p.dataKey === 'units')?.value?.toLocaleString('en-IN')} kWh
              </p>
            )}
            {payload.find((p: any) => p.dataKey === 'sessions') && (
              <p className="text-xs text-purple-600">
                Sessions: {payload.find((p: any) => p.dataKey === 'sessions')?.value?.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  console.log("ComposedChart Data:", data);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
        <div className="w-full flex items-center justify-center" style={{ height: typeof size === 'number' ? size : 300 }}>
          <p className="text-gray-400 text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Title */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h2>

      {/* Chart */}
      <div className="w-full" style={{ height: typeof size === 'number' ? size : 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top:0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="name"
              tick={{ fontSize:10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              angle={-45 }
              textAnchor={"end"}
              height={80}
              interval={0}
            />

            <YAxis
              yAxisId="left"
              width={isMobile ? 40 : 50}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              width={isMobile ? 40 : 50}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend wrapperStyle={{ fontSize: "12px" }} />

            {/* Bar for Units */}
            <Bar
              yAxisId="left"
              dataKey="units"
              barSize={isMobile ? 25 : 35}
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
              name="Units (kWh)"
            />

            {/* Line for Revenue */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Revenue (₹)"
            />

            {/* Area for Sessions */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="sessions"
              fill="#6366f1"
              stroke="#6366f1"
              fillOpacity={0.15}
              name="Sessions"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {data.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Showing {data.length} {data.length === 1 ? 'charger' : 'chargers'}
        </p>
      )}
    </div>
  );
}