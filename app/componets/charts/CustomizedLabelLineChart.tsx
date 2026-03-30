"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelProps,
} from "recharts";


interface LineChartComponentProps {
  data: { [key: string]: any }[];
  title: string;
  lines?: { dataKey: string; stroke: string }[];
  width?: number | string;
  height?: number | string;
}

// Label above each point
const CustomizedLabel = ({ x, y, stroke, value }: LabelProps) => {
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {value}
    </text>
  );
};

// X-axis rotated ticks
const CustomizedAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {payload.value}
      </text>
    </g>
  );
};

export default function LineChartComponent({
  data,
  title,
  lines = [
    { dataKey: "pv", stroke: "#3b82f6" },
    { dataKey: "uv", stroke: "#60a5fa" },
  ],
  width = "100%",
  height = 300,
}: LineChartComponentProps) {
  return (
    <div className="p-4 rounded-xl shadow border border-gray-200 bg-white w-full">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
      <div style={{ width, height }}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 0, left: 0, bottom: 10 }}
          style={{ width: "100%", height: "100%" }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
          <XAxis dataKey="name" height={60} tick={CustomizedAxisTick} />
          <YAxis width="auto" />
          <Tooltip
            cursor={{ stroke: "var(--color-border-2)" }}
            contentStyle={{
              backgroundColor: "var(--color-surface-base)",
              borderColor: "var(--color-border-2)",
            }}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              label={CustomizedLabel}
              dot={{ fill: "var(--color-surface-base)" }}
              activeDot={{ stroke: "var(--color-surface-base)" }}
            />
          ))}
       
        </LineChart>
      </div>
    </div>
  );
}