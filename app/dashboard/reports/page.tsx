

// // "use client";

// // import { useApi } from "@/app/componets/api/apiService";
// // import { useState, useEffect } from "react";
// // import { Download } from "lucide-react";
// // import DashboardHeader from "@/app/componets/DashboardHeader";

// // interface ChargerData {
// //   sno: number;
// //   name: string;
// //   sessions: number;
// //   duration: string;
// //   amount: number;
// //   units: number;
// //   percentage: number;
// //   installDate: string;
// //   chargerId?: string;
// //   group?: string;
// //   power_output?: string;
// // }

// // interface GroupAssignment {
// //   id: string;
// //   chargerId: string;
// //   installDate: string;
// //   group: string;
// //   createdAt: string;
// // }

// // interface Charger {
// //   id: string;
// //   name: string;
// //   power_output: string;
// //   property_id: string;
// // }

// // interface ReportData {
// //   charger: string;
// //   charger_id: string;
// //   total_revenue: number;
// //   total_units: number;
// //   charging_time_seconds: number;
// //   utilization_percentage: number;
// //   total_sessions: number;
// // }

// // type TimeFilter = "yesterday" | "lastWeek" | "lastMonth";

// // export default function DailyTransactionsReport() {
// //   const { get, post } = useApi();

// //   const [timeFilter, setTimeFilter] = useState<TimeFilter>("lastMonth");
// //   const [loading, setLoading] = useState(true);

// //   const [standaloneData, setStandaloneData] = useState<ChargerData[]>([]);
// //   const [highwayData, setHighwayData] = useState<ChargerData[]>([]);
// //   const [noidaHubData, setNoidaHubData] = useState<ChargerData[]>([]);
// //   const [rwaData, setRwaData] = useState<ChargerData[]>([]);
// //   const [unassignedData, setUnassignedData] = useState<ChargerData[]>([]);

// //   const fetchAllData = async (startDate: string, endDate: string) => {
// //     try {
// //       setLoading(true);

// //       // 1. Fetch ALL chargers
// //       const chargerResponse = await get<any>("/public/charger-list");
// //       const allChargers: Charger[] = chargerResponse?.data || chargerResponse || [];
// //       console.log("Total chargers from API:", allChargers.length);

// //       // 2. Fetch group assignments
// //       const groupResponse = await post<any>("/admin/group-list");
// //       const groupData = groupResponse?.data || groupResponse || [];

// //       // Create maps for group and install date
// //       const groupMap = new Map<string, string>();
// //       const installDateMap = new Map<string, string>();

// //       groupData.forEach((group: GroupAssignment) => {
// //         if (group.chargerId && group.group) {
// //           groupMap.set(group.chargerId, group.group);
// //           if (group.installDate) {
// //             installDateMap.set(group.chargerId, formatInstallDate(group.installDate));
// //           }
// //         }
// //       });

// //       // 3. Fetch report data
// //       const reportResponse = await get<any>(`/public/report?start_date=${startDate}&end_date=${endDate}`);
// //       const reportData = reportResponse?.data || reportResponse || [];

// //       // Create a map for report data by charger_id
// //       const reportMap = new Map<string, ReportData>();
// //       reportData.forEach((item: ReportData) => {
// //         reportMap.set(item.charger_id, item);
// //       });
// // // In fetchAllData function, after getting reportData
// // console.log("Raw report data sample:", reportData.slice(0, 3).map(item => ({
// //   charger_id: item.charger_id,
// //   charger: item.charger,
// //   utilization_percentage: item.utilization_percentage,
// //   total_units: item.total_units,
// //   charging_time_seconds: item.charging_time_seconds,
// //   total_sessions: item.total_sessions
// // })));
// //       // 4. Process ALL chargers
// //       const standalone: ChargerData[] = [];
// //       const highway: ChargerData[] = [];
// //       const noidaHub: ChargerData[] = [];
// //       const rwa: ChargerData[] = [];
// //       const unassigned: ChargerData[] = [];

// //       allChargers.forEach((charger: Charger, index: number) => {
// //         const chargerGroup = groupMap.get(charger.id) || "";
// //         const reportItem = reportMap.get(charger.id);
// //         const installDate = installDateMap.get(charger.id) || "Not Set";

// //         const sessions = reportItem?.total_sessions || 0;
// //         const chargingSeconds = reportItem?.charging_time_seconds || 0;
// //         const revenue = Math.round(reportItem?.total_revenue || 0);
// //         const units = Math.round((reportItem?.total_units || 0) / 1000);
// //         const utilization =reportItem?.utilization_percentage || 0;

// //         const chargerInfo: ChargerData = {
// //           sno: index + 1,
// //           name: charger.name,
// //           sessions: sessions,
// //           duration: formatSeconds(chargingSeconds),
// //           amount: revenue,
// //           units: units,
// //           percentage: utilization,
// //           installDate: installDate,
// //           chargerId: charger.id,
// //           group: chargerGroup,
// //           power_output: charger.power_output
// //         };

// //         // Categorize based ONLY on group (AC/DC doesn't matter)
// //         if (chargerGroup === "HIGHWAY") {
// //           highway.push(chargerInfo);
// //         } else if (chargerGroup === "NOIDA135HUB") {
// //           noidaHub.push(chargerInfo);
// //         } else if (chargerGroup === "RWA") {
// //           rwa.push(chargerInfo);
// //         } else if (chargerGroup === "STANDALONE") {
// //           standalone.push(chargerInfo);
// //         } else {
// //           // No group assigned
// //           unassigned.push(chargerInfo);
// //         }
// //       });

// //       console.log("Standalone:", standalone.length);
// //       console.log("Highway:", highway.length);
// //       console.log("Noida Hub:", noidaHub.length);
// //       console.log("RWA:", rwa.length);
// //       console.log("Unassigned:", unassigned.length);
// //       console.log("Total:", standalone.length + highway.length + noidaHub.length + rwa.length + unassigned.length);

// //       // Sort by amount
// //       standalone.sort((a, b) => b.amount - a.amount);
// //       highway.sort((a, b) => b.amount - a.amount);
// //       noidaHub.sort((a, b) => b.amount - a.amount);
// //       rwa.sort((a, b) => b.amount - a.amount);
// //       unassigned.sort((a, b) => b.amount - a.amount);

// //       // Update sno
// //       standalone.forEach((item, idx) => item.sno = idx + 1);
// //       highway.forEach((item, idx) => item.sno = idx + 1);
// //       noidaHub.forEach((item, idx) => item.sno = idx + 1);
// //       rwa.forEach((item, idx) => item.sno = idx + 1);
// //       unassigned.forEach((item, idx) => item.sno = idx + 1);

// //       setStandaloneData(standalone);
// //       setHighwayData(highway);
// //       setNoidaHubData(noidaHub);
// //       setRwaData(rwa);
// //       setUnassignedData(unassigned);

// //     } catch (err) {
// //       console.error("Error fetching data:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const formatInstallDate = (dateString: string) => {
// //     if (!dateString) return "Not Set";
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString('en-IN', {
// //       day: '2-digit',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   const formatSeconds = (seconds: number) => {
// //     if (!seconds || seconds === 0) return "0h 0m";
// //     const hours = Math.floor(seconds / 3600);
// //     const minutes = Math.floor((seconds % 3600) / 60);
// //     return `${hours}h ${minutes}m`;
// //   };

// // const getDateRange = (filter: TimeFilter) => {
// //   const today = new Date();

// //   // ✅ LOCAL formatter (NO timezone issue)
// //   const formatLocal = (d: Date) => {
// //     const year = d.getFullYear();
// //     const month = String(d.getMonth() + 1).padStart(2, "0");
// //     const day = String(d.getDate()).padStart(2, "0");
// //     return `${year}-${month}-${day}`;
// //   };

// //   switch (filter) {

// //     case "yesterday": {
// //       const y = new Date(today);
// //       y.setDate(today.getDate() - 1);

// //       return {
// //         startDate: formatLocal(y),
// //         endDate: formatLocal(y),
// //       };
// //     }

// //     case "lastWeek": {
// //       // ✅ Monday to Sunday (previous week)
// //       const currentDay = today.getDay(); // 0 = Sunday
// //       const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

// //       const currentWeekMonday = new Date(today);
// //       currentWeekMonday.setDate(today.getDate() - daysSinceMonday);

// //       const lastWeekMonday = new Date(currentWeekMonday);
// //       lastWeekMonday.setDate(currentWeekMonday.getDate() - 7);

// //       const lastWeekSunday = new Date(currentWeekMonday);
// //       lastWeekSunday.setDate(currentWeekMonday.getDate() - 1);

// //       return {
// //         startDate: formatLocal(lastWeekMonday),
// //         endDate: formatLocal(lastWeekSunday),
// //       };
// //     }

// //     case "lastMonth": {
// //       // ✅ FULL previous calendar month (auto 28/30/31 handle)
// //       const firstDayLastMonth = new Date(
// //         today.getFullYear(),
// //         today.getMonth() - 1,
// //         1
// //       );

// //       const lastDayLastMonth = new Date(
// //         today.getFullYear(),
// //         today.getMonth(),
// //         0
// //       );

// //       return {
// //         startDate: formatLocal(firstDayLastMonth),
// //         endDate: formatLocal(lastDayLastMonth),
// //       };
// //     }
// //   }

// //   // ✅ fallback = today
// //   return {
// //     startDate: formatLocal(today),
// //     endDate: formatLocal(today),
// //   };
// // };

// //   const handleFilterChange = (filter: TimeFilter) => {
// //     setTimeFilter(filter);
// //     const { startDate, endDate } = getDateRange(filter);
// //     fetchAllData(startDate, endDate);
// //   };

// //   useEffect(() => {
// //     const { startDate, endDate } = getDateRange("lastMonth");
// //     fetchAllData(startDate, endDate);
// //   }, []);

// //   // Export single table to CSV
// //   const exportTableToCSV = (title: string, data: ChargerData[]) => {
// //     if (data.length === 0) {
// //       alert(`No data available for ${title}`);
// //       return;
// //     }

// //     const headers = ["S.No", "Charger Name", "Install Date", "Sessions", "Duration", "Amount (₹)", "Units (kWh)", "Utilization %"];
// //     const rows = data.map((c) => [
// //       c.sno, 
// //       c.name, 
// //       c.installDate, 
// //       c.sessions, 
// //       c.duration, 
// //       c.amount, 
// //       c.units, 
// //       `${c.percentage}%`
// //     ]);
    
// //     // Add total row
// //     const totals = {
// //       sessions: data.reduce((sum, d) => sum + d.sessions, 0),
// //       amount: data.reduce((sum, d) => sum + d.amount, 0),
// //       units: data.reduce((sum, d) => sum + d.units, 0)
// //     };
    
// //     rows.push(["TOTAL", "", "", totals.sessions, "", totals.amount, totals.units, ""]);
    
// //     const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
// //     const blob = new Blob([csv], { type: "text/csv" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = `${title}-${getFilterLabel()}.csv`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   // Export all tables to CSV
// //   const exportAllToCSV = () => {
// //     const allData = [...standaloneData, ...highwayData, ...noidaHubData, ...rwaData, ...unassignedData];
// //     if (allData.length === 0) {
// //       alert("No data available to export");
// //       return;
// //     }

// //     const headers = ["S.No", "Charger Name", "Group", "Install Date", "Sessions", "Duration", "Amount (₹)", "Units (kWh)", "Utilization %"];
// //     const rows = allData.map((c) => [
// //       c.sno, 
// //       c.name, 
// //       c.group || "Unassigned", 
// //       c.installDate, 
// //       c.sessions, 
// //       c.duration, 
// //       c.amount, 
// //       c.units, 
// //       `${c.percentage}%`
// //     ]);
    
// //     const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
// //     const blob = new Blob([csv], { type: "text/csv" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = `daily-report-${getFilterLabel()}.csv`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   const getFilterLabel = () => {
// //     switch (timeFilter) {
// //       case "yesterday": return "Yesterday";
// //       case "lastWeek": return "Last Week";
// //       case "lastMonth": return "Last Month";
// //     }
// //   };

// //   const renderTable = (title: string, data: ChargerData[], gradientFrom: string, gradientTo: string) => {
// //     if (data.length === 0) return null;

// //     const totals = {
// //       sessions: data.reduce((sum, d) => sum + d.sessions, 0),
// //       amount: data.reduce((sum, d) => sum + d.amount, 0),
// //       units: data.reduce((sum, d) => sum + d.units, 0)
// //     };

// //     return (
// //       <div className="mb-8">
// //         <div className="flex justify-between items-center mb-2">
// //           <h3 className="text-base font-semibold text-gray-700">{title} ({data.length})</h3>
// //           <button
// //             onClick={() => exportTableToCSV(title, data)}
// //             className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-sm"
// //           >
// //             <Download size={12} />
// //           </button>
// //         </div>
// //         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
// //           <div className="overflow-x-auto">
// //             <table className="w-full text-xs">
// //               <thead className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} border-b border-gray-200`}>
// //                 <tr className="text-left">
// //                   <th className="px-4 py-3 font-semibold text-gray-700 w-16">S.No</th>
// //                   <th className="px-4 py-3 font-semibold text-gray-700">Charger Name</th>
// //                   <th className="px-4 py-3 font-semibold text-gray-700 text-center w-28">Install Date</th>
// //                   <th className="px-4 py-3 font-semibold text-gray-700 text-center w-20">Sessions</th>
// //                   <th className="px-4 py-3 font-semibold text-gray-700 text-center w-24">Duration</th>
// //                   <th className="px-4 py-3 font-semibold text-gray-700 text-right w-28">Amount (₹)</th>
// //                   <th className="px-4 py-3 font-semibold text-gray-700 text-right w-28">Units (kWh)</th>
// //                   <th className="px-4 py-3 font-semibold text-gray-700 text-center w-28">Utilization %</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-100">
// //                 {data.map((charger) => (
// //                   <tr key={charger.sno} className="hover:bg-gray-50 transition-colors">
// //                     <td className="px-4 py-2 text-gray-500">{charger.sno}</td>
// //                     <td className="px-4 py-2 text-gray-700 max-w-[300px] truncate" title={charger.name}>
// //                       {charger.name}
// //                     </td>
// //                     <td className="px-4 py-2 text-center">
// //                       {charger.installDate}
// //                     </td>
// //                     <td className="px-4 py-2 text-center text-gray-600">{charger.sessions}</td>
// //                     <td className="px-4 py-2 text-center text-gray-500">{charger.duration}</td>
// //                     <td className="px-4 py-2 text-right font-medium text-gray-700">
// //                       ₹{charger.amount.toLocaleString()}
// //                     </td>
// //                     <td className="px-4 py-2 text-right text-gray-600">{charger.units.toLocaleString()}</td>
// //                     <td className="px-4 py-2 text-center">
// //                       <span className={`font-medium ${charger.percentage >= 4 ? "text-green-600" :
// //                           charger.percentage > 4 ? "text-red-600"  :
// //                               "text-red-600"
// //                         }`}>
// //                     {charger.percentage.toFixed(1)}%
// //                       </span>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //               <tfoot className="bg-gray-100 border-t border-gray-200 font-medium">
// //                 <tr>
// //                   <td colSpan={3} className="px-4 py-2 text-right text-gray-600">Total:</td>
// //                   <td className="px-4 py-2 text-center text-gray-800 font-semibold">{totals.sessions}</td>
// //                   <td className="px-4 py-2 text-center text-gray-500">-</td>
// //                   <td className="px-4 py-2 text-right text-gray-800 font-semibold">₹{totals.amount.toLocaleString()}</td>
// //                   <td className="px-4 py-2 text-right text-gray-800 font-semibold">{totals.units.toLocaleString()}</td>
// //                   <td className="px-4 py-2 text-center text-gray-500">-</td>
// //                 </tr>
// //               </tfoot>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-96 mt-16">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading report data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
// //       <DashboardHeader
// //   subtitle={`${getFilterLabel()} Report`}
// //   title={'Daily CMS Transactions Report'}
// // />
// //       <div className="w-full px-6 py-6 mt-16">
        

// //         <div className="flex gap-3 mb-6">
// //           <button
// //             onClick={() => handleFilterChange("yesterday")}
// //             className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${timeFilter === "yesterday"
// //                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
// //                 : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
// //               }`}
// //           >
// //             Yesterday
// //           </button>
// //           <button
// //             onClick={() => handleFilterChange("lastWeek")}
// //             className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${timeFilter === "lastWeek"
// //                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
// //                 : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
// //               }`}
// //           >
// //             Last Week
// //           </button>
// //           <button
// //             onClick={() => handleFilterChange("lastMonth")}
// //             className={`px-5 py-1 rounded-lg text-xs font-medium transition-all ${timeFilter === "lastMonth"
// //                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
// //                 : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
// //               }`}
// //           >
// //             Last Month
// //           </button>
// //           <button
// //             onClick={exportAllToCSV}
// //             className="px-5 text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-gradient-to-r from-blue-500 to-blue-600  rounded-lg  flex items-center gap-2"
// //           >
// //             <Download size={14} /> Export All Reports
// //           </button>
// //         </div>

// //         {/* Tables - Based ONLY on Group, not AC/DC */}
// //         {renderTable("Standalone Chargers", standaloneData, "from-green-100", "to-green-50")}
// //         {renderTable("Highway Chargers", highwayData, "from-purple-100", "to-purple-50")}
// //         {renderTable("Noida Hub Sector 135", noidaHubData, "from-blue-100", "to-blue-50")}
// //         {renderTable("RWA Chargers", rwaData, "from-orange-100", "to-orange-50")}
// //         {renderTable("Unassigned Chargers", unassignedData, "from-gray-100", "to-gray-50")}

// //         {standaloneData.length === 0 && highwayData.length === 0 &&
// //           noidaHubData.length === 0 && rwaData.length === 0 && unassignedData.length === 0 && (
// //             <div className="text-center py-12 bg-white rounded-lg">
// //               <p className="text-gray-500">No data found for selected date range</p>
// //             </div>
// //           )}
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import { useApi } from "@/app/componets/api/apiService";
// import { useState, useEffect } from "react";
// import { Download, ChevronDown, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
// import DashboardHeader from "@/app/componets/DashboardHeader";

// interface ChargerData {
//   sno: number;
//   name: string;
//   sessions: number;
//   duration: string;
//   amount: number;
//   units: number;
//   percentage: number;
//   installDate: string;
//   chargerId?: string;
//   group?: string;
//   power_output?: string;
// }

// interface GroupAssignment {
//   id: string;
//   chargerId: string;
//   installDate: string;
//   group: string;
//   createdAt: string;
// }

// interface Charger {
//   id: string;
//   name: string;
//   power_output: string;
//   property_id: string;
// }

// interface ReportData {
//   charger: string;
//   charger_id: string;
//   total_revenue: number;
//   total_units: number;
//   charging_time_seconds: number;
//   utilization_percentage: number;
//   total_sessions: number;
// }

// interface DailyData {
//   date: string;
//   sessions: number;
//   duration: string;
//   amount: number;
//   units: number;
//   utilization: number;
// }

// type TimeFilter = "yesterday" | "lastWeek" | "lastMonth";

// export default function DailyTransactionsReport() {
//   const { get, post } = useApi();

//   const [timeFilter, setTimeFilter] = useState<TimeFilter>("lastMonth");
//   const [loading, setLoading] = useState(true);
//   const [expandedCharger, setExpandedCharger] = useState<string | null>(null);
//   const [chargerDailyData, setChargerDailyData] = useState<Map<string, DailyData[]>>(new Map());
//   const [loadingDaily, setLoadingDaily] = useState<Map<string, boolean>>(new Map());

//   const [standaloneData, setStandaloneData] = useState<ChargerData[]>([]);
//   const [highwayData, setHighwayData] = useState<ChargerData[]>([]);
//   const [noidaHubData, setNoidaHubData] = useState<ChargerData[]>([]);
//   const [rwaData, setRwaData] = useState<ChargerData[]>([]);
//   const [unassignedData, setUnassignedData] = useState<ChargerData[]>([]);

//   const fetchAllData = async (startDate: string, endDate: string) => {
//     try {
//       setLoading(true);

//       // 1. Fetch ALL chargers
//       const chargerResponse = await get<any>("/public/charger-list");
//       const allChargers: Charger[] = chargerResponse?.data || chargerResponse || [];
//       console.log("Total chargers from API:", allChargers.length);

//       // 2. Fetch group assignments
//       const groupResponse = await post<any>("/admin/group-list");
//       const groupData = groupResponse?.data || groupResponse || [];

//       // Create maps for group and install date
//       const groupMap = new Map<string, string>();
//       const installDateMap = new Map<string, string>();

//       groupData.forEach((group: GroupAssignment) => {
//         if (group.chargerId && group.group) {
//           groupMap.set(group.chargerId, group.group);
//           if (group.installDate) {
//             installDateMap.set(group.chargerId, formatInstallDate(group.installDate));
//           }
//         }
//       });

//       // 3. Fetch report data
//       const reportResponse = await get<any>(`/public/report?start_date=${startDate}&end_date=${endDate}`);
//       const reportData = reportResponse?.data || reportResponse || [];

//       // Create a map for report data by charger_id
//       const reportMap = new Map<string, ReportData>();
//       reportData.forEach((item: ReportData) => {
//         reportMap.set(item.charger_id, item);
//       });

//       // 4. Process ALL chargers
//       const standalone: ChargerData[] = [];
//       const highway: ChargerData[] = [];
//       const noidaHub: ChargerData[] = [];
//       const rwa: ChargerData[] = [];
//       const unassigned: ChargerData[] = [];

//       allChargers.forEach((charger: Charger, index: number) => {
//         const chargerGroup = groupMap.get(charger.id) || "";
//         const reportItem = reportMap.get(charger.id);
//         const installDate = installDateMap.get(charger.id) || "Not Set";

//         const sessions = reportItem?.total_sessions || 0;
//         const chargingSeconds = reportItem?.charging_time_seconds || 0;
//         const revenue = Math.round(reportItem?.total_revenue || 0);
//         const units = Math.round((reportItem?.total_units || 0) / 1000);
//         const utilization = reportItem?.utilization_percentage || 0;

//         const chargerInfo: ChargerData = {
//           sno: index + 1,
//           name: charger.name,
//           sessions: sessions,
//           duration: formatSeconds(chargingSeconds),
//           amount: revenue,
//           units: units,
//           percentage: utilization,
//           installDate: installDate,
//           chargerId: charger.id,
//           group: chargerGroup,
//           power_output: charger.power_output
//         };

//         if (chargerGroup === "HIGHWAY") {
//           highway.push(chargerInfo);
//         } else if (chargerGroup === "NOIDA135HUB") {
//           noidaHub.push(chargerInfo);
//         } else if (chargerGroup === "RWA") {
//           rwa.push(chargerInfo);
//         } else if (chargerGroup === "STANDALONE") {
//           standalone.push(chargerInfo);
//         } else {
//           unassigned.push(chargerInfo);
//         }
//       });

//       // Sort by amount
//       standalone.sort((a, b) => b.amount - a.amount);
//       highway.sort((a, b) => b.amount - a.amount);
//       noidaHub.sort((a, b) => b.amount - a.amount);
//       rwa.sort((a, b) => b.amount - a.amount);
//       unassigned.sort((a, b) => b.amount - a.amount);

//       // Update sno
//       standalone.forEach((item, idx) => item.sno = idx + 1);
//       highway.forEach((item, idx) => item.sno = idx + 1);
//       noidaHub.forEach((item, idx) => item.sno = idx + 1);
//       rwa.forEach((item, idx) => item.sno = idx + 1);
//       unassigned.forEach((item, idx) => item.sno = idx + 1);

//       setStandaloneData(standalone);
//       setHighwayData(highway);
//       setNoidaHubData(noidaHub);
//       setRwaData(rwa);
//       setUnassignedData(unassigned);

//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch last 7 days data for a specific charger
//   const fetchChargerLast7Days = async (chargerId: string, chargerName: string) => {
//     if (chargerDailyData.has(chargerId)) {
//       setExpandedCharger(expandedCharger === chargerId ? null : chargerId);
//       return;
//     }

//     setLoadingDaily(prev => new Map(prev).set(chargerId, true));
//     setExpandedCharger(chargerId);

//     try {
//       const today = new Date();
//       const endDate = new Date(today);
//       const startDate = new Date(today);
//       startDate.setDate(today.getDate() - 7);

//       const formatLocal = (d: Date) => {
//         const year = d.getFullYear();
//         const month = String(d.getMonth() + 1).padStart(2, "0");
//         const day = String(d.getDate()).padStart(2, "0");
//         return `${year}-${month}-${day}`;
//       };

//       const response = await get<any>(`/public/report?start_date=${formatLocal(startDate)}&end_date=${formatLocal(endDate)}`);
//       const reportData = response?.data || response || [];
      
//       // Filter data for specific charger
//       const chargerReports = reportData.filter((item: ReportData) => item.charger_id === chargerId);
      
//       // Group by date (the API might return data for the period)
//       const dailyDataMap = new Map<string, DailyData>();
      
//       // Get last 7 days
//       for (let i = 6; i >= 0; i--) {
//         const date = new Date(today);
//         date.setDate(today.getDate() - i);
//         const dateStr = formatLocal(date);
//         const displayDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        
//         // Find report for this date (if API returns per-day data)
//         // Note: If API returns aggregated data for the period, this needs adjustment
//         const dayReport = chargerReports.find((r: any) => {
//           // If API has date field, use it; otherwise, we need to simulate or adjust
//           return r.date === dateStr;
//         });
        
//         dailyDataMap.set(dateStr, {
//           date: displayDate,
//           sessions: dayReport?.total_sessions || 0,
//           duration: formatSeconds(dayReport?.charging_time_seconds || 0),
//           amount: Math.round(dayReport?.total_revenue || 0),
//           units: Math.round((dayReport?.total_units || 0) / 1000),
//           utilization: dayReport?.utilization_percentage || 0
//         });
//       }
      
//       // If API returns aggregated data (no per-day breakdown), create trend data
//       // This shows the comparison between current period and previous period
//       const dailyData: DailyData[] = Array.from(dailyDataMap.values());
      
//       setChargerDailyData(prev => new Map(prev).set(chargerId, dailyData));
//     } catch (err) {
//       console.error("Error fetching daily data:", err);
//     } finally {
//       setLoadingDaily(prev => new Map(prev).set(chargerId, false));
//     }
//   };

//   const formatInstallDate = (dateString: string) => {
//     if (!dateString) return "Not Set";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatSeconds = (seconds: number) => {
//     if (!seconds || seconds === 0) return "0h 0m";
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   const getDateRange = (filter: TimeFilter) => {
//     const today = new Date();

//     const formatLocal = (d: Date) => {
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, "0");
//       const day = String(d.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     switch (filter) {
//       case "yesterday": {
//         const y = new Date(today);
//         y.setDate(today.getDate() - 1);
//         return { startDate: formatLocal(y), endDate: formatLocal(y) };
//       }

//       case "lastWeek": {
//         const currentDay = today.getDay();
//         const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
//         const currentWeekMonday = new Date(today);
//         currentWeekMonday.setDate(today.getDate() - daysSinceMonday);
//         const lastWeekMonday = new Date(currentWeekMonday);
//         lastWeekMonday.setDate(currentWeekMonday.getDate() - 7);
//         const lastWeekSunday = new Date(currentWeekMonday);
//         lastWeekSunday.setDate(currentWeekMonday.getDate() - 1);
//         return {
//           startDate: formatLocal(lastWeekMonday),
//           endDate: formatLocal(lastWeekSunday),
//         };
//       }

//       case "lastMonth": {
//         const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
//         return {
//           startDate: formatLocal(firstDayLastMonth),
//           endDate: formatLocal(lastDayLastMonth),
//         };
//       }
//     }

//     return { startDate: formatLocal(today), endDate: formatLocal(today) };
//   };

//   const handleFilterChange = (filter: TimeFilter) => {
//     setTimeFilter(filter);
//     const { startDate, endDate } = getDateRange(filter);
//     fetchAllData(startDate, endDate);
//     // Clear expanded data when filter changes
//     setExpandedCharger(null);
//     setChargerDailyData(new Map());
//   };

//   useEffect(() => {
//     const { startDate, endDate } = getDateRange("lastMonth");
//     fetchAllData(startDate, endDate);
//   }, []);

//   const exportTableToCSV = (title: string, data: ChargerData[]) => {
//     if (data.length === 0) {
//       alert(`No data available for ${title}`);
//       return;
//     }

//     const headers = ["S.No", "Charger Name", "Install Date", "Sessions", "Duration", "Amount (₹)", "Units (kWh)", "Utilization %"];
//     const rows = data.map((c) => [
//       c.sno, 
//       c.name, 
//       c.installDate, 
//       c.sessions, 
//       c.duration, 
//       c.amount, 
//       c.units, 
//       `${c.percentage.toFixed(1)}%`
//     ]);
    
//     const totals = {
//       sessions: data.reduce((sum, d) => sum + d.sessions, 0),
//       amount: data.reduce((sum, d) => sum + d.amount, 0),
//       units: data.reduce((sum, d) => sum + d.units, 0)
//     };
    
//     rows.push(["TOTAL", "", "", totals.sessions, "", totals.amount, totals.units, ""]);
    
//     const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${title}-${getFilterLabel()}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const exportAllToCSV = () => {
//     const allData = [...standaloneData, ...highwayData, ...noidaHubData, ...rwaData, ...unassignedData];
//     if (allData.length === 0) {
//       alert("No data available to export");
//       return;
//     }

//     const headers = ["S.No", "Charger Name", "Group", "Install Date", "Sessions", "Duration", "Amount (₹)", "Units (kWh)", "Utilization %"];
//     const rows = allData.map((c) => [
//       c.sno, 
//       c.name, 
//       c.group || "Unassigned", 
//       c.installDate, 
//       c.sessions, 
//       c.duration, 
//       c.amount, 
//       c.units, 
//       `${c.percentage.toFixed(1)}%`
//     ]);
    
//     const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `daily-report-${getFilterLabel()}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const getFilterLabel = () => {
//     switch (timeFilter) {
//       case "yesterday": return "Yesterday";
//       case "lastWeek": return "Last Week";
//       case "lastMonth": return "Last Month";
//     }
//   };

//   const getUtilizationColor = (percentage: number) => {
//     if (percentage >= 50) return "text-green-600";
//     if (percentage >= 20) return "text-yellow-600";
//     if (percentage >= 4) return "text-orange-500";
//     return "text-red-500";
//   };

//   const renderExpandedRow = (charger: ChargerData) => {
//     const dailyData = chargerDailyData.get(charger.chargerId!);
//     const isLoading = loadingDaily.get(charger.chargerId!);

//     if (isLoading) {
//       return (
//         <tr className="bg-gray-50">
//           <td colSpan={8} className="px-4 py-4 text-center">
//             <div className="flex items-center justify-center gap-2">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
//               <span className="text-xs text-gray-500">Loading last 7 days data...</span>
//             </div>
//           </td>
//         </tr>
//       );
//     }

//     if (!dailyData || dailyData.length === 0) {
//       return (
//         <tr className="bg-gray-50">
//           <td colSpan={8} className="px-4 py-4 text-center text-gray-400 text-xs">
//             No data available for last 7 days
//           </td>
//         </tr>
//       );
//     }

//     return (
//       <>
//         <tr className="bg-blue-50/30">
//           <td colSpan={8} className="px-4 py-2">
//             <div className="flex items-center gap-2 mb-2">
//               <TrendingUp className="w-3 h-3 text-blue-600" />
//               <span className="text-xs font-semibold text-blue-700">Last 7 Days Trend</span>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-xs">
//                 <thead>
//                   <tr className="border-b border-blue-200">
//                     <th className="px-2 py-1 text-left text-gray-600">Date</th>
//                     <th className="px-2 py-1 text-center text-gray-600">Sessions</th>
//                     <th className="px-2 py-1 text-center text-gray-600">Duration</th>
//                     <th className="px-2 py-1 text-right text-gray-600">Amount (₹)</th>
//                     <th className="px-2 py-1 text-right text-gray-600">Units (kWh)</th>
//                     <th className="px-2 py-1 text-center text-gray-600">Utilization</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dailyData.map((day, idx) => (
//                     <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="px-2 py-1.5 font-medium text-gray-700">{day.date}</td>
//                       <td className="px-2 py-1.5 text-center text-gray-600">{day.sessions}</td>
//                       <td className="px-2 py-1.5 text-center text-gray-500">{day.duration}</td>
//                       <td className="px-2 py-1.5 text-right font-medium text-gray-700">₹{day.amount.toLocaleString()}</td>
//                       <td className="px-2 py-1.5 text-right text-gray-600">{day.units.toLocaleString()}</td>
//                       <td className="px-2 py-1.5 text-center">
//                         <span className={`font-medium ${getUtilizationColor(day.utilization)}`}>
//                           {day.utilization.toFixed(1)}%
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </td>
//         </tr>
//         {/* Comparison Summary Row */}
//         {dailyData.length >= 2 && (
//           <tr className="bg-gray-100">
//             <td colSpan={8} className="px-4 py-2">
//               <div className="flex items-center justify-between text-xs">
//                 <div className="flex items-center gap-4">
//                   <span className="text-gray-600">Weekly Comparison:</span>
//                   <div className="flex items-center gap-1">
//                     <TrendingUp className="w-3 h-3 text-green-600" />
//                     <span className="text-green-600">
//                       Sessions: {dailyData.reduce((sum, d) => sum + d.sessions, 0)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <span className="text-gray-600">Revenue:</span>
//                     <span className="font-semibold text-blue-600">
//                       ₹{dailyData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <span className="text-gray-600">Units:</span>
//                     <span className="font-semibold text-purple-600">
//                       {dailyData.reduce((sum, d) => sum + d.units, 0).toLocaleString()} kWh
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </td>
//           </tr>
//         )}
//       </>
//     );
//   };

//   const renderTable = (title: string, data: ChargerData[], gradientFrom: string, gradientTo: string) => {
//     if (data.length === 0) return null;

//     const totals = {
//       sessions: data.reduce((sum, d) => sum + d.sessions, 0),
//       amount: data.reduce((sum, d) => sum + d.amount, 0),
//       units: data.reduce((sum, d) => sum + d.units, 0)
//     };

//     return (
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="text-base font-semibold text-gray-700">{title} ({data.length})</h3>
//           <button
//             onClick={() => exportTableToCSV(title, data)}
//             className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-sm"
//           >
//             <Download size={12} />
//           </button>
//         </div>
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full text-xs">
//               <thead className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} border-b border-gray-200`}>
//                 <tr className="text-left">
//                   <th className="px-4 py-3 font-semibold text-gray-700 w-10"></th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 w-16">S.No</th>
//                   <th className="px-4 py-3 font-semibold text-gray-700">Charger Name</th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 text-center w-28">Install Date</th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 text-center w-20">Sessions</th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 text-center w-24">Duration</th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 text-right w-28">Amount (₹)</th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 text-right w-28">Units (kWh)</th>
//                   <th className="px-4 py-3 font-semibold text-gray-700 text-center w-28">Utilization %</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {data.map((charger) => (
//                   <>
//                     <tr key={charger.sno} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fetchChargerLast7Days(charger.chargerId!, charger.name)}>
//                       <td className="px-4 py-2">
//                         {expandedCharger === charger.chargerId ? 
//                           <ChevronDown className="w-4 h-4 text-gray-500" /> : 
//                           <ChevronRight className="w-4 h-4 text-gray-500" />
//                         }
//                       </td>
//                       <td className="px-4 py-2 text-gray-500">{charger.sno}</td>
//                       <td className="px-4 py-2 text-gray-700 max-w-[300px] truncate" title={charger.name}>
//                         {charger.name}
//                       </td>
//                       <td className="px-4 py-2 text-center">
//                         {charger.installDate}
//                       </td>
//                       <td className="px-4 py-2 text-center text-gray-600">{charger.sessions}</td>
//                       <td className="px-4 py-2 text-center text-gray-500">{charger.duration}</td>
//                       <td className="px-4 py-2 text-right font-medium text-gray-700">
//                         ₹{charger.amount.toLocaleString()}
//                       </td>
//                       <td className="px-4 py-2 text-right text-gray-600">{charger.units.toLocaleString()}</td>
//                       <td className="px-4 py-2 text-center">
//                         <span className={`font-medium ${getUtilizationColor(charger.percentage)}`}>
//                           {charger.percentage.toFixed(1)}%
//                         </span>
//                       </td>
//                     </tr>
//                     {expandedCharger === charger.chargerId && renderExpandedRow(charger)}
//                   </>
//                 ))}
//               </tbody>
//               <tfoot className="bg-gray-100 border-t border-gray-200 font-medium">
//                 <tr>
//                   <td colSpan={4} className="px-4 py-2 text-right text-gray-600">Total:</td>
//                   <td className="px-4 py-2 text-center text-gray-800 font-semibold">{totals.sessions}</td>
//                   <td className="px-4 py-2 text-center text-gray-500">-</td>
//                   <td className="px-4 py-2 text-right text-gray-800 font-semibold">₹{totals.amount.toLocaleString()}</td>
//                   <td className="px-4 py-2 text-right text-gray-800 font-semibold">{totals.units.toLocaleString()}</td>
//                   <td className="px-4 py-2 text-center text-gray-500">-</td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96 mt-16">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading report data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
//       <DashboardHeader
//         subtitle={`${getFilterLabel()} Report`}
//         title={'Daily CMS Transactions Report'}
//       />
//       <div className="w-full px-6 py-6 mt-16">
//         <div className="flex gap-3 mb-6">
//           <button
//             onClick={() => handleFilterChange("yesterday")}
//             className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${timeFilter === "yesterday"
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
//                 : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
//               }`}
//           >
//             Yesterday
//           </button>
//           <button
//             onClick={() => handleFilterChange("lastWeek")}
//             className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${timeFilter === "lastWeek"
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
//                 : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
//               }`}
//           >
//             Last Week
//           </button>
//           <button
//             onClick={() => handleFilterChange("lastMonth")}
//             className={`px-5 py-1 rounded-lg text-xs font-medium transition-all ${timeFilter === "lastMonth"
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
//                 : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
//               }`}
//           >
//             Last Month
//           </button>
//           <button
//             onClick={exportAllToCSV}
//             className="px-5 text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center gap-2"
//           >
//             <Download size={14} /> Export All Reports
//           </button>
//         </div>

//         {renderTable("Standalone Chargers", standaloneData, "from-green-100", "to-green-50")}
//         {renderTable("Highway Chargers", highwayData, "from-purple-100", "to-purple-50")}
//         {renderTable("Noida Hub Sector 135", noidaHubData, "from-blue-100", "to-blue-50")}
//         {renderTable("RWA Chargers", rwaData, "from-orange-100", "to-orange-50")}
//         {renderTable("Unassigned Chargers", unassignedData, "from-gray-100", "to-gray-50")}

//         {standaloneData.length === 0 && highwayData.length === 0 &&
//           noidaHubData.length === 0 && rwaData.length === 0 && unassignedData.length === 0 && (
//             <div className="text-center py-12 bg-white rounded-lg">
//               <p className="text-gray-500">No data found for selected date range</p>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useApi } from "@/app/componets/api/apiService";
import React, { useState, useEffect } from "react";
import { Download, ChevronDown, ChevronRight, TrendingUp } from "lucide-react";
import DashboardHeader from "@/app/componets/DashboardHeader";

interface ChargerData {
  sno: number;
  name: string;
  sessions: number;
  duration: string;
  amount: number;
  units: number;
  percentage: number;
  installDate: string;
  chargerId?: string;
  group?: string;
  power_output?: string;
}

interface GroupAssignment {
  id: string;
  chargerId: string;
  installDate: string;
  group: string;
  createdAt: string;
}

interface Charger {
  id: string;
  name: string;
  power_output: string;
  property_id: string;
}

interface ReportData {
  charger: string;
  charger_id: string;
  total_revenue: number;
  total_units: number;
  charging_time_seconds: number;
  utilization_percentage: number;
  total_sessions: number;
}

interface DailyData {
  date: string;
  sessions: number;
  duration: string;
  amount: number;
  units: number;
  utilization: number;
}

type TimeFilter = "yesterday" | "lastWeek" | "lastMonth";

export default function DailyTransactionsReport() {
  const { get, post } = useApi();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("lastMonth");
  const [loading, setLoading] = useState(true);
  const [expandedCharger, setExpandedCharger] = useState<string | null>(null);
  const [chargerDailyData, setChargerDailyData] = useState<Map<string, DailyData[]>>(new Map());
  const [loadingDaily, setLoadingDaily] = useState<Map<string, boolean>>(new Map());

  const [standaloneData, setStandaloneData] = useState<ChargerData[]>([]);
  const [highwayData, setHighwayData] = useState<ChargerData[]>([]);
  const [noidaHubData, setNoidaHubData] = useState<ChargerData[]>([]);
  const [rwaData, setRwaData] = useState<ChargerData[]>([]);
  const [unassignedData, setUnassignedData] = useState<ChargerData[]>([]);

  const fetchAllData = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);

      // 1. Fetch ALL chargers
      const chargerResponse = await get<any>("/public/charger-list");
      const allChargers: Charger[] = chargerResponse?.data || chargerResponse || [];

      // 2. Fetch group assignments
      const groupResponse = await post<any>("/admin/group-list");
      const groupData = groupResponse?.data || groupResponse || [];

      // Create maps for group and install date
      const groupMap = new Map<string, string>();
      const installDateMap = new Map<string, string>();

      groupData.forEach((group: GroupAssignment) => {
        if (group.chargerId && group.group) {
          groupMap.set(group.chargerId, group.group);
          if (group.installDate) {
            installDateMap.set(group.chargerId, formatInstallDate(group.installDate));
          }
        }
      });

      // 3. Fetch report data
      const reportResponse = await get<any>(`/public/report?start_date=${startDate}&end_date=${endDate}`);
      const reportData = reportResponse?.data || reportResponse || [];

      // Create a map for report data by charger_id
      const reportMap = new Map<string, ReportData>();
      reportData.forEach((item: ReportData) => {
        reportMap.set(item.charger_id, item);
      });

      // 4. Process ALL chargers
      const standalone: ChargerData[] = [];
      const highway: ChargerData[] = [];
      const noidaHub: ChargerData[] = [];
      const rwa: ChargerData[] = [];
      const unassigned: ChargerData[] = [];

      allChargers.forEach((charger: Charger, index: number) => {
        const chargerGroup = groupMap.get(charger.id) || "";
        const reportItem = reportMap.get(charger.id);
        const installDate = installDateMap.get(charger.id) || "Not Set";

        const sessions = reportItem?.total_sessions || 0;
        const chargingSeconds = reportItem?.charging_time_seconds || 0;
        const revenue = Math.round(reportItem?.total_revenue || 0);
        const units = Math.round((reportItem?.total_units || 0) / 1000);
        const utilization = reportItem?.utilization_percentage || 0;

        const chargerInfo: ChargerData = {
          sno: index + 1,
          name: charger.name,
          sessions: sessions,
          duration: formatSeconds(chargingSeconds),
          amount: revenue,
          units: units,
          percentage: utilization,
          installDate: installDate,
          chargerId: charger.id,
          group: chargerGroup,
          power_output: charger.power_output
        };

        if (chargerGroup === "HIGHWAY") {
          highway.push(chargerInfo);
        } else if (chargerGroup === "NOIDA135HUB") {
          noidaHub.push(chargerInfo);
        } else if (chargerGroup === "RWA") {
          rwa.push(chargerInfo);
        } else if (chargerGroup === "STANDALONE") {
          standalone.push(chargerInfo);
        } else {
          unassigned.push(chargerInfo);
        }
      });

      // Sort by amount
      standalone.sort((a, b) => b.amount - a.amount);
      highway.sort((a, b) => b.amount - a.amount);
      noidaHub.sort((a, b) => b.amount - a.amount);
      rwa.sort((a, b) => b.amount - a.amount);
      unassigned.sort((a, b) => b.amount - a.amount);

      // Update sno
      standalone.forEach((item, idx) => item.sno = idx + 1);
      highway.forEach((item, idx) => item.sno = idx + 1);
      noidaHub.forEach((item, idx) => item.sno = idx + 1);
      rwa.forEach((item, idx) => item.sno = idx + 1);
      unassigned.forEach((item, idx) => item.sno = idx + 1);

      setStandaloneData(standalone);
      setHighwayData(highway);
      setNoidaHubData(noidaHub);
      setRwaData(rwa);
      setUnassignedData(unassigned);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch last 7 days data for a specific charger (makes 7 separate API calls)
  const fetchChargerLast7Days = async (chargerId: string, chargerName: string) => {
    // If already loaded, just toggle expand/collapse
    if (chargerDailyData.has(chargerId)) {
      setExpandedCharger(expandedCharger === chargerId ? null : chargerId);
      return;
    }

    setLoadingDaily(prev => new Map(prev).set(chargerId, true));
    setExpandedCharger(chargerId);

    try {
      const today = new Date();
      const formatLocal = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const dailyDataPromises = [];
      
      // Create 7 promises for each day (last 7 days)
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatLocal(date);
        const displayDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        
        // Make API call for this single day
        const promise = get<any>(`/public/report?start_date=${dateStr}&end_date=${dateStr}`)
          .then(response => {
            const data = response?.data || response || [];
            const dayData = data.find((item: any) => item.charger_id === chargerId);
            return {
              date: displayDate,
              fullDate: dateStr,
              sessions: dayData?.total_sessions || 0,
              duration: formatSeconds(dayData?.charging_time_seconds || 0),
              amount: Math.round(dayData?.total_revenue || 0),
              units: Math.round((dayData?.total_units || 0) / 1000),
              utilization: dayData?.utilization_percentage || 0
            };
          })
          .catch(err => {
            console.error(`Error fetching data for ${displayDate}:`, err);
            return {
              date: displayDate,
              fullDate: dateStr,
              sessions: 0,
              duration: "0h 0m",
              amount: 0,
              units: 0,
              utilization: 0
            };
          });
        
        dailyDataPromises.push(promise);
      }
      
      // Wait for all API calls to complete
      const dailyData = await Promise.all(dailyDataPromises);
      setChargerDailyData(prev => new Map(prev).set(chargerId, dailyData));
      
    } catch (err) {
      console.error("Error fetching daily data:", err);
    } finally {
      setLoadingDaily(prev => new Map(prev).set(chargerId, false));
    }
  };

  const formatInstallDate = (dateString: string) => {
    if (!dateString) return "Not Set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatSeconds = (seconds: number) => {
    if (!seconds || seconds === 0) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getDateRange = (filter: TimeFilter) => {
    const today = new Date();

    const formatLocal = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    switch (filter) {
      case "yesterday": {
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        return { startDate: formatLocal(y), endDate: formatLocal(y) };
      }

      case "lastWeek": {
        const currentDay = today.getDay();
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
        const currentWeekMonday = new Date(today);
        currentWeekMonday.setDate(today.getDate() - daysSinceMonday);
        const lastWeekMonday = new Date(currentWeekMonday);
        lastWeekMonday.setDate(currentWeekMonday.getDate() - 7);
        const lastWeekSunday = new Date(currentWeekMonday);
        lastWeekSunday.setDate(currentWeekMonday.getDate() - 1);
        return {
          startDate: formatLocal(lastWeekMonday),
          endDate: formatLocal(lastWeekSunday),
        };
      }

      case "lastMonth": {
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          startDate: formatLocal(firstDayLastMonth),
          endDate: formatLocal(lastDayLastMonth),
        };
      }
    }

    return { startDate: formatLocal(today), endDate: formatLocal(today) };
  };

  const handleFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
    const { startDate, endDate } = getDateRange(filter);
    fetchAllData(startDate, endDate);
    // Clear expanded data when filter changes
    setExpandedCharger(null);
    setChargerDailyData(new Map());
  };

  useEffect(() => {
    const { startDate, endDate } = getDateRange("lastMonth");
    fetchAllData(startDate, endDate);
  }, []);

  const exportTableToCSV = (title: string, data: ChargerData[]) => {
    if (data.length === 0) {
      alert(`No data available for ${title}`);
      return;
    }

    const headers = ["S.No", "Charger Name", "Install Date", "Sessions", "Duration", "Amount (₹)", "Units (kWh)", "Utilization %"];
    const rows = data.map((c) => [
      c.sno, 
      c.name, 
      c.installDate, 
      c.sessions, 
      c.duration, 
      c.amount, 
      c.units, 
      `${c.percentage.toFixed(1)}%`
    ]);
    
    const totals = {
      sessions: data.reduce((sum, d) => sum + d.sessions, 0),
      amount: data.reduce((sum, d) => sum + d.amount, 0),
      units: data.reduce((sum, d) => sum + d.units, 0)
    };
    
    rows.push(["TOTAL", "", "", totals.sessions, "", totals.amount, totals.units, ""]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}-${getFilterLabel()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllToCSV = () => {
    const allData = [...standaloneData, ...highwayData, ...noidaHubData, ...rwaData, ...unassignedData];
    if (allData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = ["S.No", "Charger Name", "Group", "Install Date", "Sessions", "Duration", "Amount (₹)", "Units (kWh)", "Utilization %"];
    const rows = allData.map((c) => [
      c.sno, 
      c.name, 
      c.group || "Unassigned", 
      c.installDate, 
      c.sessions, 
      c.duration, 
      c.amount, 
      c.units, 
      `${c.percentage.toFixed(1)}%`
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-report-${getFilterLabel()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilterLabel = () => {
    switch (timeFilter) {
      case "yesterday": return "Yesterday";
      case "lastWeek": return "Last Week";
      case "lastMonth": return "Last Month";
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 3.9) return "text-green-600";
    return "text-red-500";
  };

  const renderExpandedRow = (charger: ChargerData) => {
    const dailyData = chargerDailyData.get(charger.chargerId!);
    const isLoading = loadingDaily.get(charger.chargerId!);

    if (isLoading) {
      return (
        <tr key={`${charger.chargerId}-loading`} className="bg-gray-50">
          <td colSpan={9} className="px-4 py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-xs text-gray-500">Loading last 7 days data...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (!dailyData || dailyData.length === 0) {
      return (
        <tr key={`${charger.chargerId}-no-data`} className="bg-gray-50">
          <td colSpan={9} className="px-4 py-4 text-center text-gray-400 text-xs">
            No data available for last 7 days
          </td>
        </tr>
      );
    }

    const totalSessions = dailyData.reduce((sum, d) => sum + d.sessions, 0);
    const totalAmount = dailyData.reduce((sum, d) => sum + d.amount, 0);
    const totalUnits = dailyData.reduce((sum, d) => sum + d.units, 0);

    return (
      <>
        <tr key={`${charger.chargerId}-trend-header`} className="bg-blue-50/30">
          <td colSpan={9} className="px-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Last 7 Days Trend</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="px-2 py-1 text-left text-gray-600">Date</th>
                    <th className="px-2 py-1 text-center text-gray-600">Sessions</th>
                    <th className="px-2 py-1 text-center text-gray-600">Duration</th>
                    <th className="px-2 py-1 text-right text-gray-600">Amount (₹)</th>
                    <th className="px-2 py-1 text-right text-gray-600">Units (kWh)</th>
                    <th className="px-2 py-1 text-center text-gray-600">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyData.map((day, idx) => (
                    <tr key={`${charger.chargerId}-day-${idx}`} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-2 py-1.5 font-medium text-gray-700">{day.date}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">{day.sessions}</td>
                      <td className="px-2 py-1.5 text-center text-gray-500">{day.duration}</td>
                      <td className="px-2 py-1.5 text-right font-medium text-gray-700">₹{day.amount.toLocaleString()}</td>
                      <td className="px-2 py-1.5 text-right text-gray-600">{day.units.toLocaleString()}</td>
                      <td className="px-2 py-1.5 text-center">
                        <span className={`font-medium ${getUtilizationColor(day.utilization)}`}>
                          {day.utilization.toFixed(1)}%
                        </span>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           </td>
        </tr>
        <tr key={`${charger.chargerId}-summary`} className="bg-gray-100">
          <td colSpan={9} className="px-4 py-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Weekly Comparison:</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">
                    Sessions: {totalSessions}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold text-blue-600">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Units:</span>
                  <span className="font-semibold text-purple-600">
                    {totalUnits.toLocaleString()} kWh
                  </span>
                </div>
              </div>
            </div>
           </td>
        </tr>
      </>
    );
  };

  const renderTable = (title: string, data: ChargerData[], gradientFrom: string, gradientTo: string) => {
    if (data.length === 0) return null;

    const totals = {
      sessions: data.reduce((sum, d) => sum + d.sessions, 0),
      amount: data.reduce((sum, d) => sum + d.amount, 0),
      units: data.reduce((sum, d) => sum + d.units, 0)
    };

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold text-gray-700">{title} ({data.length})</h3>
          <button
            onClick={() => exportTableToCSV(title, data)}
            className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={12} />
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} border-b border-gray-200`}>
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700 w-10"></th>
                  <th className="px-4 py-3 font-semibold text-gray-700 w-16">S.No</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Charger Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center w-28">Install Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center w-20">Sessions</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center w-24">Duration</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right w-28">Amount (₹)</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right w-28">Units (kWh)</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center w-28">Utilization %</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((charger) => (
                  <React.Fragment key={charger.chargerId || charger.sno}>
                    <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fetchChargerLast7Days(charger.chargerId!, charger.name)}>
                      <td className="px-4 py-2">
                        {expandedCharger === charger.chargerId ? 
                          <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        }
                       </td>
                      <td className="px-4 py-2 text-gray-500">{charger.sno}</td>
                      <td className="px-4 py-2 text-gray-700 max-w-[300px] truncate" title={charger.name}>
                        {charger.name}
                       </td>
                      <td className="px-4 py-2 text-center">{charger.installDate}</td>
                      <td className="px-4 py-2 text-center text-gray-600">{charger.sessions}</td>
                      <td className="px-4 py-2 text-center text-gray-500">{charger.duration}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-700">
                        ₹{charger.amount.toLocaleString()}
                       </td>
                      <td className="px-4 py-2 text-right text-gray-600">{charger.units.toLocaleString()}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`font-medium ${getUtilizationColor(charger.percentage)}`}>
                          {charger.percentage.toFixed(1)}%
                        </span>
                       </td>
                    </tr>
                    {expandedCharger === charger.chargerId && renderExpandedRow(charger)}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 border-t border-gray-200 font-medium">
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-right text-gray-600">Total:</td>
                  <td className="px-4 py-2 text-center text-gray-800 font-semibold">{totals.sessions}</td>
                  <td className="px-4 py-2 text-center text-gray-500">-</td>
                  <td className="px-4 py-2 text-right text-gray-800 font-semibold">₹{totals.amount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-gray-800 font-semibold">{totals.units.toLocaleString()}</td>
                  <td className="px-4 py-2 text-center text-gray-500">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <DashboardHeader
        subtitle={`${getFilterLabel()} Report`}
        title={'Daily CMS Transactions Report'}
      />
      <div className="w-full px-6 py-6 mt-16">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleFilterChange("yesterday")}
            className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${timeFilter === "yesterday"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
              }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => handleFilterChange("lastWeek")}
            className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${timeFilter === "lastWeek"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
              }`}
          >
            Last Week
          </button>
          <button
            onClick={() => handleFilterChange("lastMonth")}
            className={`px-5 py-1 rounded-lg text-xs font-medium transition-all ${timeFilter === "lastMonth"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300"
              }`}
          >
            Last Month
          </button>
          <button
            onClick={exportAllToCSV}
            className="px-5 text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center gap-2"
          >
            <Download size={14} /> Export All Reports
          </button>
        </div>

        {renderTable("Standalone Chargers", standaloneData, "from-green-100", "to-green-50")}
        {renderTable("Highway Chargers", highwayData, "from-purple-100", "to-purple-50")}
        {renderTable("Noida Hub Sector 135", noidaHubData, "from-blue-100", "to-blue-50")}
        {renderTable("RWA Chargers", rwaData, "from-orange-100", "to-orange-50")}
        {renderTable("Unassigned Chargers", unassignedData, "from-gray-100", "to-gray-50")}

        {standaloneData.length === 0 && highwayData.length === 0 &&
          noidaHubData.length === 0 && rwaData.length === 0 && unassignedData.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No data found for selected date range</p>
            </div>
          )}
      </div>
    </div>
  );
}