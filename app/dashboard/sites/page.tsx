// "use client";

// import { useState, useRef, useEffect } from "react";
// import PieChartComponent from "@/app/componets/charts/PieChartComponent";
// import SimpleBarChart from "@/app/componets/charts/SimpleBarChart";
// import { useApi } from "@/app/componets/api/apiService";
// import DashboardHeader from "@/app/componets/DashboardHeader";

// // Weekdays for filter
// const weekdays = [
//   "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
// ];

// // Quick filters
// const quickFilters = ["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month"];

// // Types
// interface Station {
//   name: string;
//   id: string;
//   state: string;
//   host_id: string;
// }

// interface Charger {
//   property_id: string;
//   name: string;
//   power_output: string;
//   id: string;
// }

// interface Host {
//   name: string;
//   id: string;
// }

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

// export default function SitesPage() {
//   const [activeFilter, setActiveFilter] = useState("Last Week");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const { get } = useApi();

//   // Dropdown states
//   const [isHostFilterOpen, setIsHostFilterOpen] = useState(false);
//   const [isStationFilterOpen, setIsStationFilterOpen] = useState(false);
//   const [isChargerFilterOpen, setIsChargerFilterOpen] = useState(false);
//   const [isQuickFilterOpen, setIsQuickFilterOpen] = useState(false);
//   const [isWeekdaysOpen, setIsWeekdaysOpen] = useState(false);
//   const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

//   // Filter states
//   const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
//   const [selectedStations, setSelectedStations] = useState<string[]>([]);
//   const [selectedChargers, setSelectedChargers] = useState<string[]>([]);
//   const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
//   const [selectedQuickFilter, setSelectedQuickFilter] = useState("");
//   const [customStartDate, setCustomStartDate] = useState("");
//   const [customEndDate, setCustomEndDate] = useState("");

//   // API Data states
//   const [hosts, setHosts] = useState<Host[]>([]);
//   const [stations, setStations] = useState<Station[]>([]);
//   const [chargers, setChargers] = useState<Charger[]>([]);
//   const [reportData, setReportData] = useState<TransactionReport[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Search states - real-time filtering
//   const [hostSearch, setHostSearch] = useState("");
//   const [stationSearch, setStationSearch] = useState("");
//   const [chargerSearch, setChargerSearch] = useState("");

//   const hostFilterRef = useRef<HTMLDivElement>(null);
//   const stationFilterRef = useRef<HTMLDivElement>(null);
//   const chargerFilterRef = useRef<HTMLDivElement>(null);
//   const quickFilterRef = useRef<HTMLDivElement>(null);
//   const weekdaysRef = useRef<HTMLDivElement>(null);
//   const dateRangeRef = useRef<HTMLDivElement>(null);

//   // Helper function to format date as YYYY-MM-DD
//   const formatDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // Get start and end date for quick filters
//   const getDateRangeForFilter = (filter: string) => {
//     const today = new Date();
//     let start: Date, end: Date;

//     switch (filter) {
//       case "Today":
//         start = new Date(today);
//         end = new Date(today);
//         break;

//       case "Yesterday":
//         start = new Date(today);
//         start.setDate(today.getDate() - 1);
//         end = new Date(start);
//         break;

//       case "This Week": {
//         const day = today.getDay();
//         const diffToMonday = day === 0 ? 6 : day - 1;
//         start = new Date(today);
//         start.setDate(today.getDate() - diffToMonday);
//         start.setHours(0, 0, 0, 0);

//         end = new Date(start);
//         end.setDate(start.getDate() + 6);
//         end.setHours(23, 59, 59, 999);
//         break;
//       }

//       case "Last Week": {
//         const day = today.getDay();
//         const diffToLastMonday = (day === 0 ? 6 : day - 1) + 7;
//         start = new Date(today);
//         start.setDate(today.getDate() - diffToLastMonday);
//         start.setHours(0, 0, 0, 0);

//         end = new Date(start);
//         end.setDate(start.getDate() + 6);
//         end.setHours(23, 59, 59, 999);
//         break;
//       }

//       case "This Month": {
//         start = new Date(today.getFullYear(), today.getMonth(), 1);
//         end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//         end.setHours(23, 59, 59, 999);
//         break;
//       }

//       case "Last Month": {
//         start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         end = new Date(today.getFullYear(), today.getMonth(), 0);
//         end.setHours(23, 59, 59, 999);
//         break;
//       }

//       default:
//         return null;
//     }

//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   // Fetch report data based on date range
//   const fetchReportData = async (start: string, end: string) => {
//     try {
//       console.log(`Fetching data from ${start} to ${end}`);
//       const response = await get<{ status: number; message: string; data: TransactionReport[] }>(`public/report?start_date=${start}&end_date=${end}`);
//       console.log("Response received:", response?.data?.length || 0, "records");
//       setReportData(response?.data || []);
//       return response?.data || [];
//     } catch (err) {
//       console.error("Error fetching report data:", err);
//       return [];
//     }
//   };

//   // Fetch all master data
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const [hostsRes, stationsRes, chargersRes] = await Promise.all([
//         get<{ status: number; message: string; data: Host[] }>("public/host-list"),
//         get<{ status: number; message: string; data: Station[] }>("public/station-list"),
//         get<{ status: number; message: string; data: Charger[] }>("public/charger-list")
//       ]);

//       setHosts(hostsRes?.data || []);
//       setStations(stationsRes?.data || []);
//       setChargers(chargersRes?.data || []);

//       // Fetch initial report data for "Last Week"
//       const dateRange = getDateRangeForFilter("Last Week");
//       if (dateRange) {
//         setStartDate(dateRange.start);
//         setEndDate(dateRange.end);
//         await fetchReportData(dateRange.start, dateRange.end);
//       }

//       setError(null);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Failed to fetch data. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (hostFilterRef.current && !hostFilterRef.current.contains(event.target as Node)) {
//         setIsHostFilterOpen(false);
//         setHostSearch("");
//       }
//       if (stationFilterRef.current && !stationFilterRef.current.contains(event.target as Node)) {
//         setIsStationFilterOpen(false);
//         setStationSearch("");
//       }
//       if (chargerFilterRef.current && !chargerFilterRef.current.contains(event.target as Node)) {
//         setIsChargerFilterOpen(false);
//         setChargerSearch("");
//       }
//       if (quickFilterRef.current && !quickFilterRef.current.contains(event.target as Node)) {
//         setIsQuickFilterOpen(false);
//       }
//       if (weekdaysRef.current && !weekdaysRef.current.contains(event.target as Node)) {
//         setIsWeekdaysOpen(false);
//       }
//       if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
//         setIsDateRangeOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter functions
//   const toggleHost = (hostId: string, hostName: string) => {
//     setSelectedHosts(prev => {
//       const isSelected = prev.includes(hostId);
//       let newSelected = isSelected
//         ? prev.filter(id => id !== hostId)
//         : [...prev, hostId];

//       if (isSelected) {
//         const hostStations = stations.filter(station => station.host_id === hostId);
//         const stationNames = hostStations.map(s => s.name);
//         setSelectedStations(prevStations =>
//           prevStations.filter(name => !stationNames.includes(name))
//         );
//       }

//       return newSelected;
//     });
//   };

//   const toggleStation = (stationName: string) => {
//     setSelectedStations(prev =>
//       prev.includes(stationName) ? prev.filter(s => s !== stationName) : [...prev, stationName]
//     );
//   };

//   const toggleCharger = (chargerName: string) => {
//     setSelectedChargers(prev =>
//       prev.includes(chargerName) ? prev.filter(c => c !== chargerName) : [...prev, chargerName]
//     );
//   };

//   const toggleWeekday = (weekday: string) => {
//     setSelectedWeekdays(prev =>
//       prev.includes(weekday) ? prev.filter(w => w !== weekday) : [...prev, weekday]
//     );
//   };

//   const applyQuickFilter = async (filter: string) => {
//     setSelectedQuickFilter(filter);
//     setSelectedWeekdays([]);
//     setCustomStartDate("");
//     setCustomEndDate("");
//     setActiveFilter(filter);

//     const dateRange = getDateRangeForFilter(filter);
//     if (dateRange) {
//       setStartDate(dateRange.start);
//       setEndDate(dateRange.end);
//       await fetchReportData(dateRange.start, dateRange.end);
//     }

//     setIsQuickFilterOpen(false);
//   };

//   const applyWeekdaysFilter = () => {
//     if (selectedWeekdays.length > 0) {
//       setActiveFilter("Custom");
//       setSelectedQuickFilter("");
//       setCustomStartDate("");
//       setCustomEndDate("");
//     }
//     setIsWeekdaysOpen(false);
//   };

//   const applyDateRangeFilter = async () => {
//     if (customStartDate && customEndDate) {
//       setActiveFilter("Custom");
//       setStartDate(customStartDate);
//       setEndDate(customEndDate);
//       setSelectedQuickFilter("");
//       setSelectedWeekdays([]);
//       await fetchReportData(customStartDate, customEndDate);
//     }
//     setIsDateRangeOpen(false);
//   };

//   const resetAllFilters = async () => {
//     setSelectedHosts([]);
//     setSelectedStations([]);
//     setSelectedChargers([]);
//     setSelectedWeekdays([]);
//     setSelectedQuickFilter("");
//     setCustomStartDate("");
//     setCustomEndDate("");
//     setActiveFilter("Last Week");
//     setHostSearch("");
//     setStationSearch("");
//     setChargerSearch("");

//     // Reset to last week data
//     const dateRange = getDateRangeForFilter("Last Week");
//     if (dateRange) {
//       setStartDate(dateRange.start);
//       setEndDate(dateRange.end);
//       await fetchReportData(dateRange.start, dateRange.end);
//     }
//   };

//   // Real-time filtering based on search input and selected hosts
//   const filteredHosts = hosts.filter(host =>
//     host.name.toLowerCase().includes(hostSearch.toLowerCase())
//   );

//   // Filter stations based on selected hosts and search
//   const filteredStations = stations.filter(station => {
//     const matchesSearch = station.name.toLowerCase().includes(stationSearch.toLowerCase());
//     if (selectedHosts.length === 0) return matchesSearch;
//     const belongsToSelectedHost = selectedHosts.includes(station.host_id);
//     return matchesSearch && belongsToSelectedHost;
//   });

//   // Filter chargers based on selected stations and search
//   const filteredChargers = chargers.filter(charger => {
//     const matchesSearch = charger.name.toLowerCase().includes(chargerSearch.toLowerCase());
//     if (selectedStations.length === 0) return matchesSearch;
//     const belongsToSelectedStation = selectedStations.some(stationName => {
//       const station = stations.find(s => s.name === stationName);
//       return station && charger.property_id === station.id;
//     });
//     return matchesSearch && belongsToSelectedStation;
//   });

//   // Filter report data based on selected hosts, stations, chargers
//   const filteredReportData = reportData.filter(item => {
//     // Filter by hosts
//     if (selectedHosts.length > 0) {
//       if (!selectedHosts.includes(item.host_id)) return false;
//     }

//     // Filter by stations
//     if (selectedStations.length > 0) {
//       const station = stations.find(s => s.id === item.station_id);
//       if (!station || !selectedStations.includes(station.name)) return false;
//     }

//     // Filter by chargers
//     if (selectedChargers.length > 0) {
//       if (!selectedChargers.includes(item.charger)) return false;
//     }

//     return true;
//   });

//   // 🔥 FIX: Prepare chart data for bar chart - SHOW ALL CHARGERS (including zero revenue)
//   const barChartData = filteredReportData
//     .map(item => ({
//       name: item.charger,
//       uv: item.total_revenue,
//       fullName: item.charger,
//       totalUnits: item.total_units,
//       totalSessions: item.total_sessions,
//       utilization: item.utilization_percentage
//     }));

//   // Prepare pie chart data for Utilization Percentage (by charger)
//   const utilizationPieData = filteredReportData
//     .filter(item => item.utilization_percentage > 0)
//     .map(item => ({
//       name: item.charger.length > 20 ? item.charger.substring(0, 20) + "..." : item.charger,
//       value: item.utilization_percentage,
//       fullName: item.charger,
//       originalValue: item.utilization_percentage
//     }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 10); // Show top 10 by utilization

//   // Calculate total revenue from filtered data
//   const totalRevenue = filteredReportData.reduce((sum, item) => sum + item.total_revenue, 0);

//   // Prepare pie chart data for Revenue Percentage (by charger)
//   const revenuePieData = filteredReportData
//     .filter(item => item.total_revenue > 0)
//     .map(item => ({
//       name: item.charger.length > 20 ? item.charger.substring(0, 20) + "..." : item.charger,
//       value: totalRevenue > 0 ? ((item.total_revenue / totalRevenue) * 100) : 0,
//       fullName: item.charger,
//       originalValue: item.total_revenue,
//       percentage: totalRevenue > 0 ? ((item.total_revenue / totalRevenue) * 100).toFixed(2) : "0"
//     }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 10); // Show top 10 by revenue

//   const totalSelected = selectedHosts.length + selectedStations.length + selectedChargers.length;
//   const hasActiveFilters = totalSelected > 0 || selectedQuickFilter || selectedWeekdays.length > 0 || customStartDate || customEndDate;

//   // Format display date
//   const formatDisplayDate = (dateStr: string) => {
//     if (!dateStr) return "";
//     const parts = dateStr.split('-');
//     return `${parts[2]}/${parts[1]}/${parts[0]}`;
//   };

//   if (loading) {
//     return (
//       <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center">
//         <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <p className="text-gray-700 mb-4">{error}</p>
//           <button
//             onClick={fetchAllData}
//             className="px-4 py-2 bg-[#0094FE] text-white rounded-lg hover:bg-[#0080d4] transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const totalChargerCount = filteredReportData.length;
//   const zeroRevenueCount = filteredReportData.filter(item => item.total_revenue === 0).length;

//   return (
//     <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 md:p-8 space-y-6 mt-13">
//         <DashboardHeader subtitle={'EV Charging Performance Dashboard'} title={'Sites'} />
//       {/* FILTERS SECTION */}
//       <div className="flex flex-wrap items-center gap-3">
//         {/* Host Filter Dropdown */}
//         <div className="relative" ref={hostFilterRef}>
//           <button
//             onClick={() => {
//               setIsHostFilterOpen(!isHostFilterOpen);
//               setIsStationFilterOpen(false);
//               setIsChargerFilterOpen(false);
//               setIsQuickFilterOpen(false);
//               setIsWeekdaysOpen(false);
//               setIsDateRangeOpen(false);
//               setHostSearch("");
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
//           >
//             <span className="text-sm">🏢</span>
//             <span className="text-xs font-medium text-gray-700">Hosts</span>
//             {selectedHosts.length > 0 && (
//               <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
//                 {selectedHosts.length}
//               </span>
//             )}
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {isHostFilterOpen && (
//             <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
//               <div className="p-3">
//                 <input
//                   type="text"
//                   placeholder="Search hosts..."
//                   value={hostSearch}
//                   onChange={(e) => setHostSearch(e.target.value)}
//                   className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
//                   autoFocus
//                 />
//                 <div className="max-h-64 overflow-y-auto space-y-1">
//                   {filteredHosts.length > 0 ? (
//                     filteredHosts.map((host) => (
//                       <label key={host.id} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={selectedHosts.includes(host.id)}
//                           onChange={() => toggleHost(host.id, host.name)}
//                           className="w-4 h-4 text-[#0094FE] rounded border-gray-300"
//                         />
//                         <span className="text-xs text-gray-700">{host.name}</span>
//                       </label>
//                     ))
//                   ) : (
//                     <div className="text-center py-4 text-gray-400 text-xs">No hosts found</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Station Filter Dropdown */}
//         <div className="relative" ref={stationFilterRef}>
//           <button
//             onClick={() => {
//               setIsStationFilterOpen(!isStationFilterOpen);
//               setIsHostFilterOpen(false);
//               setIsChargerFilterOpen(false);
//               setIsQuickFilterOpen(false);
//               setIsWeekdaysOpen(false);
//               setIsDateRangeOpen(false);
//               setStationSearch("");
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
//           >
//             <span className="text-sm">📍</span>
//             <span className="text-xs font-medium text-gray-700">Stations</span>
//             {selectedStations.length > 0 && (
//               <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
//                 {selectedStations.length}
//               </span>
//             )}
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {isStationFilterOpen && (
//             <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
//               <div className="p-3">
//                 <input
//                   type="text"
//                   placeholder="Search stations..."
//                   value={stationSearch}
//                   onChange={(e) => setStationSearch(e.target.value)}
//                   className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
//                   autoFocus
//                 />
//                 <div className="max-h-64 overflow-y-auto space-y-1">
//                   {filteredStations.length > 0 ? (
//                     filteredStations.map((station) => (
//                       <label key={station.id} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={selectedStations.includes(station.name)}
//                           onChange={() => toggleStation(station.name)}
//                           className="w-4 h-4 text-[#0094FE] rounded border-gray-300"
//                         />
//                         <span className="text-xs text-gray-700 flex-1">{station.name}</span>
//                         <span className="text-xs text-gray-400">{station.state}</span>
//                       </label>
//                     ))
//                   ) : (
//                     <div className="text-center py-4 text-gray-400 text-xs">
//                       {selectedHosts.length > 0 ? "No stations found for selected hosts" : "No stations found"}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Charger Filter Dropdown */}
//         <div className="relative" ref={chargerFilterRef}>
//           <button
//             onClick={() => {
//               setIsChargerFilterOpen(!isChargerFilterOpen);
//               setIsHostFilterOpen(false);
//               setIsStationFilterOpen(false);
//               setIsQuickFilterOpen(false);
//               setIsWeekdaysOpen(false);
//               setIsDateRangeOpen(false);
//               setChargerSearch("");
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
//           >
//             <span className="text-sm">⚡</span>
//             <span className="text-xs font-medium text-gray-700">Chargers</span>
//             {selectedChargers.length > 0 && (
//               <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
//                 {selectedChargers.length}
//               </span>
//             )}
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {isChargerFilterOpen && (
//             <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
//               <div className="p-3">
//                 <input
//                   type="text"
//                   placeholder="Search chargers..."
//                   value={chargerSearch}
//                   onChange={(e) => setChargerSearch(e.target.value)}
//                   className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
//                   autoFocus
//                 />
//                 <div className="max-h-64 overflow-y-auto space-y-1">
//                   {filteredChargers.length > 0 ? (
//                     filteredChargers.map((charger) => (
//                       <label key={charger.id} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={selectedChargers.includes(charger.name)}
//                           onChange={() => toggleCharger(charger.name)}
//                           className="w-4 h-4 text-[#0094FE] rounded border-gray-300"
//                         />
//                         <span className="text-xs text-gray-700 flex-1">{charger.name}</span>
//                         <span className={`text-xs px-1.5 py-0.5 rounded ${charger.power_output === 'DC' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
//                           {charger.power_output}
//                         </span>
//                       </label>
//                     ))
//                   ) : (
//                     <div className="text-center py-4 text-gray-400 text-xs">
//                       {selectedStations.length > 0 ? "No chargers found for selected stations" : "No chargers found"}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Quick Filters Dropdown */}
//         <div className="relative" ref={quickFilterRef}>
//           <button
//             onClick={() => {
//               setIsQuickFilterOpen(!isQuickFilterOpen);
//               setIsHostFilterOpen(false);
//               setIsStationFilterOpen(false);
//               setIsChargerFilterOpen(false);
//               setIsWeekdaysOpen(false);
//               setIsDateRangeOpen(false);
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
//           >
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-xs font-medium text-gray-700">Quick Filters</span>
//             {selectedQuickFilter && <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">1</span>}
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {isQuickFilterOpen && (
//             <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
//               <div className="p-2">
//                 {quickFilters.map((filter) => (
//                   <button
//                     key={filter}
//                     onClick={() => applyQuickFilter(filter)}
//                     className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${selectedQuickFilter === filter ? "bg-[#0094FE] text-white" : "text-gray-700 hover:bg-gray-100"
//                       }`}
//                   >
//                     {filter}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Weekdays Dropdown */}
//         {/* <div className="relative" ref={weekdaysRef}>
//           <button
//             onClick={() => {
//               setIsWeekdaysOpen(!isWeekdaysOpen);
//               setIsHostFilterOpen(false);
//               setIsStationFilterOpen(false);
//               setIsChargerFilterOpen(false);
//               setIsQuickFilterOpen(false);
//               setIsDateRangeOpen(false);
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
//           >
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <span className="text-xs font-medium text-gray-700">Weekdays</span>
//             {selectedWeekdays.length > 0 && (
//               <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">{selectedWeekdays.length}</span>
//             )}
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {isWeekdaysOpen && (
//             <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
//               <div className="p-3">
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   {weekdays.map((day) => (
//                     <button
//                       key={day}
//                       onClick={() => toggleWeekday(day)}
//                       className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedWeekdays.includes(day) ? "bg-[#0094FE] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                       {day.slice(0, 3)}
//                     </button>
//                   ))}
//                 </div>
//                 <button onClick={applyWeekdaysFilter} className="w-full px-3 py-2 text-xs bg-[#0094FE] text-white rounded-lg hover:bg-[#0080d4] transition-colors">
//                   Apply
//                 </button>
//               </div>
//             </div>
//           )}
//         </div> */}

//         {/* Date Range Dropdown */}
//         <div className="relative" ref={dateRangeRef}>
//           <button
//             onClick={() => {
//               setIsDateRangeOpen(!isDateRangeOpen);
//               setIsHostFilterOpen(false);
//               setIsStationFilterOpen(false);
//               setIsChargerFilterOpen(false);
//               setIsQuickFilterOpen(false);
//               setIsWeekdaysOpen(false);
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
//           >
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <span className="text-xs font-medium text-gray-700">Date Range</span>
//             {(customStartDate || customEndDate) && (
//               <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">1</span>
//             )}
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {isDateRangeOpen && (
//             <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
//               <div className="p-4">
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
//                     <input
//                       type="date"
//                       value={customStartDate}
//                       onChange={(e) => setCustomStartDate(e.target.value)}
//                       className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
//                     <input
//                       type="date"
//                       value={customEndDate}
//                       onChange={(e) => setCustomEndDate(e.target.value)}
//                       className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
//                     />
//                   </div>
//                 </div>
//                 <button
//                   onClick={applyDateRangeFilter}
//                   disabled={!customStartDate || !customEndDate}
//                   className="w-full mt-3 px-3 py-2 text-xs bg-[#0094FE] text-white rounded-lg hover:bg-[#0080d4] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                 >
//                   Apply Date Range
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Reset All Button */}
//         {hasActiveFilters && (
//           <button onClick={resetAllFilters} className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
//             Reset All
//           </button>
//         )}
//       </div>

//       {/* ACTIVE FILTERS DISPLAY */}
//       {hasActiveFilters && (
//         <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100">
//           <span className="text-xs text-gray-500">Active Filters:</span>
//           {selectedHosts.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">🏢 Hosts: {selectedHosts.length}</span>}
//           {selectedStations.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📍 Stations: {selectedStations.length}</span>}
//           {selectedChargers.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">⚡ Chargers: {selectedChargers.length}</span>}
//           {selectedQuickFilter && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📅 {selectedQuickFilter}</span>}
//           {selectedWeekdays.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📅 Weekdays: {selectedWeekdays.join(", ")}</span>}
//           {customStartDate && customEndDate && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📆 {formatDisplayDate(customStartDate)} to {formatDisplayDate(customEndDate)}</span>}
//           {/* {startDate && endDate && !selectedQuickFilter && !customStartDate && !selectedWeekdays.length && (
//             <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📆 {formatDisplayDate(startDate)} to {formatDisplayDate(endDate)}</span>
//           )} */}
//         </div>
//       )}

//       {/* TOP CHART - Revenue by Charger (ALL Chargers) */}
//       <div className="bg-white rounded-2xl overflow-scroll border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
//         <SimpleBarChart
//           height={400}
//           data={barChartData}
//           title={`Revenue by Charger`}
//         />
//       </div>

//       {/* BOTTOM GRID – Two Pie Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {/* Pie Chart 1: Utilization */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
//           <h3 className="text-sm font-semibold text-gray-700">
//             Charger Utilization (%)
           
//           </h3>
//           {utilizationPieData.length > 0 ? (
//             <>
//               <PieChartComponent
//                 data={utilizationPieData.map((item) => ({ name: item.name, value: item.value }))}
//                 title=""
//               />
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-[300px] text-gray-400">
//               No utilization data available
//             </div>
//           )}
//         </div>

//         {/* Pie Chart 2: Revenue Distribution */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
//           <h3 className="text-sm font-semibold text-gray-700">
//             Revenue Distribution (%)
            
//           </h3>
//           {revenuePieData.length > 0 ? (
//             <>
//               <PieChartComponent
//                 data={revenuePieData.map((item) => ({ name: item.name, value: item.value }))}
//                 title=""
//               />
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-[300px] text-gray-400">
//               No revenue data available for the selected filters
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import PieChartComponent from "@/app/componets/charts/PieChartComponent";
import SimpleBarChart from "@/app/componets/charts/SimpleBarChart";
import { useApi } from "@/app/componets/api/apiService";
import DashboardHeader from "@/app/componets/DashboardHeader";

// Weekdays for filter
const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

// Quick filters
const quickFilters = ["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month"];

// DC Power options for filtering
const dcPowerOptions = [
  { label: "All DC Chargers", value: "all", min: 0, max: 1000 },
  // { label: "Below 30 kW", value: "below30", min: 0, max: 30 },
  // { label: "30-60 kW", value: "30-60", min: 30, max: 60 },
  { label: "60 kW", value: "60-120", min: 60, max: 120 },
  { label: "120 kW", value: "120plus", min: 120, max: 1000 }
];

// AC Power options for filtering
const acPowerOptions = [
  { label: "All AC Chargers", value: "all", min: 0, max: 100 },
  { label: "Below 7 kW", value: "below7", min: 0, max: 7 },
  { label: "7-22 kW", value: "7-22", min: 7, max: 22 },
  { label: "22+ kW", value: "22plus", min: 22, max: 100 }
];

// Types
interface Station {
  name: string;
  id: string;
  state: string;
  host_id: string;
}

interface Charger {
  property_id: string;
  name: string;
  power_output: string;
  id: string;
}

interface Host {
  name: string;
  id: string;
}

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

export default function SitesPage() {
  const [activeFilter, setActiveFilter] = useState("Last Week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { get } = useApi();

  // Dropdown states
  const [isHostFilterOpen, setIsHostFilterOpen] = useState(false);
  const [isStationFilterOpen, setIsStationFilterOpen] = useState(false);
  const [isChargerFilterOpen, setIsChargerFilterOpen] = useState(false);
  const [isQuickFilterOpen, setIsQuickFilterOpen] = useState(false);
  const [isWeekdaysOpen, setIsWeekdaysOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isChargerTypeOpen, setIsChargerTypeOpen] = useState(false);
  const [isDCPowerOpen, setIsDCPowerOpen] = useState(false);
  const [isACPowerOpen, setIsACPowerOpen] = useState(false);

  // Filter states
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [selectedChargers, setSelectedChargers] = useState<string[]>([]);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  
  // New filter states for charger type and power
  const [selectedChargerType, setSelectedChargerType] = useState<"all" | "ac" | "dc">("all");
  const [selectedDCPower, setSelectedDCPower] = useState("all");
  const [selectedACPower, setSelectedACPower] = useState("all");

  // API Data states
  const [hosts, setHosts] = useState<Host[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [reportData, setReportData] = useState<TransactionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search states - real-time filtering
  const [hostSearch, setHostSearch] = useState("");
  const [stationSearch, setStationSearch] = useState("");
  const [chargerSearch, setChargerSearch] = useState("");

  const hostFilterRef = useRef<HTMLDivElement>(null);
  const stationFilterRef = useRef<HTMLDivElement>(null);
  const chargerFilterRef = useRef<HTMLDivElement>(null);
  const quickFilterRef = useRef<HTMLDivElement>(null);
  const weekdaysRef = useRef<HTMLDivElement>(null);
  const dateRangeRef = useRef<HTMLDivElement>(null);
  const chargerTypeRef = useRef<HTMLDivElement>(null);
  const dcPowerRef = useRef<HTMLDivElement>(null);
  const acPowerRef = useRef<HTMLDivElement>(null);

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Extract power rating from charger name or power_output
  const getChargerPowerKW = (charger: Charger): number => {
    // Try to extract from power_output first
    if (charger.power_output) {
      const match = charger.power_output.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        return parseFloat(match[1]);
      }
    }
    // Try to extract from name
    const nameMatch = charger.name.match(/(\d+(?:\.\d+)?)\s*(?:kW|kw)/i);
    if (nameMatch) {
      return parseFloat(nameMatch[1]);
    }
    return 0;
  };

  // Check if charger is AC or DC
  const getChargerType = (charger: Charger): "ac" | "dc" => {
    const name = charger.name.toLowerCase();
    const powerOutput = charger.power_output?.toLowerCase() || "";
    
    if (name.includes("ac") || powerOutput.includes("ac")) return "ac";
    if (name.includes("dc") || powerOutput.includes("dc")) return "dc";
    
    // Default based on power output
    const powerKW = getChargerPowerKW(charger);
    if (powerKW > 22) return "dc";
    return "ac";
  };

  // Filter chargers based on type and power
  const filterChargersByTypeAndPower = (chargersList: Charger[]): Charger[] => {
    return chargersList.filter(charger => {
      const chargerType = getChargerType(charger);
      const powerKW = getChargerPowerKW(charger);
      
      // Filter by charger type
      if (selectedChargerType !== "all" && chargerType !== selectedChargerType) {
        return false;
      }
      
      // Filter by DC power range
      if (chargerType === "dc" && selectedDCPower !== "all") {
        const powerOption = dcPowerOptions.find(opt => opt.value === selectedDCPower);
        if (powerOption && (powerKW < powerOption.min || powerKW >= powerOption.max)) {
          return false;
        }
      }
      
      // Filter by AC power range
      if (chargerType === "ac" && selectedACPower !== "all") {
        const powerOption = acPowerOptions.find(opt => opt.value === selectedACPower);
        if (powerOption && (powerKW < powerOption.min || powerKW >= powerOption.max)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Get date range for quick filters
  const getDateRangeForFilter = (filter: string) => {
    const today = new Date();
    let start: Date, end: Date;

    switch (filter) {
      case "Today":
        start = new Date(today);
        end = new Date(today);
        break;

      case "Yesterday":
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        end = new Date(start);
        break;

      case "This Week": {
        const day = today.getDay();
        const diffToMonday = day === 0 ? 6 : day - 1;
        start = new Date(today);
        start.setDate(today.getDate() - diffToMonday);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      }

      case "Last Week": {
        const day = today.getDay();
        const diffToLastMonday = (day === 0 ? 6 : day - 1) + 7;
        start = new Date(today);
        start.setDate(today.getDate() - diffToLastMonday);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      }

      case "This Month": {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      }

      case "Last Month": {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        end.setHours(23, 59, 59, 999);
        break;
      }

      default:
        return null;
    }

    return { start: formatDate(start), end: formatDate(end) };
  };

  // Fetch report data based on date range
  const fetchReportData = async (start: string, end: string) => {
    try {
      console.log(`Fetching data from ${start} to ${end}`);
      const response = await get<{ status: number; message: string; data: TransactionReport[] }>(`public/report?start_date=${start}&end_date=${end}`);
      console.log("Response received:", response?.data?.length || 0, "records");
      setReportData(response?.data || []);
      return response?.data || [];
    } catch (err) {
      console.error("Error fetching report data:", err);
      return [];
    }
  };

  // Fetch all master data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [hostsRes, stationsRes, chargersRes] = await Promise.all([
        get<{ status: number; message: string; data: Host[] }>("public/host-list"),
        get<{ status: number; message: string; data: Station[] }>("public/station-list"),
        get<{ status: number; message: string; data: Charger[] }>("public/charger-list")
      ]);

      setHosts(hostsRes?.data || []);
      setStations(stationsRes?.data || []);
      setChargers(chargersRes?.data || []);

      // Fetch initial report data for "Last Week"
      const dateRange = getDateRangeForFilter("Last Week");
      if (dateRange) {
        setStartDate(dateRange.start);
        setEndDate(dateRange.end);
        await fetchReportData(dateRange.start, dateRange.end);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hostFilterRef.current && !hostFilterRef.current.contains(event.target as Node)) {
        setIsHostFilterOpen(false);
        setHostSearch("");
      }
      if (stationFilterRef.current && !stationFilterRef.current.contains(event.target as Node)) {
        setIsStationFilterOpen(false);
        setStationSearch("");
      }
      if (chargerFilterRef.current && !chargerFilterRef.current.contains(event.target as Node)) {
        setIsChargerFilterOpen(false);
        setChargerSearch("");
      }
      if (quickFilterRef.current && !quickFilterRef.current.contains(event.target as Node)) {
        setIsQuickFilterOpen(false);
      }
      if (weekdaysRef.current && !weekdaysRef.current.contains(event.target as Node)) {
        setIsWeekdaysOpen(false);
      }
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
        setIsDateRangeOpen(false);
      }
      if (chargerTypeRef.current && !chargerTypeRef.current.contains(event.target as Node)) {
        setIsChargerTypeOpen(false);
      }
      if (dcPowerRef.current && !dcPowerRef.current.contains(event.target as Node)) {
        setIsDCPowerOpen(false);
      }
      if (acPowerRef.current && !acPowerRef.current.contains(event.target as Node)) {
        setIsACPowerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter functions
  const toggleHost = (hostId: string, hostName: string) => {
    setSelectedHosts(prev => {
      const isSelected = prev.includes(hostId);
      let newSelected = isSelected
        ? prev.filter(id => id !== hostId)
        : [...prev, hostId];

      if (isSelected) {
        const hostStations = stations.filter(station => station.host_id === hostId);
        const stationNames = hostStations.map(s => s.name);
        setSelectedStations(prevStations =>
          prevStations.filter(name => !stationNames.includes(name))
        );
      }

      return newSelected;
    });
  };

  const toggleStation = (stationName: string) => {
    setSelectedStations(prev =>
      prev.includes(stationName) ? prev.filter(s => s !== stationName) : [...prev, stationName]
    );
  };

  const toggleCharger = (chargerName: string) => {
    setSelectedChargers(prev =>
      prev.includes(chargerName) ? prev.filter(c => c !== chargerName) : [...prev, chargerName]
    );
  };

  const toggleWeekday = (weekday: string) => {
    setSelectedWeekdays(prev =>
      prev.includes(weekday) ? prev.filter(w => w !== weekday) : [...prev, weekday]
    );
  };

  const applyQuickFilter = async (filter: string) => {
    setSelectedQuickFilter(filter);
    setSelectedWeekdays([]);
    setCustomStartDate("");
    setCustomEndDate("");
    setActiveFilter(filter);

    const dateRange = getDateRangeForFilter(filter);
    if (dateRange) {
      setStartDate(dateRange.start);
      setEndDate(dateRange.end);
      await fetchReportData(dateRange.start, dateRange.end);
    }

    setIsQuickFilterOpen(false);
  };

  const applyWeekdaysFilter = () => {
    if (selectedWeekdays.length > 0) {
      setActiveFilter("Custom");
      setSelectedQuickFilter("");
      setCustomStartDate("");
      setCustomEndDate("");
    }
    setIsWeekdaysOpen(false);
  };

  const applyDateRangeFilter = async () => {
    if (customStartDate && customEndDate) {
      setActiveFilter("Custom");
      setStartDate(customStartDate);
      setEndDate(customEndDate);
      setSelectedQuickFilter("");
      setSelectedWeekdays([]);
      await fetchReportData(customStartDate, customEndDate);
    }
    setIsDateRangeOpen(false);
  };

  const resetAllFilters = async () => {
    setSelectedHosts([]);
    setSelectedStations([]);
    setSelectedChargers([]);
    setSelectedWeekdays([]);
    setSelectedQuickFilter("");
    setCustomStartDate("");
    setCustomEndDate("");
    setActiveFilter("Last Week");
    setHostSearch("");
    setStationSearch("");
    setChargerSearch("");
    setSelectedChargerType("all");
    setSelectedDCPower("all");
    setSelectedACPower("all");

    // Reset to last week data
    const dateRange = getDateRangeForFilter("Last Week");
    if (dateRange) {
      setStartDate(dateRange.start);
      setEndDate(dateRange.end);
      await fetchReportData(dateRange.start, dateRange.end);
    }
  };

  // Get filtered chargers based on all filters
  const getFilteredChargers = () => {
    let filtered = [...chargers];
    
    // Apply type and power filters first
    filtered = filterChargersByTypeAndPower(filtered);
    
    // Apply station filter
    if (selectedStations.length > 0) {
      filtered = filtered.filter(charger => 
        selectedStations.some(stationName => {
          const station = stations.find(s => s.name === stationName);
          return station && charger.property_id === station.id;
        })
      );
    }
    
    // Apply host filter
    if (selectedHosts.length > 0) {
      filtered = filtered.filter(charger => {
        const station = stations.find(s => s.id === charger.property_id);
        return station && selectedHosts.includes(station.host_id);
      });
    }
    
    return filtered;
  };

  // Real-time filtering based on search input and selected hosts
  const filteredHosts = hosts.filter(host =>
    host.name.toLowerCase().includes(hostSearch.toLowerCase())
  );

  // Filter stations based on selected hosts and search
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(stationSearch.toLowerCase());
    if (selectedHosts.length === 0) return matchesSearch;
    const belongsToSelectedHost = selectedHosts.includes(station.host_id);
    return matchesSearch && belongsToSelectedHost;
  });

  // Filter chargers based on selected stations, search, and type/power filters
  const filteredChargersList = getFilteredChargers().filter(charger => {
    const matchesSearch = charger.name.toLowerCase().includes(chargerSearch.toLowerCase());
    return matchesSearch;
  });

  // Filter report data based on selected hosts, stations, chargers, and charger type/power
  const filteredReportData = reportData.filter(item => {
    // Filter by hosts
    if (selectedHosts.length > 0) {
      if (!selectedHosts.includes(item.host_id)) return false;
    }

    // Filter by stations
    if (selectedStations.length > 0) {
      const station = stations.find(s => s.id === item.station_id);
      if (!station || !selectedStations.includes(station.name)) return false;
    }

    // Filter by chargers
    if (selectedChargers.length > 0) {
      if (!selectedChargers.includes(item.charger)) return false;
    }
    
    // Filter by charger type and power
    const charger = chargers.find(c => c.name === item.charger);
    if (charger) {
      const chargerType = getChargerType(charger);
      const powerKW = getChargerPowerKW(charger);
      
      if (selectedChargerType !== "all" && chargerType !== selectedChargerType) {
        return false;
      }
      
      if (chargerType === "dc" && selectedDCPower !== "all") {
        const powerOption = dcPowerOptions.find(opt => opt.value === selectedDCPower);
        if (powerOption && (powerKW < powerOption.min || powerKW >= powerOption.max)) {
          return false;
        }
      }
      
      if (chargerType === "ac" && selectedACPower !== "all") {
        const powerOption = acPowerOptions.find(opt => opt.value === selectedACPower);
        if (powerOption && (powerKW < powerOption.min || powerKW >= powerOption.max)) {
          return false;
        }
      }
    }
    
    // Filter by weekdays (if any selected)
    if (selectedWeekdays.length > 0) {
      // This would require date-based filtering - implement if needed
    }

    return true;
  });

  // Prepare chart data for bar chart - SHOW ALL CHARGERS (including zero revenue)
  const barChartData = filteredReportData
    .map(item => ({
      name: item.charger,
      uv: item.total_revenue,
      fullName: item.charger,
      totalUnits: item.total_units,
      totalSessions: item.total_sessions,
      utilization: item.utilization_percentage
    }));

  // Prepare pie chart data for Utilization Percentage (by charger)
  const utilizationPieData = filteredReportData
    .filter(item => item.utilization_percentage > 0)
    .map(item => ({
      name: item.charger.length > 20 ? item.charger.substring(0, 20) + "..." : item.charger,
      value: item.utilization_percentage,
      fullName: item.charger,
      originalValue: item.utilization_percentage
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Calculate total revenue from filtered data
  const totalRevenue = filteredReportData.reduce((sum, item) => sum + item.total_revenue, 0);

  // Prepare pie chart data for Revenue Percentage (by charger)
  const revenuePieData = filteredReportData
    .filter(item => item.total_revenue > 0)
    .map(item => ({
      name: item.charger.length > 20 ? item.charger.substring(0, 20) + "..." : item.charger,
      value: totalRevenue > 0 ? ((item.total_revenue / totalRevenue) * 100) : 0,
      fullName: item.charger,
      originalValue: item.total_revenue,
      percentage: totalRevenue > 0 ? ((item.total_revenue / totalRevenue) * 100).toFixed(2) : "0"
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const totalSelected = selectedHosts.length + selectedStations.length + selectedChargers.length;
  const hasActiveFilters = totalSelected > 0 || selectedQuickFilter || selectedWeekdays.length > 0 || customStartDate || customEndDate || selectedChargerType !== "all" || selectedDCPower !== "all" || selectedACPower !== "all";

  // Format display date
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Get active filter display text
  const getActiveFilterDisplay = () => {
    if (selectedChargerType !== "all") {
      return `Type: ${selectedChargerType.toUpperCase()}`;
    }
    if (selectedDCPower !== "all") {
      const option = dcPowerOptions.find(opt => opt.value === selectedDCPower);
      return `DC: ${option?.label}`;
    }
    if (selectedACPower !== "all") {
      const option = acPowerOptions.find(opt => opt.value === selectedACPower);
      return `AC: ${option?.label}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-[#0094FE] text-white rounded-lg hover:bg-[#0080d4] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 md:p-8 space-y-6 mt-13">
      <DashboardHeader subtitle={'EV Charging Performance Dashboard'} title={'Sites'} />
      
      {/* FILTERS SECTION */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Host Filter Dropdown */}
        <div className="relative" ref={hostFilterRef}>
          <button
            onClick={() => {
              setIsHostFilterOpen(!isHostFilterOpen);
              setIsStationFilterOpen(false);
              setIsChargerFilterOpen(false);
              setIsQuickFilterOpen(false);
              setIsWeekdaysOpen(false);
              setIsDateRangeOpen(false);
              setIsChargerTypeOpen(false);
              setIsDCPowerOpen(false);
              setIsACPowerOpen(false);
              setHostSearch("");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm">🏢</span>
            <span className="text-xs font-medium text-gray-700">Hosts</span>
            {selectedHosts.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
                {selectedHosts.length}
              </span>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isHostFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search hosts..."
                  value={hostSearch}
                  onChange={(e) => setHostSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
                  autoFocus
                />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredHosts.length > 0 ? (
                    filteredHosts.map((host) => (
                      <label key={host.id} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedHosts.includes(host.id)}
                          onChange={() => toggleHost(host.id, host.name)}
                          className="w-4 h-4 text-[#0094FE] rounded border-gray-300"
                        />
                        <span className="text-xs text-gray-700">{host.name}</span>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400 text-xs">No hosts found</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Station Filter Dropdown */}
        <div className="relative" ref={stationFilterRef}>
          <button
            onClick={() => {
              setIsStationFilterOpen(!isStationFilterOpen);
              setIsHostFilterOpen(false);
              setIsChargerFilterOpen(false);
              setIsQuickFilterOpen(false);
              setIsWeekdaysOpen(false);
              setIsDateRangeOpen(false);
              setIsChargerTypeOpen(false);
              setIsDCPowerOpen(false);
              setIsACPowerOpen(false);
              setStationSearch("");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm">📍</span>
            <span className="text-xs font-medium text-gray-700">Stations</span>
            {selectedStations.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
                {selectedStations.length}
              </span>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isStationFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search stations..."
                  value={stationSearch}
                  onChange={(e) => setStationSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
                  autoFocus
                />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredStations.length > 0 ? (
                    filteredStations.map((station) => (
                      <label key={station.id} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStations.includes(station.name)}
                          onChange={() => toggleStation(station.name)}
                          className="w-4 h-4 text-[#0094FE] rounded border-gray-300"
                        />
                        <span className="text-xs text-gray-700 flex-1">{station.name}</span>
                        <span className="text-xs text-gray-400">{station.state}</span>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400 text-xs">
                      {selectedHosts.length > 0 ? "No stations found for selected hosts" : "No stations found"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charger Filter Dropdown */}
        <div className="relative" ref={chargerFilterRef}>
          <button
            onClick={() => {
              setIsChargerFilterOpen(!isChargerFilterOpen);
              setIsHostFilterOpen(false);
              setIsStationFilterOpen(false);
              setIsQuickFilterOpen(false);
              setIsWeekdaysOpen(false);
              setIsDateRangeOpen(false);
              setIsChargerTypeOpen(false);
              setIsDCPowerOpen(false);
              setIsACPowerOpen(false);
              setChargerSearch("");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm">⚡</span>
            <span className="text-xs font-medium text-gray-700">Chargers</span>
            {selectedChargers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
                {selectedChargers.length}
              </span>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isChargerFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search chargers..."
                  value={chargerSearch}
                  onChange={(e) => setChargerSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
                  autoFocus
                />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredChargersList.length > 0 ? (
                    filteredChargersList.map((charger) => {
                      const chargerType = getChargerType(charger);
                      const powerKW = getChargerPowerKW(charger);
                      return (
                        <label key={charger.id} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedChargers.includes(charger.name)}
                            onChange={() => toggleCharger(charger.name)}
                            className="w-4 h-4 text-[#0094FE] rounded border-gray-300"
                          />
                          <span className="text-xs text-gray-700 flex-1">{charger.name}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${chargerType === 'dc' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {chargerType.toUpperCase()} {powerKW > 0 && `${powerKW}kW`}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-400 text-xs">
                      {selectedStations.length > 0 ? "No chargers found for selected stations" : "No chargers found"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charger Type Filter (AC/DC) */}
        <div className="relative" ref={chargerTypeRef}>
          <button
            onClick={() => {
              setIsChargerTypeOpen(!isChargerTypeOpen);
              setIsHostFilterOpen(false);
              setIsStationFilterOpen(false);
              setIsChargerFilterOpen(false);
              setIsQuickFilterOpen(false);
              setIsWeekdaysOpen(false);
              setIsDateRangeOpen(false);
              setIsDCPowerOpen(false);
              setIsACPowerOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm">🔌</span>
            <span className="text-xs font-medium text-gray-700">Charger Type</span>
            {selectedChargerType !== "all" && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
                {selectedChargerType.toUpperCase()}
              </span>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isChargerTypeOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="p-2">
                <button
                  onClick={() => {
                    setSelectedChargerType("all");
                    setSelectedDCPower("all");
                    setSelectedACPower("all");
                    setIsChargerTypeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${selectedChargerType === "all" ? "bg-[#0094FE] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  All Chargers
                </button>
                <button
                  onClick={() => {
                    setSelectedChargerType("ac");
                    setSelectedDCPower("all");
                    setIsChargerTypeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${selectedChargerType === "ac" ? "bg-[#0094FE] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  AC Chargers
                </button>
                <button
                  onClick={() => {
                    setSelectedChargerType("dc");
                    setSelectedACPower("all");
                    setIsChargerTypeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${selectedChargerType === "dc" ? "bg-[#0094FE] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  DC Chargers
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DC Power Filter (only shows when DC is selected) */}
        {selectedChargerType === "dc" && (
          <div className="relative" ref={dcPowerRef}>
            <button
              onClick={() => {
                setIsDCPowerOpen(!isDCPowerOpen);
                setIsHostFilterOpen(false);
                setIsStationFilterOpen(false);
                setIsChargerFilterOpen(false);
                setIsQuickFilterOpen(false);
                setIsWeekdaysOpen(false);
                setIsDateRangeOpen(false);
                setIsChargerTypeOpen(false);
                setIsACPowerOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm">⚡</span>
              <span className="text-xs font-medium text-gray-700">DC Power</span>
              {selectedDCPower !== "all" && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
                  {dcPowerOptions.find(opt => opt.value === selectedDCPower)?.label}
                </span>
              )}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDCPowerOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                <div className="p-2">
                  {dcPowerOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedDCPower(option.value);
                        setIsDCPowerOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${selectedDCPower === option.value ? "bg-[#0094FE] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AC Power Filter (only shows when AC is selected) */}
        {selectedChargerType === "ac" && (
          <div className="relative" ref={acPowerRef}>
            <button
              onClick={() => {
                setIsACPowerOpen(!isACPowerOpen);
                setIsHostFilterOpen(false);
                setIsStationFilterOpen(false);
                setIsChargerFilterOpen(false);
                setIsQuickFilterOpen(false);
                setIsWeekdaysOpen(false);
                setIsDateRangeOpen(false);
                setIsChargerTypeOpen(false);
                setIsDCPowerOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm">🔌</span>
              <span className="text-xs font-medium text-gray-700">AC Power</span>
              {selectedACPower !== "all" && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">
                  {acPowerOptions.find(opt => opt.value === selectedACPower)?.label}
                </span>
              )}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isACPowerOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                <div className="p-2">
                  {acPowerOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedACPower(option.value);
                        setIsACPowerOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${selectedACPower === option.value ? "bg-[#0094FE] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Filters Dropdown */}
        <div className="relative" ref={quickFilterRef}>
          <button
            onClick={() => {
              setIsQuickFilterOpen(!isQuickFilterOpen);
              setIsHostFilterOpen(false);
              setIsStationFilterOpen(false);
              setIsChargerFilterOpen(false);
              setIsWeekdaysOpen(false);
              setIsDateRangeOpen(false);
              setIsChargerTypeOpen(false);
              setIsDCPowerOpen(false);
              setIsACPowerOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-gray-700">Quick Filters</span>
            {selectedQuickFilter && <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">1</span>}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isQuickFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="p-2">
                {quickFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => applyQuickFilter(filter)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${selectedQuickFilter === filter ? "bg-[#0094FE] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Range Dropdown */}
        <div className="relative" ref={dateRangeRef}>
          <button
            onClick={() => {
              setIsDateRangeOpen(!isDateRangeOpen);
              setIsHostFilterOpen(false);
              setIsStationFilterOpen(false);
              setIsChargerFilterOpen(false);
              setIsQuickFilterOpen(false);
              setIsWeekdaysOpen(false);
              setIsChargerTypeOpen(false);
              setIsDCPowerOpen(false);
              setIsACPowerOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium text-gray-700">Date Range</span>
            {(customStartDate || customEndDate) && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#0094FE] text-white rounded-full">1</span>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDateRangeOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
                    />
                  </div>
                </div>
                <button
                  onClick={applyDateRangeFilter}
                  disabled={!customStartDate || !customEndDate}
                  className="w-full mt-3 px-3 py-2 text-xs bg-[#0094FE] text-white rounded-lg hover:bg-[#0080d4] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Apply Date Range
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reset All Button */}
        {hasActiveFilters && (
          <button onClick={resetAllFilters} className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
            Reset All
          </button>
        )}
      </div>

      {/* ACTIVE FILTERS DISPLAY */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100">
          <span className="text-xs text-gray-500">Active Filters:</span>
          {selectedHosts.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">🏢 Hosts: {selectedHosts.length}</span>}
          {selectedStations.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📍 Stations: {selectedStations.length}</span>}
          {selectedChargers.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">⚡ Chargers: {selectedChargers.length}</span>}
          {selectedQuickFilter && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📅 {selectedQuickFilter}</span>}
          {selectedWeekdays.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📅 Weekdays: {selectedWeekdays.join(", ")}</span>}
          {customStartDate && customEndDate && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">📆 {formatDisplayDate(customStartDate)} to {formatDisplayDate(customEndDate)}</span>}
          {selectedChargerType !== "all" && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">🔌 Type: {selectedChargerType.toUpperCase()}</span>}
          {selectedDCPower !== "all" && selectedChargerType === "dc" && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">⚡ DC: {dcPowerOptions.find(opt => opt.value === selectedDCPower)?.label}</span>
          )}
          {selectedACPower !== "all" && selectedChargerType === "ac" && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">🔌 AC: {acPowerOptions.find(opt => opt.value === selectedACPower)?.label}</span>
          )}
          {getActiveFilterDisplay() && !selectedChargerType && !selectedDCPower && !selectedACPower && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">{getActiveFilterDisplay()}</span>
          )}
        </div>
      )}

      {/* TOP CHART - Revenue by Charger (ALL Chargers) */}
      <div className="bg-white rounded-2xl overflow-scroll border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
        <SimpleBarChart
          height={400}
          data={barChartData}
          title={`Revenue by Charger`}
        />
      </div>

      {/* BOTTOM GRID – Two Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pie Chart 1: Utilization */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
          <h3 className="text-sm font-semibold text-gray-700">
            Charger Utilization (%)
          </h3>
          {utilizationPieData.length > 0 ? (
            <PieChartComponent
              data={utilizationPieData.map((item) => ({ name: item.name, value: item.value }))}
              title=""
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No utilization data available
            </div>
          )}
        </div>

        {/* Pie Chart 2: Revenue Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
          <h3 className="text-sm font-semibold text-gray-700">
            Revenue Distribution (%)
          </h3>
          {revenuePieData.length > 0 ? (
            <PieChartComponent
              data={revenuePieData.map((item) => ({ name: item.name, value: item.value }))}
              title=""
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No revenue data available for the selected filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}