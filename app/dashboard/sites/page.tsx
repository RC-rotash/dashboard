// import { data, datasimple, pieDataDayOfWeek } from "@/app/componets/chartData/dummyData";
// import PieChartComponent from "@/app/componets/charts/PieChartComponent";
// import RevenueChart from "@/app/componets/charts/RevenueChart";
// import SimpleBarChart from "@/app/componets/charts/SimpleBarChart";

// export default function SitesPage() {
//   return (
//     <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 space-y-6 mt-13">

//       {/* 🔹 Header */}
//       <div>
//         <h1 className="text-lg md:text-xl font-semibold text-gray-800">
//           Sites Analytics
//         </h1>
//         <p className="text-sm text-gray-500">
//           Monitor performance across all EV charging sites
//         </p>
//       </div>

//       {/* 🔹 Top Charts */}
//       <div className="">
// <SimpleBarChart data={datasimple} title="Revenue by Site" />
//         {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
//           <RevenueChart data={data} title="Units Consumed By Hour" />
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
//           <RevenueChart data={data} title="Units by Day of Week" />
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
//           <RevenueChart data={data} title="Monthly Units by Property" />
//         </div> */}

//       </div>

//       {/* 🔹 Bottom Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
//           <PieChartComponent
//             data={pieDataDayOfWeek}
//             title="Revenue Share by Property"
//           />
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
//           <PieChartComponent
//             data={pieDataDayOfWeek}
//             title="Units Distribution (Weekly)"
//           />
//         </div>

//       </div>

//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { data, datasimple, pieDataDayOfWeek } from "@/app/componets/chartData/dummyData";
import PieChartComponent from "@/app/componets/charts/PieChartComponent";
import RevenueChart from "@/app/componets/charts/RevenueChart";
import SimpleBarChart from "@/app/componets/charts/SimpleBarChart";

const filters = [
  "Today",
  "Yesterday",
  "1M",
  "6M",
  "1Y",
  "3Y",
];

export default function SitesPage() {
  const [activeFilter, setActiveFilter] = useState("Today");

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 space-y-6 mt-13">

      {/* 🔹 Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Sites Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Monitor performance across all EV charging sites
          </p>
        </div>

        {/* 🔥 FILTER BAR */}
        <div className="flex flex-wrap items-center gap-2">

          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition
                ${
                  activeFilter === item
                    ? "bg-[#0094FE] text-white border-[#0094FE]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
            >
              {item}
            </button>
          ))}

          {/* 📅 Calendar */}
          <input
            type="date"
            className="px-2 py-1.5 text-sm border rounded-lg bg-white"
          />
        </div>
      </div>

      {/* 🔹 Top Charts */}
      <div>
        <SimpleBarChart data={datasimple} title={`Revenue by Site (${activeFilter})`} />
      </div>

      {/* 🔹 Bottom Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <PieChartComponent
            data={pieDataDayOfWeek}
            title="Revenue Share by Property"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <PieChartComponent
            data={pieDataDayOfWeek}
            title="Units Distribution (Weekly)"
          />
        </div>

      </div>

    </div>
  );
}