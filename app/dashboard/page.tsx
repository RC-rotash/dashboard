

"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "../componets/cards/StatCard";
import { useApi } from "../componets/api/apiService";
import DashboardHeader from "../componets/DashboardHeader";

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
type SortField = "revenue" | "sessions" | "units" | "utilization" | null;
type SortOrder = "asc" | "desc";

export default function DashboardHomePage() {
  const { get } = useApi();

  const [reportData, setReportData] = useState<TransactionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting states
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  // Date filter states
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [customStartDate, setCustomStartDate] = useState("2025-01-01");
  const [customEndDate, setCustomEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

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

  // Helper function to format date in Indian format (DD/MM/YYYY)
  const formatIndianDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDateRangeString = () => {
    const today = new Date();
    let startDate = "";
    let endDate = "";

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    switch (dateRange) {
      case "overall":
        startDate = "2025-01-01";
        endDate = formatDate(today);
        break;

      case "yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = formatDate(yesterday);
        endDate = formatDate(yesterday);
        break;
      }

      case "week": {
        // Previous completed week: Monday to Sunday
        const currentDay = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

        const currentWeekMonday = new Date(today);
        currentWeekMonday.setDate(today.getDate() - daysSinceMonday);

        const lastWeekMonday = new Date(currentWeekMonday);
        lastWeekMonday.setDate(currentWeekMonday.getDate() - 7);

        const lastWeekSunday = new Date(currentWeekMonday);
        lastWeekSunday.setDate(currentWeekMonday.getDate() - 1);

        startDate = formatDate(lastWeekMonday);
        endDate = formatDate(lastWeekSunday);
        break;
      }

      case "month": {
        // Previous full calendar month
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        startDate = formatDate(firstDayLastMonth);
        endDate = formatDate(lastDayLastMonth);
        break;
      }

      case "custom":
        startDate = customStartDate;
        endDate = customEndDate;
        break;
    }

    return { startDate, endDate };
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);

      const { startDate, endDate } = getDateRangeString();

      if (!startDate || !endDate) {
        setError("Please select valid dates");
        setLoading(false);
        return;
      }

      const response = await get<any>(
        `public/report?start_date=${startDate}&end_date=${endDate}`
      );

      const data = response?.data || [];
      console.log("data---------", data)

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

  useEffect(() => {
    fetchReportData();
  }, [dateRange, customStartDate, customEndDate]);

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

    if (data.length > 0) {
      const avgUtilization = data.reduce((s, i) => s + i.utilization_percentage, 0) / data.length;
      setOverallUtilization(avgUtilization);
    } else {
      setOverallUtilization(0);
    }
  };

  const activeChargersList = useMemo(
    () => reportData.filter((i) => (i.utilization_percentage ?? 0) >= 4),
    [reportData]
  );

  const inactiveChargersList = useMemo(
    () => reportData.filter((i) => (i.utilization_percentage ?? 0) <= 3),
    [reportData]
  );

  const totalChargers = reportData.length;
  const activeCount = activeChargersList.length;
  const inactiveCount = inactiveChargersList.length;

  const tabFilteredData = useMemo(() => {
    if (selectedTab === "active") return activeChargersList;
    if (selectedTab === "inactive") return inactiveChargersList;
    return reportData;
  }, [selectedTab, reportData, activeChargersList, inactiveChargersList]);

  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return tabFilteredData;

    const query = searchQuery.toLowerCase();
    return tabFilteredData.filter(
      (item) =>
        item.charger.toLowerCase().includes(query) ||
        item.charger_id.toLowerCase().includes(query) ||
        item.station_id.toLowerCase().includes(query)
    );
  }, [tabFilteredData, searchQuery]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortField) return searchedData;

    return [...searchedData].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case "revenue":
          aValue = a.total_revenue;
          bValue = b.total_revenue;
          break;
        case "sessions":
          aValue = a.total_sessions;
          bValue = b.total_sessions;
          break;
        case "units":
          aValue = a.total_units;
          bValue = b.total_units;
          break;
        case "utilization":
          aValue = a.utilization_percentage;
          bValue = b.utilization_percentage;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [searchedData, sortField, sortOrder]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchQuery, sortField, sortOrder]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-3 h-3 ml-1 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === "asc" ? (
      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const formatRevenue = (v: number) => v.toLocaleString("en-IN");
  const formatUnits = (v: number) => `${v.toLocaleString("en-IN")} kWh`;

  const formatChargingTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const getBatteryPercentage = (utilization: number) => {
    return Math.min(100, Math.max(0, Math.floor(utilization)));
  };

  const formatUtilization = (utilization: number) => {
    return `${(utilization ?? 0).toFixed(1)}%`;
  };

  const BatteryIndicator = ({ percentage }: { percentage: number }) => {
    const safePercentage = Math.max(0, Math.min(100, percentage));

    const getBatteryColor = () => {
      if (safePercentage >= 4) return "from-green-500 to-green-400";
      return "from-red-500 to-red-400";
    };

    return (
      <div className="flex items-center gap-1.5">
        <div className="relative w-8 h-3 bg-gray-200 rounded-sm overflow-hidden border border-gray-300">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getBatteryColor()} transition-all duration-500 ease-out`}
            style={{ width: `${safePercentage === 0 ? 6 : safePercentage}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/20"></div>
          </div>
        </div>
      </div>
    );
  };

  const handlePresetSelect = (range: DateRange) => {
    setDateRange(range);
    setShowCustomPicker(false);
  };

  const handleCustomClick = () => {
    setDateRange("custom");
    setShowCustomPicker(true);
    setTempStartDate(customStartDate);
    setTempEndDate(customEndDate);
  };

  const handleApplyCustomDates = () => {
    if (tempStartDate && tempEndDate) {
      setCustomStartDate(tempStartDate);
      setCustomEndDate(tempEndDate);
      setShowCustomPicker(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getDateRangeDisplay = () => {
    const today = new Date();

    switch (dateRange) {
      case "overall":
        return `01/01/2025 - ${formatIndianDate(
          (() => {
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, "0");
            const d = String(today.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
          })()
        )}`;

      case "yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const y = yesterday.getFullYear();
        const m = String(yesterday.getMonth() + 1).padStart(2, "0");
        const d = String(yesterday.getDate()).padStart(2, "0");

        return formatIndianDate(`${y}-${m}-${d}`);
      }

      case "week": {
        const currentDay = today.getDay();
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

        const currentWeekMonday = new Date(today);
        currentWeekMonday.setDate(today.getDate() - daysSinceMonday);

        const lastWeekMonday = new Date(currentWeekMonday);
        lastWeekMonday.setDate(currentWeekMonday.getDate() - 7);

        const lastWeekSunday = new Date(currentWeekMonday);
        lastWeekSunday.setDate(currentWeekMonday.getDate() - 1);

        const start = `${lastWeekMonday.getFullYear()}-${String(
          lastWeekMonday.getMonth() + 1
        ).padStart(2, "0")}-${String(lastWeekMonday.getDate()).padStart(2, "0")}`;

        const end = `${lastWeekSunday.getFullYear()}-${String(
          lastWeekSunday.getMonth() + 1
        ).padStart(2, "0")}-${String(lastWeekSunday.getDate()).padStart(2, "0")}`;

        return `${formatIndianDate(start)} - ${formatIndianDate(end)}`;
      }

      case "month": {
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        const start = `${firstDayLastMonth.getFullYear()}-${String(
          firstDayLastMonth.getMonth() + 1
        ).padStart(2, "0")}-${String(firstDayLastMonth.getDate()).padStart(2, "0")}`;

        const end = `${lastDayLastMonth.getFullYear()}-${String(
          lastDayLastMonth.getMonth() + 1
        ).padStart(2, "0")}-${String(lastDayLastMonth.getDate()).padStart(2, "0")}`;

        return `${formatIndianDate(start)} - ${formatIndianDate(end)}`;
      }

      case "custom":
        return `${formatIndianDate(customStartDate)} to ${formatIndianDate(customEndDate)}`;

      default:
        return "";
    }
  };

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
      <DashboardHeader subtitle={'EV Charging Performance Dashboard'} title={'Overview'} />
      {/* Filter Section */}
      <div className="mt-16 bg-gradient-to-r from-purple-50/80 via-blue-50/80 to-cyan-50/80 rounded-xl border border-purple-100/50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-lg">
            <svg className="w-3.5 h-3.5 text-[#0094FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-xs font-medium text-gray-600">Filter:</span>
          </div> */}

          <button
            onClick={() => handlePresetSelect("yesterday")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${dateRange === "yesterday"
              ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Yesterday</span>
          </button>

          <button
            onClick={() => handlePresetSelect("week")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${dateRange === "week"
              ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Last Week</span>
          </button>

          <button
            onClick={() => handlePresetSelect("month")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${dateRange === "month"
              ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Last Month</span>
          </button>
          <button
            onClick={() => handlePresetSelect("overall")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${dateRange === "overall"
              ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M4 20L20 4" />
            </svg>
            <span>Overall</span>
          </button>
          <button
            onClick={handleCustomClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs ${dateRange === "custom"
              ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Custom</span>
          </button>

          <div className="flex items-center gap-1.5 ml-1 px-2 py-1 bg-white/60 rounded-lg">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Active:</span>
            <span className="text-xs font-medium text-gray-700">
              {getDateRangeDisplay()}
            </span>
          </div>
        </div>

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
        <StatCard title="Total Revenue" value={`₹${formatRevenue(totalRevenue)}`} variant="blue" />
        <StatCard title="Transactions" value={String(totalTransactions)} variant="orange" />
        <StatCard title="Units" value={formatUnits(totalUnitsKwh)} variant="purple" />
        <StatCard title="Overall Utilization" value={formatUtilization(overallUtilization)} variant="cyan" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard variant="green" title="Total Charging Time" value={formatChargingTime(totalChargingTimeSeconds)} />

        <div className="rounded-xl p-[1px] bg-gradient-to-r from-green-100 to-blue-50 shadow-md">
          <div className="rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-xs font-semibold text-gray-700">Chargers Overview</p>
            </div>



            <div className="flex gap-2">
              {["all", "active", "inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as any)}
                  className={`flex items-center justify-center flex-1 py-1 rounded-lg transition-all ${selectedTab === tab
                      ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {tab === "all" && (
                    <p className="text-xs">All</p>
                  )}
                  {tab === "active" && (
                    <svg
                      className={`w-5 h-5 ${selectedTab === tab ? "text-white" : "text-green-500"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16l5-5 4 4 7-7" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h4v4" />
                    </svg>
                  )}
                  {tab === "inactive" && (
                    <svg
                      className={`w-5 h-5 ${selectedTab === tab ? "text-white" : "text-red-500"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l5 5 4-4 7 7" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16h4v-4" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl p-[1px] bg-gradient-to-r from-purple-50 to-blue-50 shadow-md">
        <div className="rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <p className="text-xs font-semibold text-gray-700">
                Chargers List ({sortedData.length})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Show:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by charger name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0094FE] bg-white w-64"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                  <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-left">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Charger</th>
                  <th
                    className="px-2 pb-2 cursor-pointer hover:text-gray-700 transition-colors select-none"
                    onClick={() => handleSort("revenue")}
                  >
                    <div className="flex items-center">
                      Revenue
                      {getSortIcon("revenue")}
                    </div>
                  </th>
                  <th
                    className="px-2 pb-2 cursor-pointer hover:text-gray-700 transition-colors select-none"
                    onClick={() => handleSort("sessions")}
                  >
                    <div className="flex items-center">
                      Sessions
                      {getSortIcon("sessions")}
                    </div>
                  </th>
                  <th
                    className="px-2 pb-2 cursor-pointer hover:text-gray-700 transition-colors select-none"
                    onClick={() => handleSort("units")}
                  >
                    <div className="flex items-center">
                      Units
                      {getSortIcon("units")}
                    </div>
                  </th>
                  <th
                    className="px-2 pb-2 cursor-pointer hover:text-gray-700 transition-colors select-none"
                    onClick={() => handleSort("utilization")}
                  >
                    <div className="flex items-center">
                      Utilization
                      {getSortIcon("utilization")}
                    </div>
                  </th>
                  <th className="px-2 pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No chargers found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    const isActive = item.utilization_percentage > 3.9;
                    const batteryPercent = getBatteryPercentage(item.utilization_percentage);
                    return (
                      <tr key={item.charger_id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                        <td className="py-2 font-medium text-gray-700">
                          {index + 1}</td>
                        <td className="py-2 font-medium text-gray-700">
                          <div className="flex flex-col">
                            <span>{item.charger}</span>
                            <span className="text-[10px] text-gray-400">{item.charger_id}</span>
                          </div>
                        </td>
                        <td className="text-gray-600 px-2">₹{formatRevenue(item.total_revenue)}</td>
                        <td className="text-gray-600 px-2">{item.total_sessions}</td>
                        <td className="text-gray-600 px-2">{(item.total_units / 1000).toFixed(1)}</td>
                        <td className="text-gray-600 px-2">
                          <div className="flex items-center gap-2">
                            <BatteryIndicator percentage={batteryPercent} />
                            <span className="text-xs text-gray-500 min-w-[32px]">
                              {formatUtilization(item.utilization_percentage ?? 0)}
                            </span>
                          </div>
                        </td>
                        <td className="text-gray-600 px-2">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {isActive ?
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16l5-5 4 4 7-7" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h4v4" />
                              </svg> :
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l5 5 4-4 7 7" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16h4v-4" />
                              </svg>
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedData.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs transition-all ${currentPage === pageNum ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
