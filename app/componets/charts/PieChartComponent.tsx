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
  const defaultColors = ["#3b82f6", "#60a5fa", "#22c55e", "#facc15", "#f97316", "#a855f7", "#ec4899"];

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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={10}       // smaller font
        fontWeight={500}    // slightly bold
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom slice coloring
  const renderCustomSector = (props: any) => {
    return <Sector {...props} fill={colors ? colors[props.index % colors.length] : defaultColors[props.index % defaultColors.length]} />;
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={renderCustomizedLabel}
            labelLine={false}
            isAnimationActive={isAnimationActive}
            shape={renderCustomSector}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors ? colors[index % colors.length] : defaultColors[index % defaultColors.length]}
              />
            ))}
          </Pie>
          {/* <Tooltip formatter={(value: number) => value.toLocaleString()} /> */}

          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value: string, entry: any) => {
              const index = data.findIndex(d => d.name === value);
              const fillColor = colors
                ? colors[index % colors.length]
                : defaultColors[index % defaultColors.length];

              const total = data.reduce((sum, item) => sum + item.value, 0);
              const percent = data[index] ? ((data[index].value / total) * 100).toFixed(1) : 0;

              return <span style={{ color: fillColor, fontSize:5 }}>{`${value}: ${percent}%`}</span>;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}