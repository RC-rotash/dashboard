"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { name: string; uv: number }[];
  title?: string;
}

const SimpleBarChart = ({ data, title }: Props) => {
  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-2xl shadow">
      
      {title && (
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
      )}

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
            barCategoryGap="40%"  
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar
            maxBarSize={40} 
            dataKey="uv"
            fill="#0094FE"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;