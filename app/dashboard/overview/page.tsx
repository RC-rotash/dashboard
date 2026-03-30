// import { data, pieDataDayOfWeek } from "@/app/componets/chartData/dummyData";
// import PieChartComponent from "@/app/componets/charts/PieChartComponent";
// import RevenueChart from "@/app/componets/charts/RevenueChart";

// export default function OverviewPage() {
//   return (
//     <div className="w-full bg-white p-2">
//       <div className="space-y-6">
//         {/* <h2 className="text-2xl font-bold">Hourly Data</h2> */}
//         <div className="flex flex-col md:flex-row gap-6 w-full">
//           <div className="flex-1 space-y-6">
//             <RevenueChart size={300} data={data} title="Units Consumed By Hour" />
//             <RevenueChart size={300} data={data} title="Total units consumed by day of week
// " />
//           </div>
//           <div className="flex-1 space-y-6">
//             <PieChartComponent data={pieDataDayOfWeek} title="Property Share of Net Transaction Amount (Avg) per day
// " />

//             <PieChartComponent data={pieDataDayOfWeek} title="Units by Day of Week
// " />
//           </div>
//         </div>

//           <RevenueChart size={100} data={data} title="Units Consumed Monthly by property
// " />
//       </div>
//     </div>
//   );
// }

import { data, pieDataDayOfWeek } from "@/app/componets/chartData/dummyData";
import PieChartComponent from "@/app/componets/charts/PieChartComponent";
import RevenueChart from "@/app/componets/charts/RevenueChart";

export default function OverviewPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 space-y-4  mt-16">

      {/* 🔹 Top Section (2 Big Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:shadow-md transition">
          <RevenueChart size={200} data={data} title="Units Consumed (Hourly)" />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:shadow-md transition">
          <RevenueChart size={200} data={data} title="Units by Day" />
        </div>

      </div>

      {/* 🔹 Middle Section (Pie + Pie + Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:shadow-md transition">
          <PieChartComponent
            data={pieDataDayOfWeek}
            title="Revenue Share (Day)"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:shadow-md transition">
          <PieChartComponent
            data={pieDataDayOfWeek}
            title="Units by Day"
          />
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:shadow-md transition">
          <RevenueChart
            size={180}
            data={data}
            title="Transactions Trend"
          />
        </div> */}

      </div>

      {/* 🔹 Bottom Full Width Chart */}
      <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:shadow-md transition">
        <RevenueChart
          size={250}
          data={data}
          title="Monthly Units by Property"
        />
      </div>

    </div>
  );
}