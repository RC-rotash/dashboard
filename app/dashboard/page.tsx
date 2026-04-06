
// // "use client";

// // import { useState, useEffect, useMemo } from "react";
// // import StatCard from "../componets/cards/StatCard";
// // import { useApi } from "../componets/api/apiService";

// // interface TransactionReport {
// //   charging_time_seconds: number;
// //   charger: string;
// //   total_sessions: number;
// //   charger_id: string;
// //   host_id: string;
// //   total_units: number;
// //   station_id: string;
// //   utilization_percentage: number;
// //   total_revenue: number;
// // }

// // type DateRange = "yesterday" | "week" | "month" | "custom";

// // export default function DashboardHomePage() {
// //   const { get } = useApi();

// //   const [reportData, setReportData] = useState<TransactionReport[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const [selectedTab, setSelectedTab] = useState<"all" | "active" | "inactive">("all");
  
// //   // Date filter states
// //   const [dateRange, setDateRange] = useState<DateRange>("custom");
// //   const [customStartDate, setCustomStartDate] = useState("2025-01-01");
// //   const [customEndDate, setCustomEndDate] = useState(() => {
// //     const today = new Date();
// //     return today.toISOString().split('T')[0];
// //   });
  
// //   // Temporary states for custom date picker
// //   const [tempStartDate, setTempStartDate] = useState("2025-01-01");
// //   const [tempEndDate, setTempEndDate] = useState(() => {
// //     const today = new Date();
// //     return today.toISOString().split('T')[0];
// //   });
  
// //   const [showCustomPicker, setShowCustomPicker] = useState(true);

// //   const [totalRevenue, setTotalRevenue] = useState(0);
// //   const [totalTransactions, setTotalTransactions] = useState(0);
// //   const [totalUnitsKwh, setTotalUnitsKwh] = useState(0);
// //   const [totalChargingTimeSeconds, setTotalChargingTimeSeconds] = useState(0);

// //   // ===== Helper: Get date range string for API =====
// //   const getDateRangeString = () => {
// //     const today = new Date();
// //     let startDate = "";
// //     let endDate = "";

// //     switch (dateRange) {
// //       case "yesterday":
// //         const yesterday = new Date(today);
// //         yesterday.setDate(today.getDate() - 1);
// //         startDate = yesterday.toISOString().split('T')[0];
// //         endDate = startDate;
// //         break;
// //       case "week":
// //         const weekAgo = new Date(today);
// //         weekAgo.setDate(today.getDate() - 7);
// //         startDate = weekAgo.toISOString().split('T')[0];
// //         endDate = today.toISOString().split('T')[0];
// //         break;
// //       case "month":
// //         const monthAgo = new Date(today);
// //         monthAgo.setMonth(today.getMonth() - 1);
// //         startDate = monthAgo.toISOString().split('T')[0];
// //         endDate = today.toISOString().split('T')[0];
// //         break;
// //       case "custom":
// //         startDate = customStartDate;
// //         endDate = customEndDate;
// //         break;
// //     }
// //     return { startDate, endDate };
// //   };

// //   // ===== Fetch =====
// //   const fetchReportData = async () => {
// //     try {
// //       setLoading(true);
      
// //       const { startDate, endDate } = getDateRangeString();
      
// //       if (!startDate || !endDate) {
// //         setError("Please select valid dates");
// //         setLoading(false);
// //         return;
// //       }

// //       const response = await get<any>(
// //         `/report?start_date=${startDate}&end_date=${endDate}`
// //       );

// //       const data = response?.data || [];

// //       setReportData(data);
// //       calculateSummary(data);
// //       setError(null);
// //     } catch (err) {
// //       console.error(err);
// //       setError("Failed to fetch dashboard data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Fetch when dateRange changes
// //   useEffect(() => {
// //     fetchReportData();
// //   }, [dateRange, customStartDate, customEndDate]);

// //   // ===== Summary =====
// //   const calculateSummary = (data: TransactionReport[]) => {
// //     setTotalRevenue(data.reduce((s, i) => s + i.total_revenue, 0));
// //     setTotalTransactions(data.reduce((s, i) => s + i.total_sessions, 0));
// //     setTotalUnitsKwh(data.reduce((s, i) => s + i.total_units, 0) / 1000);
// //     setTotalChargingTimeSeconds(
// //       data.reduce((s, i) => s + i.charging_time_seconds, 0)
// //     );
// //   };

// //   // ===== Active / Inactive =====
// //   const activeChargersList = useMemo(
// //     () =>
// //       reportData.filter(
// //         (i) => i.total_sessions > 0 || i.utilization_percentage > 0
// //       ),
// //     [reportData]
// //   );

// //   const inactiveChargersList = useMemo(
// //     () =>
// //       reportData.filter(
// //         (i) => i.total_sessions === 0 && i.utilization_percentage === 0
// //       ),
// //     [reportData]
// //   );

// //   const totalChargers = reportData.length;
// //   const activeCount = activeChargersList.length;
// //   const inactiveCount = inactiveChargersList.length;

// //   const filteredData = useMemo(() => {
// //     if (selectedTab === "active") return activeChargersList;
// //     if (selectedTab === "inactive") return inactiveChargersList;
// //     return reportData;
// //   }, [selectedTab, reportData, activeChargersList, inactiveChargersList]);

// //   // ===== Chart =====
// //   const composedChartData = useMemo(() => {
// //     return [...reportData]
// //       .sort((a, b) => b.total_revenue - a.total_revenue)
// //       .slice(0, 15)
// //       .map((item) => ({
// //         name:
// //           item.charger.length > 12
// //             ? item.charger.substring(0, 12) + "..."
// //             : item.charger,
// //         revenue: item.total_revenue,
// //         units: item.total_units / 1000,
// //         sessions: item.total_sessions,
// //       }));
// //   }, [reportData]);

// //   // ===== Formatters =====
// //   const formatRevenue = (v: number) => v.toLocaleString("en-IN");
// //   const formatUnits = (v: number) => `${v.toLocaleString("en-IN")} kWh`;

// //   const formatChargingTime = (sec: number) => {
// //     const h = Math.floor(sec / 3600);
// //     const m = Math.floor((sec % 3600) / 60);
// //     const s = sec % 60;
// //     return `${h}h ${m}m ${s}s`;
// //   };

// //   // Handle preset date selection
// //   const handlePresetSelect = (range: DateRange) => {
// //     setDateRange(range);
// //     setShowCustomPicker(false);
// //   };

// //   // Handle custom button click
// //   const handleCustomClick = () => {
// //     setDateRange("custom");
// //     setShowCustomPicker(true);
// //     setTempStartDate(customStartDate);
// //     setTempEndDate(customEndDate);
// //   };

// //   // Apply custom dates
// //   const handleApplyCustomDates = () => {
// //     if (tempStartDate && tempEndDate) {
// //       setCustomStartDate(tempStartDate);
// //       setCustomEndDate(tempEndDate);
// //       setShowCustomPicker(false);
// //     }
// //   };

// //   // ===== Loading =====
// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading dashboard data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ===== Error =====
// //   if (error) {
// //     return (
// //       <div className="text-center mt-10">
// //         <p className="text-red-500 mb-4">{error}</p>
// //         <button 
// //           onClick={fetchReportData}
// //           className="px-4 py-2 bg-[#0094FE] text-white rounded-lg hover:bg-[#0080d4]"
// //         >
// //           Retry
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">

   

// //       {/* Filter Section - Always Visible */}
// //       <div className=" mt-16 bg-gradient-to-r from-purple-50/80 via-blue-50/80 to-cyan-50/80 rounded-xl border border-purple-100/50 p-3 mt-4">
// //   <div className="flex flex-wrap items-center gap-2">
// //     {/* Filter Label */}
// //     <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-lg">
// //       <svg className="w-3.5 h-3.5 text-[#0094FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
// //       </svg>
// //       <span className="text-xs font-medium text-gray-600">Filter:</span>
// //     </div>

// //     {/* Yesterday Button */}
// //     <button
// //       onClick={() => handlePresetSelect("yesterday")}
// //       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
// //         dateRange === "yesterday"
// //           ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
// //           : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
// //       }`}
// //     >
// //       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //       </svg>
// //       <span>Yesterday</span>
// //     </button>

// //     {/* Week Button */}
// //     <button
// //       onClick={() => handlePresetSelect("week")}
// //       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
// //         dateRange === "week"
// //           ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
// //           : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
// //       }`}
// //     >
// //       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
// //       </svg>
// //       <span>7 Days</span>
// //     </button>

// //     {/* Month Button */}
// //     <button
// //       onClick={() => handlePresetSelect("month")}
// //       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
// //         dateRange === "month"
// //           ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
// //           : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
// //       }`}
// //     >
// //       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
// //       </svg>
// //       <span>30 Days</span>
// //     </button>

// //     {/* Custom Range Button */}
// //     <button
// //       onClick={handleCustomClick}
// //       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
// //         dateRange === "custom"
// //           ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
// //           : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
// //       }`}
// //     >
// //       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //       </svg>
// //       <span>Custom</span>
// //     </button>

// //     {/* Active Filter Indicator */}
// //     <div className="flex items-center gap-1.5 ml-1 px-2 py-1 bg-white/60 rounded-lg">
// //       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
// //       <span className="text-xs text-gray-500">Active:</span>
// //       <span className="text-xs font-medium text-gray-700">
// //         {dateRange === "yesterday" && "Yesterday"}
// //         {dateRange === "week" && "Last 7 Days"}
// //         {dateRange === "month" && "Last 30 Days"}
// //         {dateRange === "custom" && "Custom Range"}
// //       </span>
// //     </div>
// //   </div>

// //   {/* Custom Date Picker - Inline */}
// //   {dateRange === "custom" && showCustomPicker && (
// //     <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-purple-100/50">
// //       <div className="flex items-center gap-2">
// //         <span className="text-xs text-gray-500">From:</span>
// //         <input
// //           type="date"
// //           value={tempStartDate}
// //           onChange={(e) => setTempStartDate(e.target.value)}
// //           className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white"
// //         />
// //       </div>
// //       <div className="flex items-center gap-2">
// //         <span className="text-xs text-gray-500">To:</span>
// //         <input
// //           type="date"
// //           value={tempEndDate}
// //           onChange={(e) => setTempEndDate(e.target.value)}
// //           className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white"
// //         />
// //       </div>
// //       <button
// //         onClick={handleApplyCustomDates}
// //         className="px-3 py-1 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all flex items-center gap-1"
// //       >
// //         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //         </svg>
// //         Apply
// //       </button>
// //     </div>
// //   )}
// // </div>


// //       {/* Top Cards */}
// //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //         <StatCard
// //           title="Total Revenue"
// //           value={formatRevenue(totalRevenue)}
// //           variant="blue"
// //         />
// //         <StatCard
// //           title="Transactions"
// //           value={String(totalTransactions)}
// //           variant="orange"
// //         />
// //         <StatCard
// //           title="Units"
// //           value={formatUnits(totalUnitsKwh)}
// //           variant="purple"
// //         />
// //       </div>

// //       {/* Row 2 */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <StatCard
// //           variant="cyan"
// //           title="Total Charging Time"
// //           value={formatChargingTime(totalChargingTimeSeconds)}
// //         />

// //         {/* Tabs Card */}
// //         <div className="rounded-xl p-[1px] bg-gradient-to-r from-green-100 to-blue-50 shadow-md">
// //           <div className="rounded-xl p-4">
// //             <div className="flex items-center gap-2 mb-3">
// //               <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
// //               </svg>
// //               <p className="text-xs font-semibold text-gray-700">Chargers Overview</p>
// //             </div>

// //             <div className="flex justify-between text-xs mb-3">
// //               <span className="text-gray-600">Total: <strong className="text-gray-800">{totalChargers}</strong></span>
// //               <span className="text-green-600">Active: <strong>{activeCount}</strong></span>
// //               <span className="text-red-500">Inactive: <strong>{inactiveCount}</strong></span>
// //             </div>

// //             <div className="flex gap-2">
// //               {["all", "active", "inactive"].map((tab) => (
// //                 <button
// //                   key={tab}
// //                   onClick={() => setSelectedTab(tab as any)}
// //                   className={`flex-1 py-1.5 rounded-lg text-xs capitalize transition-all ${
// //                     selectedTab === tab
// //                       ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-md"
// //                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
// //                   }`}
// //                 >
// //                   {tab}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

      

      
// //       <div className="rounded-xl p-[1px] bg-gradient-to-r from-purple-50 to-blue-50 shadow-md">
// //         <div className=" rounded-xl p-4">
// //           <div className="flex items-center gap-2">
// //             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
// //             </svg>
// //             <p className="text-xs font-semibold text-gray-700">
// //               Chargers List ({selectedTab})
// //             </p>
// //           </div>

// //           <div className="overflow-x-auto bg-gradient-to-r from-purple-50 to-blue-50">
// //             <table className="w-full text-xs">
// //               <thead>
// //                 <tr className="border-b border-gray-200 text-gray-500 text-left">
// //                   <th className="py-2">Charger</th>
// //                   <th>Revenue</th>
// //                   <th>Sessions</th>
// //                   <th>Units (kWh)</th>
// //                   <th>Status</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {filteredData.map((item) => {
// //                   const isActive =
// //                     item.total_sessions > 0 ||
// //                     item.utilization_percentage > 0;

// //                   return (
// //                     <tr key={item.charger_id} className="border-b border-gray-100 transition-colors">
// //                       <td className="py-2 font-medium text-gray-700">{item.charger}</td>
// //                       <td className="text-gray-600">₹{formatRevenue(item.total_revenue)}</td>
// //                       <td className="text-gray-600">{item.total_sessions}</td>
// //                       <td className="text-gray-600">{(item.total_units / 1000).toFixed(1)}</td>
// //                       <td>
// //                         <span
// //                           className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
// //                             isActive
// //                               ? "bg-green-100 text-green-700"
// //                               : "bg-red-100 text-red-700"
// //                           }`}
// //                         >
// //                           {isActive ? (
// //                             <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
// //                               <circle cx="4" cy="4" r="3" />
// //                             </svg>
// //                           ) : (
// //                             <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
// //                               <circle cx="4" cy="4" r="3" />
// //                             </svg>
// //                           )}
// //                           {isActive ? "Active" : "Inactive"}
// //                         </span>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import StatCard from "../componets/cards/StatCard";
// import { useApi } from "../componets/api/apiService";

// interface TransactionReport {
//   charging_time_seconds: number;
//   charger: string;
//   total_sessions: number;
//   charger_id: string;
//   host_id: string;
//   total_units: number;
//   station_id: string;
//   utilization_percentage: number;
//   total_revenue: number;
// }

// type DateRange = "yesterday" | "week" | "month" | "custom";

// export default function DashboardHomePage() {
//   const { get } = useApi();

//   const [reportData, setReportData] = useState<TransactionReport[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedTab, setSelectedTab] = useState<"all" | "active" | "inactive">("all");
//   const [searchQuery, setSearchQuery] = useState("");
  
//   // Date filter states
//   const [dateRange, setDateRange] = useState<DateRange>("custom");
//   const [customStartDate, setCustomStartDate] = useState("2025-01-01");
//   const [customEndDate, setCustomEndDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   });
  
//   // Temporary states for custom date picker
//   const [tempStartDate, setTempStartDate] = useState("2025-01-01");
//   const [tempEndDate, setTempEndDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   });
  
//   const [showCustomPicker, setShowCustomPicker] = useState(true);

//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalTransactions, setTotalTransactions] = useState(0);
//   const [totalUnitsKwh, setTotalUnitsKwh] = useState(0);
//   const [totalChargingTimeSeconds, setTotalChargingTimeSeconds] = useState(0);

//   // ===== Helper: Get date range string for API =====
//   const getDateRangeString = () => {
//     const today = new Date();
//     let startDate = "";
//     let endDate = "";

//     switch (dateRange) {
//       case "yesterday":
//         const yesterday = new Date(today);
//         yesterday.setDate(today.getDate() - 1);
//         startDate = yesterday.toISOString().split('T')[0];
//         endDate = startDate;
//         break;
//       case "week":
//         const weekAgo = new Date(today);
//         weekAgo.setDate(today.getDate() - 7);
//         startDate = weekAgo.toISOString().split('T')[0];
//         endDate = today.toISOString().split('T')[0];
//         break;
//       case "month":
//         const monthAgo = new Date(today);
//         monthAgo.setMonth(today.getMonth() - 1);
//         startDate = monthAgo.toISOString().split('T')[0];
//         endDate = today.toISOString().split('T')[0];
//         break;
//       case "custom":
//         startDate = customStartDate;
//         endDate = customEndDate;
//         break;
//     }
//     return { startDate, endDate };
//   };

//   // ===== Fetch =====
//   const fetchReportData = async () => {
//     try {
//       setLoading(true);
      
//       const { startDate, endDate } = getDateRangeString();
      
//       if (!startDate || !endDate) {
//         setError("Please select valid dates");
//         setLoading(false);
//         return;
//       }

//       const response = await get<any>(
//         `/report?start_date=${startDate}&end_date=${endDate}`
//       );

//       const data = response?.data || [];

//       setReportData(data);
//       calculateSummary(data);
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch when dateRange changes
//   useEffect(() => {
//     fetchReportData();
//   }, [dateRange, customStartDate, customEndDate]);

//   // ===== Summary =====
//   const calculateSummary = (data: TransactionReport[]) => {
//     setTotalRevenue(data.reduce((s, i) => s + i.total_revenue, 0));
//     setTotalTransactions(data.reduce((s, i) => s + i.total_sessions, 0));
//     setTotalUnitsKwh(data.reduce((s, i) => s + i.total_units, 0) / 1000);
//     setTotalChargingTimeSeconds(
//       data.reduce((s, i) => s + i.charging_time_seconds, 0)
//     );
//   };

//   // ===== Active / Inactive with Search =====
//   const activeChargersList = useMemo(
//     () =>
//       reportData.filter(
//         (i) => i.total_sessions > 0 || i.utilization_percentage > 0
//       ),
//     [reportData]
//   );

//   const inactiveChargersList = useMemo(
//     () =>
//       reportData.filter(
//         (i) => i.total_sessions === 0 && i.utilization_percentage === 0
//       ),
//     [reportData]
//   );

//   const totalChargers = reportData.length;
//   const activeCount = activeChargersList.length;
//   const inactiveCount = inactiveChargersList.length;

//   // Apply tab filter first, then search filter
//   const tabFilteredData = useMemo(() => {
//     if (selectedTab === "active") return activeChargersList;
//     if (selectedTab === "inactive") return inactiveChargersList;
//     return reportData;
//   }, [selectedTab, reportData, activeChargersList, inactiveChargersList]);

//   // Apply search filter
//   const filteredData = useMemo(() => {
//     if (!searchQuery.trim()) return tabFilteredData;
    
//     const query = searchQuery.toLowerCase();
//     return tabFilteredData.filter(
//       (item) =>
//         item.charger.toLowerCase().includes(query) ||
//         item.charger_id.toLowerCase().includes(query) ||
//         item.station_id.toLowerCase().includes(query)
//     );
//   }, [tabFilteredData, searchQuery]);

//   // ===== Chart =====
//   const composedChartData = useMemo(() => {
//     return [...reportData]
//       .sort((a, b) => b.total_revenue - a.total_revenue)
//       .slice(0, 15)
//       .map((item) => ({
//         name:
//           item.charger.length > 12
//             ? item.charger.substring(0, 12) + "..."
//             : item.charger,
//         revenue: item.total_revenue,
//         units: item.total_units / 1000,
//         sessions: item.total_sessions,
//       }));
//   }, [reportData]);

//   // ===== Formatters =====
//   const formatRevenue = (v: number) => v.toLocaleString("en-IN");
//   const formatUnits = (v: number) => `${v.toLocaleString("en-IN")} kWh`;

//   const formatChargingTime = (sec: number) => {
//     const h = Math.floor(sec / 3600);
//     const m = Math.floor((sec % 3600) / 60);
//     const s = sec % 60;
//     return `${h}h ${m}m ${s}s`;
//   };

//   // Calculate battery percentage based on utilization
//   const getBatteryPercentage = (utilization: number) => {
//     return Math.min(100, Math.max(0, Math.floor(utilization)));
//   };

//   // Battery animation component
//   const BatteryIndicator = ({ percentage }: { percentage: number }) => {
//     const getBatteryColor = () => {
//       if (percentage >= 80) return "from-green-500 to-green-400";
//       if (percentage >= 50) return "from-yellow-500 to-yellow-400";
//       if (percentage >= 20) return "from-orange-500 to-orange-400";
//       return "from-red-500 to-red-400";
//     };

//     return (
//       <div className="flex items-center gap-1.5">
//         <div className="relative w-6 h-3 bg-gray-200 rounded-sm overflow-hidden">
//           <div 
//             className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getBatteryColor()} transition-all duration-500 ease-out`}
//             style={{ width: `${percentage}%` }}
//           >
//             <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
//           </div>
//         </div>
//         <div className="w-0.5 h-1.5 bg-gray-400 rounded-r"></div>
//         <span className="text-[10px] font-medium text-gray-600">{percentage}%</span>
//       </div>
//     );
//   };

//   // Handle preset date selection
//   const handlePresetSelect = (range: DateRange) => {
//     setDateRange(range);
//     setShowCustomPicker(false);
//   };

//   // Handle custom button click
//   const handleCustomClick = () => {
//     setDateRange("custom");
//     setShowCustomPicker(true);
//     setTempStartDate(customStartDate);
//     setTempEndDate(customEndDate);
//   };

//   // Apply custom dates
//   const handleApplyCustomDates = () => {
//     if (tempStartDate && tempEndDate) {
//       setCustomStartDate(tempStartDate);
//       setCustomEndDate(tempEndDate);
//       setShowCustomPicker(false);
//     }
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchQuery("");
//   };

//   // ===== Loading =====
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard data...</p>
//         </div>
//       </div>
//     );
//   }

//   // ===== Error =====
//   if (error) {
//     return (
//       <div className="text-center mt-10">
//         <p className="text-red-500 mb-4">{error}</p>
//         <button 
//           onClick={fetchReportData}
//           className="px-4 py-2 bg-[#0094FE] text-white rounded-lg hover:bg-[#0080d4]"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">

//       {/* Filter Section */}
//       <div className="mt-16 bg-gradient-to-r from-purple-50/80 via-blue-50/80 to-cyan-50/80 rounded-xl border border-purple-100/50 p-3">
//         <div className="flex flex-wrap items-center gap-2">
//           {/* Filter Label */}
//           <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-lg">
//             <svg className="w-3.5 h-3.5 text-[#0094FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//             </svg>
//             <span className="text-xs font-medium text-gray-600">Filter:</span>
//           </div>

//           {/* Yesterday Button */}
//           <button
//             onClick={() => handlePresetSelect("yesterday")}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
//               dateRange === "yesterday"
//                 ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
//                 : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//             }`}
//           >
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <span>Yesterday</span>
//           </button>

//           {/* Week Button */}
//           <button
//             onClick={() => handlePresetSelect("week")}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
//               dateRange === "week"
//                 ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
//                 : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//             }`}
//           >
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//             </svg>
//             <span>7 Days</span>
//           </button>

//           {/* Month Button */}
//           <button
//             onClick={() => handlePresetSelect("month")}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
//               dateRange === "month"
//                 ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
//                 : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//             }`}
//           >
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//             <span>30 Days</span>
//           </button>

//           {/* Custom Range Button */}
//           <button
//             onClick={handleCustomClick}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
//               dateRange === "custom"
//                 ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
//                 : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//             }`}
//           >
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <span>Custom</span>
//           </button>

//           {/* Active Filter Indicator */}
//           <div className="flex items-center gap-1.5 ml-1 px-2 py-1 bg-white/60 rounded-lg">
//             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-xs text-gray-500">Active:</span>
//             <span className="text-xs font-medium text-gray-700">
//               {dateRange === "yesterday" && "Yesterday"}
//               {dateRange === "week" && "Last 7 Days"}
//               {dateRange === "month" && "Last 30 Days"}
//               {dateRange === "custom" && "Custom Range"}
//             </span>
//           </div>
//         </div>

//         {/* Custom Date Picker - Inline */}
//         {dateRange === "custom" && showCustomPicker && (
//           <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-purple-100/50">
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-500">From:</span>
//               <input
//                 type="date"
//                 value={tempStartDate}
//                 onChange={(e) => setTempStartDate(e.target.value)}
//                 className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-500">To:</span>
//               <input
//                 type="date"
//                 value={tempEndDate}
//                 onChange={(e) => setTempEndDate(e.target.value)}
//                 className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white"
//               />
//             </div>
//             <button
//               onClick={handleApplyCustomDates}
//               className="px-3 py-1 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all flex items-center gap-1"
//             >
//               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//               Apply
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Top Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <StatCard
//           title="Total Revenue"
//           value={formatRevenue(totalRevenue)}
//           variant="blue"
//         />
//         <StatCard
//           title="Transactions"
//           value={String(totalTransactions)}
//           variant="orange"
//         />
//         <StatCard
//           title="Units"
//           value={formatUnits(totalUnitsKwh)}
//           variant="purple"
//         />
//       </div>

//       {/* Row 2 */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <StatCard
//           variant="cyan"
//           title="Total Charging Time"
//           value={formatChargingTime(totalChargingTimeSeconds)}
//         />

//         {/* Tabs Card */}
//         <div className="rounded-xl p-[1px] bg-gradient-to-r from-green-100 to-blue-50 shadow-md">
//           <div className="rounded-xl p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//               <p className="text-xs font-semibold text-gray-700">Chargers Overview</p>
//             </div>

//             <div className="flex justify-between text-xs mb-3">
//               <span className="text-gray-600">Total: <strong className="text-gray-800">{totalChargers}</strong></span>
//               <span className="text-green-600">Active: <strong>{activeCount}</strong></span>
//               <span className="text-red-500">Inactive: <strong>{inactiveCount}</strong></span>
//             </div>

//             <div className="flex gap-2">
//               {["all", "active", "inactive"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setSelectedTab(tab as any)}
//                   className={`flex-1 py-1.5 rounded-lg text-xs capitalize transition-all ${
//                     selectedTab === tab
//                       ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-md"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Section with Search */}
//       <div className="rounded-xl p-[1px] bg-gradient-to-r from-purple-50 to-blue-50 shadow-md">
//         <div className="rounded-xl p-4">
//           {/* Table Header with Search */}
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
//             <div className="flex items-center gap-2">
//               <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//               </svg>
//               <p className="text-xs font-semibold text-gray-700">
//                 Chargers List ({selectedTab}) • {filteredData.length} chargers
//               </p>
//             </div>

//             {/* Search Input */}
//             <div className="relative">
//               <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search by charger name, ID, or station..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-8 pr-8 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white w-64"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
//                 >
//                   <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-xs">
//               <thead>
//                 <tr className="border-b border-gray-200 text-gray-500 text-left">
//                   <th className="py-2">Charger</th>
//                   <th>Revenue</th>
//                   <th>Sessions</th>
//                   <th>Units (kWh)</th>
//                   <th>Utilization</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="text-center py-8 text-gray-400">
//                       No chargers found matching "{searchQuery}"
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((item) => {
//                     const isActive = item.total_sessions > 0 || item.utilization_percentage > 0;
//                     const batteryPercent = getBatteryPercentage(item.utilization_percentage);

//                     return (
//                       <tr key={item.charger_id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
//                         <td className="py-2 font-medium text-gray-700">
//                           <div className="flex flex-col">
//                             <span>{item.charger}</span>
//                             <span className="text-[10px] text-gray-400">{item.charger_id}</span>
//                           </div>
//                         </td>
//                         <td className="text-gray-600">₹{formatRevenue(item.total_revenue)}</td>
//                         <td className="text-gray-600">{item.total_sessions}</td>
//                         <td className="text-gray-600">{(item.total_units / 1000).toFixed(1)}</td>
//                         <td className="text-gray-600">
//                           {isActive ? (
//                             <BatteryIndicator percentage={batteryPercent} />
//                           ) : (
//                             <span className="text-[10px] text-gray-400">—</span>
//                           )}
//                         </td>
//                         <td>
//                           <span
//                             className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
//                               isActive
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
//                             {isActive ? "Active" : "Inactive"}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "../componets/cards/StatCard";
import { useApi } from "../componets/api/apiService";

interface TransactionReport {
  charging_time_seconds: number;
  charger: string;
  total_sessions: number;
  charger_id: string;
  host_id: string;
  total_units: number;
  station_id: string;
  utilization_percentage: number;
  total_revenue: number;
}

type DateRange = "overall" | "yesterday" | "week" | "month" | "custom";

export default function DashboardHomePage() {
  const { get } = useApi();

  const [reportData, setReportData] = useState<TransactionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Date filter states
  const [dateRange, setDateRange] = useState<DateRange>("overall");
  const [customStartDate, setCustomStartDate] = useState("2025-01-01");
  const [customEndDate, setCustomEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  // Temporary states for custom date picker
  const [tempStartDate, setTempStartDate] = useState("2025-01-01");
  const [tempEndDate, setTempEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalUnitsKwh, setTotalUnitsKwh] = useState(0);
  const [totalChargingTimeSeconds, setTotalChargingTimeSeconds] = useState(0);
  const [overallUtilization, setOverallUtilization] = useState(0);

  // ===== Helper: Get date range string for API =====
  const getDateRangeString = () => {
    const today = new Date();
    let startDate = "";
    let endDate = "";

    switch (dateRange) {
      case "overall":
        // From Jan 1, 2025 to today
        startDate = "2025-01-01";
        endDate = today.toISOString().split('T')[0];
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = yesterday.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case "custom":
        startDate = customStartDate;
        endDate = customEndDate;
        break;
    }
    return { startDate, endDate };
  };

  // ===== Fetch =====
  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const { startDate, endDate } = getDateRangeString();
      
      if (!startDate || !endDate) {
        setError("Please select valid dates");
        setLoading(false);
        return;
      }

      // Always use date parameters for all filters including overall
      const response = await get<any>(
        `public/report?start_date=${startDate}&end_date=${endDate}`
      );

      const data = response?.data || [];

      setReportData(data);
      calculateSummary(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dateRange changes
  useEffect(() => {
    fetchReportData();
  }, [dateRange, customStartDate, customEndDate]);

  // ===== Summary with correct utilization calculation =====
  const calculateSummary = (data: TransactionReport[]) => {
    const revenue = data.reduce((s, i) => s + i.total_revenue, 0);
    const transactions = data.reduce((s, i) => s + i.total_sessions, 0);
    const totalWh = data.reduce((s, i) => s + i.total_units, 0);
    const totalKwh = totalWh / 1000;
    const totalSeconds = data.reduce((s, i) => s + i.charging_time_seconds, 0);
    
    setTotalRevenue(revenue);
    setTotalTransactions(transactions);
    setTotalUnitsKwh(totalKwh);
    setTotalChargingTimeSeconds(totalSeconds);
    
    // Calculate overall utilization correctly
    if (data.length > 0) {
      const avgUtilization = data.reduce((s, i) => s + i.utilization_percentage, 0) / data.length;
      setOverallUtilization(avgUtilization);
    } else {
      setOverallUtilization(0);
    }
  };

  // ===== Active / Inactive with Search =====
  const activeChargersList = useMemo(
    () =>
      reportData.filter(
        (i) => i.total_sessions > 0 || i.utilization_percentage > 0
      ),
    [reportData]
  );

  const inactiveChargersList = useMemo(
    () =>
      reportData.filter(
        (i) => i.total_sessions === 0 && i.utilization_percentage === 0
      ),
    [reportData]
  );

  const totalChargers = reportData.length;
  const activeCount = activeChargersList.length;
  const inactiveCount = inactiveChargersList.length;

  // Apply tab filter first, then search filter
  const tabFilteredData = useMemo(() => {
    if (selectedTab === "active") return activeChargersList;
    if (selectedTab === "inactive") return inactiveChargersList;
    return reportData;
  }, [selectedTab, reportData, activeChargersList, inactiveChargersList]);

  // Apply search filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tabFilteredData;
    
    const query = searchQuery.toLowerCase();
    return tabFilteredData.filter(
      (item) =>
        item.charger.toLowerCase().includes(query) ||
        item.charger_id.toLowerCase().includes(query) ||
        item.station_id.toLowerCase().includes(query)
    );
  }, [tabFilteredData, searchQuery]);

  // ===== Formatters =====
  const formatRevenue = (v: number) => v.toLocaleString("en-IN");
  const formatUnits = (v: number) => `${v.toLocaleString("en-IN")} kWh`;

  const formatChargingTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Calculate battery percentage based on utilization (max 100%)
  const getBatteryPercentage = (utilization: number) => {
    return Math.min(100, Math.max(0, Math.floor(utilization)));
  };

  // Format utilization for display
  const formatUtilization = (utilization: number) => {
    return `${utilization.toFixed(1)}%`;
  };

  // Battery animation component
  const BatteryIndicator = ({ percentage }: { percentage: number }) => {
    const getBatteryColor = () => {
      if (percentage >= 80) return "from-green-500 to-green-400";
      if (percentage >= 50) return "from-yellow-500 to-yellow-400";
      if (percentage >= 20) return "from-orange-500 to-orange-400";
      return "from-red-500 to-red-400";
    };

    return (
      <div className="flex items-center gap-1.5">
        <div className="relative w-8 h-3 bg-gray-200 rounded-sm overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getBatteryColor()} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
       
      </div>
    );
  };

  // Handle preset date selection
  const handlePresetSelect = (range: DateRange) => {
    setDateRange(range);
    setShowCustomPicker(false);
  };

  // Handle custom button click
  const handleCustomClick = () => {
    setDateRange("custom");
    setShowCustomPicker(true);
    setTempStartDate(customStartDate);
    setTempEndDate(customEndDate);
  };

  // Apply custom dates
  const handleApplyCustomDates = () => {
    if (tempStartDate && tempEndDate) {
      setCustomStartDate(tempStartDate);
      setCustomEndDate(tempEndDate);
      setShowCustomPicker(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Get date range display text
  const getDateRangeDisplay = () => {
    switch (dateRange) {
      case "overall": return "Jan 1, 2025 - Today";
      case "yesterday": return "Yesterday";
      case "week": return "Last 7 Days";
      case "month": return "Last 30 Days";
      case "custom": return `${customStartDate} to ${customEndDate}`;
      default: return "";
    }
  };

  // ===== Loading =====
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // ===== Error =====
  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchReportData}
          className="px-4 py-2 bg-[#0094FE] text-white rounded-lg hover:bg-[#0080d4]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">

      {/* Filter Section */}
      <div className="mt-16 bg-gradient-to-r from-purple-50/80 via-blue-50/80 to-cyan-50/80 rounded-xl border border-purple-100/50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Label */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-lg">
            <svg className="w-3.5 h-3.5 text-[#0094FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-xs font-medium text-gray-600">Filter:</span>
          </div>

          {/* Overall Button */}
          <button
            onClick={() => handlePresetSelect("overall")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
              dateRange === "overall"
                ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M4 20L20 4" />
            </svg>
            <span>Overall</span>
          </button>

          {/* Yesterday Button */}
          <button
            onClick={() => handlePresetSelect("yesterday")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
              dateRange === "yesterday"
                ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Yesterday</span>
          </button>

          {/* Week Button */}
          <button
            onClick={() => handlePresetSelect("week")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
              dateRange === "week"
                ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>7 Days</span>
          </button>

          {/* Month Button */}
          <button
            onClick={() => handlePresetSelect("month")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
              dateRange === "month"
                ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>30 Days</span>
          </button>

          {/* Custom Range Button */}
          <button
            onClick={handleCustomClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${
              dateRange === "custom"
                ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Custom</span>
          </button>

          {/* Active Filter Indicator */}
          <div className="flex items-center gap-1.5 ml-1 px-2 py-1 bg-white/60 rounded-lg">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Active:</span>
            <span className="text-xs font-medium text-gray-700">
              {getDateRangeDisplay()}
            </span>
          </div>
        </div>

        {/* Custom Date Picker - Inline */}
        {dateRange === "custom" && showCustomPicker && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-purple-100/50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">From:</span>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">To:</span>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white"
              />
            </div>
            <button
              onClick={handleApplyCustomDates}
              className="px-3 py-1 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${formatRevenue(totalRevenue)}`}
          variant="blue"
        />
        <StatCard
          title="Transactions"
          value={String(totalTransactions)}
          variant="orange"
        />
        <StatCard
          title="Units"
          value={formatUnits(totalUnitsKwh)}
          variant="purple"
        />
        <StatCard
          title="Overall Utilization"
          value={formatUtilization(overallUtilization)}
          variant="cyan"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          variant="green"
          title="Total Charging Time"
          value={formatChargingTime(totalChargingTimeSeconds)}
        />

        {/* Tabs Card */}
        <div className="rounded-xl p-[1px] bg-gradient-to-r from-green-100 to-blue-50 shadow-md">
          <div className="rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-xs font-semibold text-gray-700">Chargers Overview</p>
            </div>

            <div className="flex justify-between text-xs mb-3">
              <span className="text-gray-600">Total: <strong className="text-gray-800">{totalChargers}</strong></span>
              <span className="text-green-600">Active: <strong>{activeCount}</strong></span>
              <span className="text-red-500">Inactive: <strong>{inactiveCount}</strong></span>
            </div>

            <div className="flex gap-2">
              {["all", "active", "inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as any)}
                  className={`flex-1 py-1.5 rounded-lg text-xs capitalize transition-all ${
                    selectedTab === tab
                      ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section with Search */}
      <div className="rounded-xl p-[1px] bg-gradient-to-r from-purple-50 to-blue-50 shadow-md">
        <div className="rounded-xl p-4">
          {/* Table Header with Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <p className="text-xs font-semibold text-gray-700">
                Chargers List ({selectedTab}) • {filteredData.length} chargers
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by charger name, ID, or station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white w-64"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                >
                  <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-left">
                  <th className="">Charger</th>
                  <th className="px-2">Revenue</th>
                  <th className="px-2">Sessions</th>
                  <th className="px-2">Units</th>
                  <th className="px-2">Utilization</th>
                  <th className="px-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No chargers found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const isActive = item.total_sessions > 0 || item.utilization_percentage > 0;
                    const batteryPercent = getBatteryPercentage(item.utilization_percentage);

                    return (
                      <tr key={item.charger_id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                        <td className="py-2 font-medium text-gray-700">
                          <div className="flex flex-col">
                            <span>{item.charger}</span>
                            <span className="text-[10px] text-gray-400">{item.charger_id}</span>
                          </div>
                        </td>
                        <td className="text-gray-600">₹{formatRevenue(item.total_revenue)}</td>
                        <td className="text-gray-600 pl-4 pr-4">{item.total_sessions}</td>
                        <td className="text-gray-600">{(item.total_units / 1000).toFixed(1)}</td>
                        <td className="text-gray-600 pl-2">
                          {isActive ? (
                            <div className="flex flex-row gap-1">
                              <BatteryIndicator percentage={batteryPercent} />
                              <span className="text-[9px] text-gray-400">{formatUtilization(item.utilization_percentage)}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400">—</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`inline-flex  items-center gap-1 text-xs px-2 py-1 rounded-full ${
                              isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}