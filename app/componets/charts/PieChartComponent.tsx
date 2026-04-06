"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from "recharts";

interface PieChartComponentProps {
  data: { name: string; value: number }[];
  title: string;
  colors?: string[];
  isAnimationActive?: boolean;
}

const RADIAN = Math.PI / 180;

export default function PieChartComponent({
  data,
  title,
  colors,
  isAnimationActive = true,
}: PieChartComponentProps) {
  // Extended color palette for many items
  const defaultColors = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#f97316", // orange
    "#a855f7", // purple
    "#ec4899", // pink
    "#ef4444", // red
    "#eab308", // yellow
    "#14b8a6", // teal
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#d946ef", // fuchsia
    "#f43f5e", // rose
    "#10b981", // emerald
    "#6366f1", // indigo
    "#fb923c", // orange-light
    "#4ade80", // green-light
    "#c084fc", // purple-light
    "#f472b6", // pink-light
    "#f87171", // red-light
    "#fde047", // yellow-light
    "#2dd4bf", // teal-light
    "#fbbf24", // amber-light
    "#a78bfa", // violet-light
    "#67e8f9", // cyan-light
    "#bef264", // lime-light
    "#e879f9", // fuchsia-light
    "#fb7185", // rose-light
    "#34d399", // emerald-light
    "#818cf8", // indigo-light
  ];

  // Label inside the pie slice
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) return null;
    if (percent < 0.05) return null; // Don't show label for very small slices
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((dataItem.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="text-xs font-semibold text-gray-800 mb-1 break-words">
            {dataItem.fullName || dataItem.name}
          </p>
          <p className="text-xs text-[#0094FE] font-bold">
            Value: {dataItem.value.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500">
            Percentage: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }: any) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="mt-4 max-h-[200px] overflow-y-auto">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);
          return (
            <div key={`legend-${index}`} className="flex items-center justify-between gap-2 mb-1 text-xs">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 truncate" title={entry.value}>
                  {entry.value}
                </span>
              </div>
              <span className="text-gray-500 flex-shrink-0">{percentage}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="">
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={renderCustomizedLabel}
                labelLine={false}
                isAnimationActive={isAnimationActive}
                cx="50%"
                cy="50%"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      colors 
                        ? colors[index % colors.length] 
                        : defaultColors[index % defaultColors.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-gray-400 text-center">
            Total items: {data.length} | Hover over slices for details
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
}