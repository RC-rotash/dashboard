// "use client";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// interface Props {
//   data: { name: string; uv: number }[];
//   title?: string;
//   height?: number | string;
// }

// const SimpleBarChart = ({ data, title, height=200 }: Props) => {
//   return (
//     <div className="w-full" style={{ height }}>

      
//       {title && (
//         <h2 className="text-lg font-semibold mb-4">{title}</h2>
//       )}

//       <ResponsiveContainer width="100%" height="90%">
//         <BarChart
//           data={data}
//             barCategoryGap="40%"  
//           margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />

//           <Bar
//             maxBarSize={40} 
//             dataKey="uv"
//             fill="#0094FE"
//             radius={[0, 0, 0, 0]}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SimpleBarChart;

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
  height?: number | string;
}

const SimpleBarChart = ({ data, title, height = 200 }: Props) => {
  return (
    <div className="w-full" style={{ height }}>

      {/* Chart Title */}
      {title && (
        <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
      )}

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          barCategoryGap="40%"
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          {/* X Axis with smaller font */}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#555", fontWeight: "500" }}
          />

          {/* Y Axis with smaller font */}
          <YAxis
            tick={{ fontSize: 10, fill: "#555" , fontWeight: "500" }}
          />

          {/* Tooltip with smaller font */}
          <Tooltip
            contentStyle={{ fontSize: 10, fontWeight: "500" }}
          />

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