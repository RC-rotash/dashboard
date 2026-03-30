// // import StatCard from "../componets/cards/StatCard";
// // import { data } from "../componets/chartData/dummyData";
// // import RevenueChart from "../componets/charts/RevenueChart";

// // export default function DashboardHomePage() {
// //   return (
// //     <div className="w-full space-y-6 p-2 bg-white">
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //         <RevenueChart data={data} size={200} title="Units Consumed By Hour" />
// //         <RevenueChart data={data} size={200} title="Revenue By Hour" />
// //       </div>
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-stretch">
// //         <RevenueChart data={data} size={200} title="No of Transactions By Hour" />
// //         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
// //           <StatCard title="Revenue" value="₹5,59,423" />
// //           <StatCard title="Transactions" value="29,425" />
// //           <StatCard title="Units Consumed" value="284,726 kWh" />
// //           <StatCard title="Avg Value" value="₹190" />
// //           <StatCard title="Units Consumed" value="284,726 kWh" />
// //           <StatCard title="Avg Value" value="₹190" />
// //         </div>
// //       </div>

// //     </div>
// //   );
// // }

// import StatCard from "../componets/cards/StatCard";
// import { data } from "../componets/chartData/dummyData";
// import RevenueChart from "../componets/charts/RevenueChart";

// export default function DashboardHomePage() {
//   return (
//     <div className="w-full p-4 space-y-6 bg-gray-50 min-h-screen">

//       {/* 🔹 Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
//         <p className="text-sm text-gray-500">Overview of your EV network</p>
//       </div>

//       {/* 🔹 KPI Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard title="Revenue" value="₹5,59,423" />
//         <StatCard title="Transactions" value="29,425" />
//         <StatCard title="Units Consumed" value="284,726 kWh" />
//         <StatCard title="Avg Value" value="₹190" />
//       </div>

//       {/* 🔹 Main Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <div className="bg-white rounded-xl shadow-sm">
//           <RevenueChart data={data} size={250} title="Revenue Trend" />
//         </div>

//         <div className="bg-white rounded-xl shadow-sm">
//           <RevenueChart data={data} size={250} title="Units Consumed Trend" />
//         </div>
//       </div>

//       {/* 🔹 Secondary Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <div className="bg-white rounded-xl shadow-sm">
//           <RevenueChart data={data} size={220} title="Transactions Trend" />
//         </div>

//         {/* 🔹 Insights / Highlights */}
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <h2 className="text-sm font-semibold text-gray-700 mb-3">
//             Key Insights
//           </h2>

//           <ul className="space-y-2 text-sm text-gray-600">
//             <li>⚡ Peak usage observed at 7 PM</li>
//             <li>💰 Revenue growth +12% vs last week</li>
//             <li>🔋 High utilization at top 3 stations</li>
//             <li>⚠️ 2 chargers reported downtime</li>
//           </ul>
//         </div>
//       </div>

//     </div>
//   );
// }

// import StatCard from "../componets/cards/StatCard";
// import { data } from "../componets/chartData/dummyData";
// import RevenueChart from "../componets/charts/RevenueChart";

// export default function DashboardHomePage() {
//   return (
//     <div className="w-full min-h-screen  md:p-6 space-y-6 
//     bg-white">

//       {/* 🔹 Header */}
//       {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//         <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
//           Dashboard
//         </h1>
//         <p className="text-sm text-gray-500">
//           Overview of your EV network
//         </p>
//       </div> */}

//       {/* 🔹 KPI Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard title="Revenue" value="₹5,59,423" />
//         <StatCard title="Transactions" value="29,425" />
//         <StatCard title="Units Consumed" value="284,726 kWh" />
//         <StatCard title="Avg Value" value="₹190" />
//       </div>

//       {/* 🔹 Main Charts */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        
//         <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-100 to-blue-50">
//           <div className="bg-white rounded-2xl shadow-sm p-3">
//             <RevenueChart data={data} size={150} title="Revenue Trend" />
//           </div>
//         </div>

//         <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-100 to-blue-50">
//           <div className="bg-white rounded-2xl shadow-sm p-3">
//             <RevenueChart data={data} size={150} title="Units Consumed Trend" />
//           </div>
//         </div>

//       </div>

//       {/* 🔹 Secondary Section */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
//         {/* Chart */}
//         <div className="xl:col-span-2 rounded-2xl p-[1px] bg-gradient-to-r from-blue-100 to-blue-50">
//           <div className="bg-white rounded-2xl shadow-sm p-3">
//             <RevenueChart data={data} size={150} title="Transactions Trend" />
//           </div>
//         </div>

//         {/* Insights */}
//         <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-100 to-blue-50">
//           <div className="bg-white rounded-2xl shadow-sm p-4 h-full">
            
//             <h2 className="text-sm font-semibold text-gray-700 mb-3">
//               Key Insights
//             </h2>

//             <ul className="space-y-3 text-sm text-gray-600">
//               <li className="flex items-start gap-2">
//                 <span>⚡</span> Peak usage observed at 7 PM
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>💰</span> Revenue growth +12% vs last week
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>🔋</span> High utilization at top 3 stations
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>⚠️</span> 2 chargers reported downtime
//               </li>
//             </ul>

//           </div>
//         </div>

//       </div>

//     </div>
//   );
// }

import StatCard from "../componets/cards/StatCard";
import { composedData, data, interactiveData, splitChartData } from "../componets/chartData/dummyData";
import ComposedAnalyticsChart from "../componets/charts/ComposedAnalyticsChart";
import InteractiveAreaChart from "../componets/charts/InteractiveAreaChart";
import RevenueChart from "../componets/charts/RevenueChart";
import SplitAreaChart from "../componets/charts/SplitAreaChart";

export default function DashboardHomePage() {
  const CHART_HEIGHT = 220;

  return (
    <div className="min-h-screen w-full p-4 md:p-6 space-y-6 
    bg-white">

      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          EV Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Real-time performance overview
        </p>
      </div>

      {/* 🔹 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Revenue" value="₹5,59,423" change="+12%" />
        <StatCard title="Transactions" value="29,425" change="+8%" />
        <StatCard title="Units Consumed" value="284,726 kWh" change="+5%" />
        <StatCard title="Avg Value" value="₹190" change="-2%" positive={false} />
      </div>

      {/* 🔹 Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        
        {/* Revenue */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-100 to-blue-50 hover:shadow-md transition">
          <div className="bg-white rounded-2xl p-4">
            <SplitAreaChart
  data={splitChartData}
  title="Revenue Growth"
  dataKey="uv"
/>
            {/* <RevenueChart data={data} size={CHART_HEIGHT} title="Revenue Trend" /> */}
          </div>
        </div>

        {/* Units */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-green-100 to-green-50 hover:shadow-md transition">
          <div className="bg-white rounded-2xl p-5">
           <ComposedAnalyticsChart
  data={composedData}
  size={CHART_HEIGHT}
  title="Revenue vs Usage Overview"
/>
            {/* <RevenueChart data={data} size={CHART_HEIGHT} title="Energy Consumption" /> */}
          </div>
        </div>

      </div>

      {/* 🔹 Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-5">
        
        {/* Transactions Chart */}
        <div className="xl:col-span-1 rounded-2xl p-[1px] bg-gradient-to-r from-purple-100 to-purple-50 hover:shadow-md transition">
          <div className="bg-white rounded-2xl p-4">
             <InteractiveAreaChart
  data={interactiveData}
  title="Revenue Interaction"
  dataKey="value"
  size={300}
  // onPointClick={(d) => console.log("Clicked:", d)}
/>
            {/* <RevenueChart data={data} size={CHART_HEIGHT} title="Transactions Trend" /> */}
          </div>
        </div>

        
       

      </div>

    </div>
  );
}