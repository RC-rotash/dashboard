
// "use client";

// import { useState, useEffect } from "react";
// import { Plus, Users, UserPlus, X, Calendar, Search, RefreshCw, Clock, ChevronDown, ChevronRight } from "lucide-react";
// import StatCard from "@/app/componets/cards/StatCard";
// import { ToastContainer } from "@/app/componets/Toast";
// import { useToast } from "@/app/componets/hooks/useToast";
// import { useApi } from "@/app/componets/api/apiService";
// import SimpleBarChart from "@/app/componets/charts/SimpleBarChart";
// import DashboardHeader from "@/app/componets/DashboardHeader";


// interface Fleet {
//   id: string;
//   name: string;
//   createdAt?: string;
//   userCount?: number;
//   users?: string[];
// }

// interface TransactionData {
//   tr_time: string;
//   tr_id: string;
//   duration: number;
//   units_consumed: number;
//   amount: number;
//   fleet_id: string;
//   user_id: string;
// }

// interface ApiFleetResponse {
//   status: number;
//   message: string;
//   data: Array<{
//     id: string;
//     name: string;
//     users?: number | any[];
//   }>;
//   count: number;
// }

// interface CreateFleetResponse {
//   status: number;
//   message: string;
//   data?: {
//     id: string;
//     name: string;
//   };
// }

// interface AttachUserResponse {
//   status: number;
//   message: string;
//   data?: any;
// }

// // Helper function to format duration (seconds to readable format)
// const formatDuration = (seconds: number): string => {
//   if (seconds === 0) return "0 sec";
  
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const secs = seconds % 60;
  
//   if (hours > 0) {
//     return `${hours}h ${minutes}m ${secs}s`;
//   } else if (minutes > 0) {
//     return `${minutes}m ${secs}s`;
//   } else {
//     return `${secs}s`;
//   }
// };

// export default function Fleets() {
//   const { toasts, removeToast, success, error, warning } = useToast();
//   const [fleets, setFleets] = useState<Fleet[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddFleetModal, setShowAddFleetModal] = useState(false);
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [newFleetName, setNewFleetName] = useState("");
//   const [selectedFleetId, setSelectedFleetId] = useState("");
//   const [userId, setUserId] = useState("");
//   const [attachLoading, setAttachLoading] = useState(false);
//   const [createLoading, setCreateLoading] = useState(false);
//   const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
//   const [fleetRevenueData, setFleetRevenueData] = useState<any[]>([]);
//   const [fleetNameFilter, setFleetNameFilter] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const [expandedFleets, setExpandedFleets] = useState<Set<string>>(new Set());
//   const { post } = useApi();

//   // Toggle expand/collapse for fleet users
//   const toggleExpand = (fleetId: string) => {
//     const newExpanded = new Set(expandedFleets);
//     if (newExpanded.has(fleetId)) {
//       newExpanded.delete(fleetId);
//     } else {
//       newExpanded.add(fleetId);
//     }
//     setExpandedFleets(newExpanded);
//   };

//   // Fetch fleets
//   const fetchFleets = async () => {
//     try {
//       setLoading(true);
//       const response = await post<ApiFleetResponse>("/admin/fleet-list");
//       console.log("Full API Response:", response);
      
//       let fleetData = response?.data || response || [];
//       if (!Array.isArray(fleetData)) {
//         fleetData = [];
//       }
      
//       const processedFleets = fleetData.map((fleet: any) => {
//         return {
//           id: fleet.id,
//           name: fleet.name,
//           createdAt: new Date().toISOString().split('T')[0],
//           userCount: 0,
//           users: [],
//         };
//       });
      
//       console.log("Processed Fleets:", processedFleets);
//       console.log(`Total fleets fetched: ${processedFleets.length}`);
//       setFleets(processedFleets);
      
//       await fetchTransactionData(processedFleets);
//     } catch (err) {
//       console.error("Error fetching fleets:", err);
//       error("Failed to fetch fleet list");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch transaction data - Extract users per fleet from API response
//   const fetchTransactionData = async (fleetList: Fleet[]) => {
//     try {
//       const response = await post<any>("/admin/fleet-data?start_date=2026-03-01&end_date=2026-03-31");
//       const data = response?.data || response || [];
//       setTransactionData(data);
      
//       // Extract unique users per fleet from transaction data
//       const usersPerFleet = new Map<string, Set<string>>();
      
//       // Initialize map with all fleets
//       fleetList.forEach(fleet => {
//         usersPerFleet.set(fleet.id, new Set<string>());
//       });
      
//       // Add users to their respective fleets from transaction data
//       data.forEach((transaction: TransactionData) => {
//         const fleetId = transaction.fleet_id;
//         const userId = transaction.user_id;
//         if (fleetId && userId && usersPerFleet.has(fleetId)) {
//           usersPerFleet.get(fleetId)!.add(userId);
//         }
//       });
      
//       // Update fleet user counts and users list
//       const updatedFleets = fleetList.map(fleet => ({
//         ...fleet,
//         userCount: usersPerFleet.get(fleet.id)?.size || 0,
//         users: Array.from(usersPerFleet.get(fleet.id) || [])
//       }));
//       setFleets(updatedFleets);
      
//       // Log users per fleet for debugging
//       console.log("Users per fleet from transaction data:");
//       usersPerFleet.forEach((users, fleetId) => {
//         const fleet = fleetList.find(f => f.id === fleetId);
//         console.log(`  ${fleet?.name || fleetId}: ${users.size} users - [${Array.from(users).join(", ")}]`);
//       });
      
//       // Calculate total duration from all transactions
//       const totalDurationSeconds = data.reduce((sum: number, transaction: TransactionData) => {
//         return sum + (transaction.duration || 0);
//       }, 0);
//       console.log(`Total Duration: ${formatDuration(totalDurationSeconds)}`);
      
//       // FIRST: Initialize ALL fleets with zero values
//       const fleetMap = new Map<string, { 
//         revenue: number; 
//         units: number; 
//         transactions: number; 
//         name: string;
//         totalUnits: number;
//         totalSessions: number;
//         totalDuration: number;
//       }>();
      
//       // Add ALL fleets to the map with zero values
//       fleetList.forEach(fleet => {
//         fleetMap.set(fleet.id, {
//           revenue: 0,
//           units: 0,
//           transactions: 0,
//           name: fleet.name,
//           totalUnits: 0,
//           totalSessions: 0,
//           totalDuration: 0
//         });
//       });
      
//       // THEN: Add transaction data to respective fleets
//       data.forEach((transaction: TransactionData) => {
//         const fleetId = transaction.fleet_id;
//         if (!fleetId) return;
        
//         if (fleetMap.has(fleetId)) {
//           const summary = fleetMap.get(fleetId)!;
//           summary.revenue += transaction.amount;
//           summary.units += transaction.units_consumed;
//           summary.transactions += 1;
//           summary.totalUnits += transaction.units_consumed;
//           summary.totalSessions += 1;
//           summary.totalDuration += transaction.duration || 0;
//         }
//       });
      
//       // Convert to array - Include ALL fleets (no filtering)
//       const chartData = Array.from(fleetMap.entries())
//         .map(([id, data]) => ({
//           id,
//           name: data.name,
//           fullName: data.name,
//           uv: Math.round(data.revenue),
//           totalUnits: data.units,
//           totalSessions: data.transactions,
//           totalDuration: data.totalDuration,
//           utilization: 0,
//           userCount: usersPerFleet.get(id)?.size || 0
//         }))
//         // Sort alphabetically by name for consistent display
//         .sort((a, b) => a.name.localeCompare(b.name));
      
//       console.log(`Chart data contains ALL ${chartData.length} fleets (including zero-revenue fleets)`);
//       console.log("Sample chart data:", chartData.slice(0, 3));
      
//       setFleetRevenueData(chartData);
//     } catch (err) {
//       console.error("Error fetching transaction data:", err);
//     }
//   };

//   // Refresh all data
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchFleets();
//     setRefreshing(false);
//     success("Data refreshed successfully!");
//   };

//   // Create fleet
//   const handleAddFleet = async () => {
//     if (!newFleetName.trim()) {
//       warning("Please enter fleet name");
//       return;
//     }

//     setCreateLoading(true);
//     try {
//       const response = await post<CreateFleetResponse>(`/admin/create-fleet?fleetName=${encodeURIComponent(newFleetName)}`);
      
//       console.log("Create fleet response:", response);
      
//       if (response.status === 200) {
//         success(`Fleet "${newFleetName}" created successfully!`);
//         setNewFleetName("");
//         setShowAddFleetModal(false);
//         await fetchFleets();
//       } else {
//         error(response.message || "Failed to create fleet");
//       }
//     } catch (err) {
//       console.error("Create fleet error:", err);
//       error("Network error: Unable to create fleet");
//     } finally {
//       setCreateLoading(false);
//     }
//   };

//   // Attach user to fleet via API
//   const handleAttachUserToFleet = async () => {
//     const trimmedUserId = userId.trim();

//     if (!selectedFleetId) {
//       warning("Please select a fleet");
//       return;
//     }

//     if (!trimmedUserId) {
//       warning("Please enter User ID");
//       return;
//     }

//     setAttachLoading(true);

//     try {
//       const payload = {
//         fleetId: selectedFleetId,
//         userId: trimmedUserId,
//       };

//       console.log("Attaching user to fleet:", payload);

//       const response = await post<AttachUserResponse>(
//         "/admin/attach-fleet-user",
//         payload
//       );

//       console.log("Attach response:", response);

//       if (response.status === 200) {
//         success(`User ID "${trimmedUserId}" added to fleet successfully!`);
//         await fetchFleets();
//         setSelectedFleetId("");
//         setUserId("");
//         setShowAddUserModal(false);
//       } else {
//         error(response.message || "Failed to attach user to fleet");
//       }
//     } catch (err: any) {
//       console.error("Attach user error:", err);

//       if (err.response?.status === 400) {
//         error(err.response?.data?.message || "Invalid request");
//       } else {
//         error("Network error: Unable to attach user");
//       }
//     } finally {
//       setAttachLoading(false);
//     }
//   };

//   // Filter fleets by name
//   const filteredFleets = fleets.filter(fleet =>
//     fleet.name.toLowerCase().includes(fleetNameFilter.toLowerCase())
//   );

//   // Filter chart data by fleet name - Keep ALL matching fleets
//   const filteredChartData = fleetRevenueData.filter(item =>
//     item.name.toLowerCase().includes(fleetNameFilter.toLowerCase())
//   );

//   useEffect(() => {
//     fetchFleets();
//   }, []);

//   const totalFleets = filteredFleets.length;
//   const totalUsers = filteredFleets.reduce((sum, fleet) => sum + (fleet.userCount || 0), 0);
//   const totalRevenue = filteredChartData.reduce((sum, f) => sum + f.uv, 0);
//   const totalUnits = filteredChartData.reduce((sum, f) => sum + (f.totalUnits || 0), 0);
//   const totalTransactions = filteredChartData.reduce((sum, f) => sum + (f.totalSessions || 0), 0);
//   const totalDuration = filteredChartData.reduce((sum, f) => sum + (f.totalDuration || 0), 0);

//   return (
//     <div className="p-6 space-y-4 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 min-h-screen mt-14">
//        <DashboardHeader
//                     subtitle={'Manage your fleets and assign users'}
//                     title={'Fleet Management'}
//                   />
//       <ToastContainer toasts={toasts} onRemove={removeToast} />

//       {/* Header */}
//       <div className="flex justify-between items-center">
//        <div></div>
      
//         <div className="flex gap-2">
//           <button
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:shadow-lg transition-all text-[11px] font-medium"
//           >
//             <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
//             Refresh
//           </button>
//           <button
//             onClick={() => setShowAddFleetModal(true)}
//             className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-[11px] font-medium"
//           >
//             <Plus className="w-3.5 h-3.5" />
//             Add Fleet
//           </button>
//         </div>
//       </div>
      
//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center py-20">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0094FE]"></div>
//           <span className="ml-2 text-gray-500">Loading fleets...</span>
//         </div>
//       )}

//       {/* Main Content */}
//       {!loading && (
//         <>
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
//             <StatCard title="Total Fleets" value={String(totalFleets)} variant="green" />
//             <StatCard title="Total Users" value={String(totalUsers)} variant="indigo" />
//             <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} variant="blue" />
//             <StatCard title="Total Units" value={`${Math.round(totalUnits/1000).toLocaleString()} kWh`} variant="orange" />
//             <StatCard title="Total Duration" value={formatDuration(totalDuration)} variant="purple" />
//           </div>

//           {/* Chart Section - Shows ALL fleets including zero revenue */}
//           <div className="bg-white p-4 rounded-xl shadow-lg">
//             {filteredChartData.length > 0 ? (
//               <SimpleBarChart 
//                 data={filteredChartData}
//                 title={`Showing total fleets`}
//                 height={400}
//               />
//             ) : (
//               <div className="text-center py-10 text-gray-400">
//                 <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                 <p className="text-sm">No fleets found matching your search</p>
//               </div>
//             )}
//           </div>


//           {/* Fleets Table with Expandable Users */}
//           <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-blue-50 border-b border-gray-200">
//                   <tr>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 w-10"></th>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">S.No</th>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Fleet Name</th>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Total Users</th>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Revenue (₹)</th>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Units (kWh)</th>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Duration</th>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Transactions</th>
//                     <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredFleets.length === 0 ? (
//                     <tr>
//                       <td colSpan={9} className="text-center py-10 text-gray-400">
//                         <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//                         <p className="text-xs">No fleets found{fleetNameFilter ? ` matching "${fleetNameFilter}"` : " created yet"}</p>
//                         {!fleetNameFilter && (
//                           <button
//                             onClick={() => setShowAddFleetModal(true)}
//                             className="mt-2 text-[#0094FE] text-[11px] hover:underline"
//                           >
//                             Create your first fleet
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredFleets.flatMap((fleet, index) => {
//                       const fleetStats = fleetRevenueData.find(f => f.id === fleet.id);
//                       const isExpanded = expandedFleets.has(fleet.id);
//                       const fleetUsers = fleet.users || [];
//                       const hasUsers = fleetUsers.length > 0;
                      
//                       const mainRow = (
//                         <tr key={fleet.id} className="hover:bg-gray-50 transition-all duration-200">
//                           <td className="px-4 py-3">
//                             {hasUsers && (
//                               <button
//                                 onClick={() => toggleExpand(fleet.id)}
//                                 className="text-gray-500 hover:text-gray-700 transition-colors"
//                               >
//                                 {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//                               </button>
//                             )}
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="text-xs font-medium text-gray-500">{index + 1}</span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <p className="text-xs font-medium text-gray-800">
//                               {fleet.name.charAt(0).toUpperCase() + fleet.name.slice(1)}
//                             </p>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
//                               (fleet.userCount || 0) > 0 
//                                 ? "bg-green-100 text-green-700" 
//                                 : "bg-gray-100 text-gray-500"
//                             }`}>
//                               {fleet.userCount || 0} Users
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="text-xs font-semibold text-blue-600">
//                               ₹{fleetStats?.uv?.toLocaleString() || 0}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="text-xs text-gray-600">
//                               {Math.round(fleetStats?.totalUnits/1000 || 0).toLocaleString()}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex items-center gap-1">
                          
//                               <span className="text-xs text-gray-600" title={fleetStats?.totalDuration ? `${fleetStats.totalDuration} seconds` : ""}>
//                                 {formatDuration(fleetStats?.totalDuration || 0)}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="text-xs text-gray-600">
//                               {fleetStats?.totalSessions || 0}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <button
//                               onClick={() => {
//                                 setSelectedFleetId(fleet.id);
//                                 setShowAddUserModal(true);
//                               }}
//                               className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all text-[11px] font-medium"
//                               title="Add User"
//                             >
//                               <UserPlus className="w-3.5 h-3.5" />
//                               Add
//                             </button>
//                           </td>
//                         </tr>
//                       );
                      
//                       const userRows = isExpanded && hasUsers ? fleetUsers.map((userId: string, userIdx: number) => (
//                         <tr key={`${fleet.id}-user-${userId}`} className="bg-gray-50 hover:bg-gray-100 transition-all duration-200">
//                           <td className="px-4 py-2"></td>
//                           <td className="px-4 py-2"></td>
//                           <td colSpan={2} className="px-4 py-2">
//                             <div className="flex items-center gap-2 ml-6">
//                               <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
//                                 <Users className="w-3 h-3 text-purple-600" />
//                               </div>
//                               <div>
//                                 <p className="text-xs font-mono text-gray-700">{userId}</p>
//                                 <p className="text-[10px] text-gray-400">User ID</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td colSpan={5} className="px-4 py-2 text-xs text-gray-500">
//                             <span className="inline-flex items-center gap-1">
//                               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                               Active in this fleet
//                             </span>
//                           </td>
//                         </tr>
//                       )) : [];
                      
//                       return [mainRow, ...userRows];
//                     })
//                   )}
//                 </tbody>
               
//               </table>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Add Fleet Modal */}
//       {showAddFleetModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-5">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xs font-bold text-gray-800">Create New Fleet</h2>
//               <button onClick={() => setShowAddFleetModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
//                 <X className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-[11px] font-medium text-gray-700 mb-1">Fleet Name *</label>
//                 <input
//                   type="text"
//                   value={newFleetName}
//                   onChange={(e) => setNewFleetName(e.target.value)}
//                   placeholder="Enter fleet name"
//                   className="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
//                   autoFocus
//                 />
//               </div>
              
//               <div className="flex gap-3 pt-3">
//                 <button
//                   onClick={handleAddFleet}
//                   disabled={createLoading}
//                   className="flex-1 px-3 py-2 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg text-[11px] font-medium disabled:opacity-50"
//                 >
//                   {createLoading ? "Creating..." : "Create Fleet"}
//                 </button>
//                 <button
//                   onClick={() => setShowAddFleetModal(false)}
//                   className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-[11px] font-medium"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add User to Fleet Modal */}
//       {showAddUserModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-5">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xs font-bold text-gray-800">Add User to Fleet</h2>
//               <button
//                 onClick={() => {
//                   setShowAddUserModal(false);
//                   setSelectedFleetId("");
//                   setUserId("");
//                 }}
//                 className="p-1 hover:bg-gray-100 rounded-lg"
//               >
//                 <X className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-[11px] font-medium text-gray-700 mb-1">Select Fleet *</label>
//                 <select
//                   value={selectedFleetId}
//                   onChange={(e) => setSelectedFleetId(e.target.value)}
//                   className="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
//                 >
//                   <option value="">Choose a fleet...</option>
//                   {fleets.map((fleet) => (
//                     <option key={fleet.id} value={fleet.id}>
//                       {fleet.name} ({fleet.userCount || 0} users)
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-[11px] font-medium text-gray-700 mb-1">User ID *</label>
//                 <input
//                   type="text"
//                   value={userId}
//                   onChange={(e) => setUserId(e.target.value)}
//                   placeholder="Enter User ID"
//                   className="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE] font-mono"
//                 />
//               </div>

//               {selectedFleetId && (
//                 <div className="p-2.5 bg-blue-50 rounded-lg">
//                   <p className="text-[11px] text-gray-600">
//                     Target Fleet: <span className="font-semibold text-gray-800">
//                       {fleets.find(f => f.id === selectedFleetId)?.name}
//                     </span>
//                   </p>
//                 </div>
//               )}
              
//               <div className="flex gap-3 pt-3">
//                 <button
//                   onClick={handleAttachUserToFleet}
//                   disabled={attachLoading || !selectedFleetId || !userId.trim()}
//                   className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-[11px] font-medium disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {attachLoading ? "Adding..." : "Add User to Fleet"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAddUserModal(false);
//                     setSelectedFleetId("");
//                     setUserId("");
//                   }}
//                   className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-[11px] font-medium"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Users, UserPlus, X, Calendar, Search, RefreshCw, Clock, ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import StatCard from "@/app/componets/cards/StatCard";
import { ToastContainer } from "@/app/componets/Toast";
import { useToast } from "@/app/componets/hooks/useToast";
import { useApi } from "@/app/componets/api/apiService";
import SimpleBarChart from "@/app/componets/charts/SimpleBarChart";
import DashboardHeader from "@/app/componets/DashboardHeader";


interface Fleet {
  id: string;
  name: string;
  createdAt?: string;
  userCount?: number;
  users?: string[];
}

interface TransactionData {
  tr_time: string;
  tr_id: string;
  duration: number;
  units_consumed: number;
  amount: number;
  fleet_id: string;
  user_id: string;
}

interface ApiFleetResponse {
  status: number;
  message: string;
  data: Array<{
    id: string;
    name: string;
    users?: number | any[];
  }>;
  count: number;
}

interface CreateFleetResponse {
  status: number;
  message: string;
  data?: {
    id: string;
    name: string;
  };
}

interface AttachUserResponse {
  status: number;
  message: string;
  data?: any;
}

// Helper function to format duration (seconds to readable format)
const formatDuration = (seconds: number): string => {
  if (seconds === 0) return "0 sec";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

type SortOrder = "asc" | "desc" | null;

export default function Fleets() {
  const { toasts, removeToast, success, error, warning } = useToast();
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFleetModal, setShowAddFleetModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newFleetName, setNewFleetName] = useState("");
  const [selectedFleetId, setSelectedFleetId] = useState("");
  const [userId, setUserId] = useState("");
  const [attachLoading, setAttachLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [fleetRevenueData, setFleetRevenueData] = useState<any[]>([]);
  const [fleetNameFilter, setFleetNameFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedFleets, setExpandedFleets] = useState<Set<string>>(new Set());
  
  // Revenue sorting state
  const [revenueSortOrder, setRevenueSortOrder] = useState<SortOrder>(null);
  
  const { post } = useApi();

  // Toggle expand/collapse for fleet users
  const toggleExpand = (fleetId: string) => {
    const newExpanded = new Set(expandedFleets);
    if (newExpanded.has(fleetId)) {
      newExpanded.delete(fleetId);
    } else {
      newExpanded.add(fleetId);
    }
    setExpandedFleets(newExpanded);
  };

  // Fetch fleets
  const fetchFleets = async () => {
    try {
      setLoading(true);
      const response = await post<ApiFleetResponse>("/admin/fleet-list");
      console.log("Full API Response:", response);
      
      let fleetData = response?.data || response || [];
      if (!Array.isArray(fleetData)) {
        fleetData = [];
      }
      
      const processedFleets = fleetData.map((fleet: any) => {
        return {
          id: fleet.id,
          name: fleet.name,
          createdAt: new Date().toISOString().split('T')[0],
          userCount: 0,
          users: [],
        };
      });
      
      console.log("Processed Fleets:", processedFleets);
      console.log(`Total fleets fetched: ${processedFleets.length}`);
      setFleets(processedFleets);
      
      await fetchTransactionData(processedFleets);
    } catch (err) {
      console.error("Error fetching fleets:", err);
      error("Failed to fetch fleet list");
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction data - Extract users per fleet from API response
  const fetchTransactionData = async (fleetList: Fleet[]) => {
    try {
      const response = await post<any>("/admin/fleet-data?start_date=2026-03-01&end_date=2026-03-31");
      const data = response?.data || response || [];
      setTransactionData(data);
      
      // Extract unique users per fleet from transaction data
      const usersPerFleet = new Map<string, Set<string>>();
      
      // Initialize map with all fleets
      fleetList.forEach(fleet => {
        usersPerFleet.set(fleet.id, new Set<string>());
      });
      
      // Add users to their respective fleets from transaction data
      data.forEach((transaction: TransactionData) => {
        const fleetId = transaction.fleet_id;
        const userId = transaction.user_id;
        if (fleetId && userId && usersPerFleet.has(fleetId)) {
          usersPerFleet.get(fleetId)!.add(userId);
        }
      });
      
      // Update fleet user counts and users list
      const updatedFleets = fleetList.map(fleet => ({
        ...fleet,
        userCount: usersPerFleet.get(fleet.id)?.size || 0,
        users: Array.from(usersPerFleet.get(fleet.id) || [])
      }));
      setFleets(updatedFleets);
      
      // Log users per fleet for debugging
      console.log("Users per fleet from transaction data:");
      usersPerFleet.forEach((users, fleetId) => {
        const fleet = fleetList.find(f => f.id === fleetId);
        console.log(`  ${fleet?.name || fleetId}: ${users.size} users - [${Array.from(users).join(", ")}]`);
      });
      
      // Calculate total duration from all transactions
      const totalDurationSeconds = data.reduce((sum: number, transaction: TransactionData) => {
        return sum + (transaction.duration || 0);
      }, 0);
      console.log(`Total Duration: ${formatDuration(totalDurationSeconds)}`);
      
      // FIRST: Initialize ALL fleets with zero values
      const fleetMap = new Map<string, { 
        revenue: number; 
        units: number; 
        transactions: number; 
        name: string;
        totalUnits: number;
        totalSessions: number;
        totalDuration: number;
      }>();
      
      // Add ALL fleets to the map with zero values
      fleetList.forEach(fleet => {
        fleetMap.set(fleet.id, {
          revenue: 0,
          units: 0,
          transactions: 0,
          name: fleet.name,
          totalUnits: 0,
          totalSessions: 0,
          totalDuration: 0
        });
      });
      
      // THEN: Add transaction data to respective fleets
      data.forEach((transaction: TransactionData) => {
        const fleetId = transaction.fleet_id;
        if (!fleetId) return;
        
        if (fleetMap.has(fleetId)) {
          const summary = fleetMap.get(fleetId)!;
          summary.revenue += transaction.amount;
          summary.units += transaction.units_consumed;
          summary.transactions += 1;
          summary.totalUnits += transaction.units_consumed;
          summary.totalSessions += 1;
          summary.totalDuration += transaction.duration || 0;
        }
      });
      
      // Convert to array - Include ALL fleets (no filtering)
      const chartData = Array.from(fleetMap.entries())
        .map(([id, data]) => ({
          id,
          name: data.name,
          fullName: data.name,
          uv: Math.round(data.revenue),
          totalUnits: data.units,
          totalSessions: data.transactions,
          totalDuration: data.totalDuration,
          utilization: 0,
          userCount: usersPerFleet.get(id)?.size || 0
        }))
        // Sort alphabetically by name for consistent display
        .sort((a, b) => a.name.localeCompare(b.name));
      
      console.log(`Chart data contains ALL ${chartData.length} fleets (including zero-revenue fleets)`);
      console.log("Sample chart data:", chartData.slice(0, 3));
      
      setFleetRevenueData(chartData);
    } catch (err) {
      console.error("Error fetching transaction data:", err);
    }
  };

  // Refresh all data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFleets();
    setRefreshing(false);
    success("Data refreshed successfully!");
  };

  // Create fleet
  const handleAddFleet = async () => {
    if (!newFleetName.trim()) {
      warning("Please enter fleet name");
      return;
    }

    setCreateLoading(true);
    try {
      const response = await post<CreateFleetResponse>(`/admin/create-fleet?fleetName=${encodeURIComponent(newFleetName)}`);
      
      console.log("Create fleet response:", response);
      
      if (response.status === 200) {
        success(`Fleet "${newFleetName}" created successfully!`);
        setNewFleetName("");
        setShowAddFleetModal(false);
        await fetchFleets();
      } else {
        error(response.message || "Failed to create fleet");
      }
    } catch (err) {
      console.error("Create fleet error:", err);
      error("Network error: Unable to create fleet");
    } finally {
      setCreateLoading(false);
    }
  };

  // Attach user to fleet via API
  const handleAttachUserToFleet = async () => {
    const trimmedUserId = userId.trim();

    if (!selectedFleetId) {
      warning("Please select a fleet");
      return;
    }

    if (!trimmedUserId) {
      warning("Please enter User ID");
      return;
    }

    setAttachLoading(true);

    try {
      const payload = {
        fleetId: selectedFleetId,
        userId: trimmedUserId,
      };

      console.log("Attaching user to fleet:", payload);

      const response = await post<AttachUserResponse>(
        "/admin/attach-fleet-user",
        payload
      );

      console.log("Attach response:", response);

      if (response.status === 200) {
        success(`User ID "${trimmedUserId}" added to fleet successfully!`);
        await fetchFleets();
        setSelectedFleetId("");
        setUserId("");
        setShowAddUserModal(false);
      } else {
        error(response.message || "Failed to attach user to fleet");
      }
    } catch (err: any) {
      console.error("Attach user error:", err);

      if (err.response?.status === 400) {
        error(err.response?.data?.message || "Invalid request");
      } else {
        error("Network error: Unable to attach user");
      }
    } finally {
      setAttachLoading(false);
    }
  };

  // Handle revenue sort
  const handleRevenueSort = () => {
    if (revenueSortOrder === null) {
      setRevenueSortOrder("desc");
    } else if (revenueSortOrder === "desc") {
      setRevenueSortOrder("asc");
    } else {
      setRevenueSortOrder(null);
    }
  };

  // Get revenue sort icon
  const getRevenueSortIcon = () => {
    if (revenueSortOrder === null) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1" />;
    }
    return revenueSortOrder === "desc" ? 
      <ArrowDown className="w-3.5 h-3.5 ml-1" /> : 
      <ArrowUp className="w-3.5 h-3.5 ml-1" />;
  };

  // Filter fleets by name
  const filteredFleets = fleets.filter(fleet =>
    fleet.name.toLowerCase().includes(fleetNameFilter.toLowerCase())
  );

  // Sort fleets by revenue
  const sortedAndFilteredFleets = useMemo(() => {
    if (revenueSortOrder === null) {
      return filteredFleets;
    }
    
    return [...filteredFleets].sort((a, b) => {
      const revenueA = fleetRevenueData.find(f => f.id === a.id)?.uv || 0;
      const revenueB = fleetRevenueData.find(f => f.id === b.id)?.uv || 0;
      
      if (revenueSortOrder === "desc") {
        return revenueB - revenueA;
      } else {
        return revenueA - revenueB;
      }
    });
  }, [filteredFleets, fleetRevenueData, revenueSortOrder]);

  // Filter chart data by fleet name - Keep ALL matching fleets
  const filteredChartData = fleetRevenueData.filter(item =>
    item.name.toLowerCase().includes(fleetNameFilter.toLowerCase())
  );

  useEffect(() => {
    fetchFleets();
  }, []);

  const totalFleets = sortedAndFilteredFleets.length;
  const totalUsers = sortedAndFilteredFleets.reduce((sum, fleet) => sum + (fleet.userCount || 0), 0);
  const totalRevenue = filteredChartData.reduce((sum, f) => sum + f.uv, 0);
  const totalUnits = filteredChartData.reduce((sum, f) => sum + (f.totalUnits || 0), 0);
  const totalTransactions = filteredChartData.reduce((sum, f) => sum + (f.totalSessions || 0), 0);
  const totalDuration = filteredChartData.reduce((sum, f) => sum + (f.totalDuration || 0), 0);

  return (
    <div className="p-6 space-y-4 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 min-h-screen mt-14">
       <DashboardHeader
                    subtitle={'Manage your fleets and assign users'}
                    title={'Fleet Management'}
                  />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex justify-between items-center">
       <div></div>
      
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:shadow-lg transition-all text-[11px] font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddFleetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-[11px] font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Fleet
          </button>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0094FE]"></div>
          <span className="ml-2 text-gray-500">Loading fleets...</span>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Total Fleets" value={String(totalFleets)} variant="green" />
            <StatCard title="Total Users" value={String(totalUsers)} variant="indigo" />
            <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} variant="blue" />
            <StatCard title="Total Units" value={`${Math.round(totalUnits/1000).toLocaleString()} kWh`} variant="orange" />
            <StatCard title="Total Duration" value={formatDuration(totalDuration)} variant="purple" />
          </div>

          {/* Fleets Table with Expandable Users */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 w-10"></th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">S.No</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Fleet Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Total Users</th>
                    <th 
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-800 transition-colors select-none"
                      onClick={handleRevenueSort}
                    >
                      <div className="flex items-center">
                        Revenue (₹)
                        {getRevenueSortIcon()}
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Units (kWh)</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Duration</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Transactions</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedAndFilteredFleets.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-xs">No fleets found{fleetNameFilter ? ` matching "${fleetNameFilter}"` : " created yet"}</p>
                        {!fleetNameFilter && (
                          <button
                            onClick={() => setShowAddFleetModal(true)}
                            className="mt-2 text-[#0094FE] text-[11px] hover:underline"
                          >
                            Create your first fleet
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    sortedAndFilteredFleets.flatMap((fleet, index) => {
                      const fleetStats = fleetRevenueData.find(f => f.id === fleet.id);
                      const isExpanded = expandedFleets.has(fleet.id);
                      const fleetUsers = fleet.users || [];
                      const hasUsers = fleetUsers.length > 0;
                      
                      const mainRow = (
                        <tr key={fleet.id} className="hover:bg-gray-50 transition-all duration-200">
                          <td className="px-4 py-3">
                            {hasUsers && (
                              <button
                                onClick={() => toggleExpand(fleet.id)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            )}
                           </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                           </td>
                          <td className="px-4 py-3">
                            <p className="text-xs font-medium text-gray-800">
                              {fleet.name.charAt(0).toUpperCase() + fleet.name.slice(1)}
                            </p>
                           </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              (fleet.userCount || 0) > 0 
                                ? "bg-green-100 text-green-700" 
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {fleet.userCount || 0} Users
                            </span>
                           </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold text-blue-600">
                              ₹{fleetStats?.uv?.toLocaleString() || 0}
                            </span>
                           </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-600">
                              {Math.round(fleetStats?.totalUnits/1000 || 0).toLocaleString()}
                            </span>
                           </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-600" title={fleetStats?.totalDuration ? `${fleetStats.totalDuration} seconds` : ""}>
                                {formatDuration(fleetStats?.totalDuration || 0)}
                              </span>
                            </div>
                           </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-600">
                              {fleetStats?.totalSessions || 0}
                            </span>
                           </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                setSelectedFleetId(fleet.id);
                                setShowAddUserModal(true);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all text-[11px] font-medium"
                              title="Add User"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Add
                            </button>
                           </td>
                         </tr>
                      );
                      
                      const userRows = isExpanded && hasUsers ? fleetUsers.map((userId: string, userIdx: number) => (
                        <tr key={`${fleet.id}-user-${userId}`} className="bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                          <td className="px-4 py-2"> </td>
                          <td className="px-4 py-2"> </td>
                          <td colSpan={2} className="px-4 py-2">
                            <div className="flex items-center gap-2 ml-6">
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs font-mono text-gray-700">{userId}</p>
                                <p className="text-[10px] text-gray-400">User ID</p>
                              </div>
                            </div>
                           </td>
                          <td colSpan={5} className="px-4 py-2 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Active in this fleet
                            </span>
                           </td>
                         </tr>
                      )) : [];
                      
                      return [mainRow, ...userRows];
                    })
                  )}
                </tbody>
               </table>
            </div>
          </div>
        </>
      )}

      {/* Add Fleet Modal */}
      {showAddFleetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-gray-800">Create New Fleet</h2>
              <button onClick={() => setShowAddFleetModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Fleet Name *</label>
                <input
                  type="text"
                  value={newFleetName}
                  onChange={(e) => setNewFleetName(e.target.value)}
                  placeholder="Enter fleet name"
                  className="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setShowAddFleetModal(false)}
                  className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-[11px] font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFleet}
                  disabled={createLoading}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg text-[11px] font-medium disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Create Fleet"}
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User to Fleet Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-gray-800">Add User to Fleet</h2>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSelectedFleetId("");
                  setUserId("");
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
             

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">User ID *</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                  className="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE] font-mono"
                />
              </div>

              {selectedFleetId && (
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <p className="text-[11px] text-gray-600">
                    Target Fleet: <span className="font-semibold text-gray-800">
                      {fleets.find(f => f.id === selectedFleetId)?.name}
                    </span>
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 pt-3">
                 <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setSelectedFleetId("");
                    setUserId("");
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-[11px] font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAttachUserToFleet}
                  disabled={attachLoading || !selectedFleetId || !userId.trim()}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-[11px] font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {attachLoading ? "Adding..." : "Add User to Fleet"}
                </button>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}