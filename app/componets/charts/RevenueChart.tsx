
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import { toPng } from "html-to-image";
import { useRef } from "react";

interface RevenueData {
  hour: string;
  revenue: number;
}

interface Props {
  data: RevenueData[];
  title: string;
  targetRevenue?: number;
  size?: number;
}

export default function RevenueChart({ data, title, targetRevenue = 30000, size=150 }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const peakRevenue = Math.max(...data.map(d => d.revenue));
  const handleDownload = () => {
    if (chartRef.current) {
      toPng(chartRef.current).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "revenue-chart.png";
        link.href = dataUrl;
        link.click();
      });
    }
  };

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        <button
          onClick={handleDownload}
          className="px-3 py-1 text-xs bg-blue-400 text-white rounded hover:bg-blue-700"
        >
          Download
        </button>
      </div>

      <div id="revenueChart" ref={chartRef} style={{ width: "100%", height: size }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
       
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#6b7280" }} />
            <YAxis
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickFormatter={(value) => `₹${(value / 1000).toLocaleString()}k`}
            />
            {targetRevenue && (
              <ReferenceLine
                y={targetRevenue}
                label={{ value: "Target", position: "insideTopRight", fill: "red" }}
                stroke="red"
                strokeDasharray="3 3"
              />
            )}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const revenue = payload[0].value;
                  return (
                    <div className="bg-white p-2 rounded shadow border text-sm">
                      <p className="text-gray-700">{payload[0].payload.hour}</p>
                      {/* <p className="font-bold text-blue-600">₹ {revenue.toLocaleString()}</p> */}
                    </div>
                  );
                }
                return null;
              }}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                {data.map((d, i) => (
                  <stop
                    key={i}
                    offset={`${(i / data.length) * 100}%`}
                    stopColor="#0094fe"
                    stopOpacity={d.revenue > targetRevenue ? 0.6 : 0.2}
                  />
                ))}
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0094fe"
              fill="url(#colorRevenue)"
              isAnimationActive={true}
              animationDuration={1000}
              dot={(props) => {
                if (props.payload.revenue === peakRevenue) {
                  return (
                    <circle
                  
                      r={5}
                      fill="orange"
                      stroke="red"
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              }}
            />
            {/* <Brush dataKey="hour" height={20}  stroke="#0094fe" /> */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}