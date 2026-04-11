"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { useState, useEffect, useMemo } from "react";

interface Props {
  data: {
    name: string;
    uv: number;
    fullName?: string;
    totalUnits?: number;
    totalSessions?: number;
    utilization?: number;
  }[];
  title?: string;
  height?: number | string;
}

const SimpleBarChart = ({ data, title, height = 400 }: Props) => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<"top" | "all">("top");

  // 📱 Screen detect
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ✂️ Truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // 💰 Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 📊 Format Y axis
  const formatYAxis = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value;
  };

  // 🔥 Process data for Top view (Top N + Others)
  const processedTopData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const TOP_N = isMobile ? 8 : 15;

    const sorted = [...data].sort((a, b) => b.uv - a.uv);

    const top = sorted.slice(0, TOP_N);
    const rest = sorted.slice(TOP_N);

    const others = rest.reduce(
      (acc, curr) => ({
        uv: acc.uv + curr.uv,
        totalUnits: (acc.totalUnits || 0) + (curr.totalUnits || 0),
        totalSessions: (acc.totalSessions || 0) + (curr.totalSessions || 0),
      }),
      { uv: 0, totalUnits: 0, totalSessions: 0 }
    );

    const finalData = rest.length > 0 ? [...top, { name: "Others", ...others }] : top;

    return finalData.map((item) => {
      let displayName = item.name;
      let originalName = item.name;
      
      if (item.name === "Others") {
        displayName = "Others";
        originalName = "Other Chargers (Combined)";
      } else {
             const maxLen = isMobile ? 6  :10;
        displayName = truncateText(item.name, maxLen);
        originalName = item.name;
      }
      
      return {
        ...item,
        originalName: originalName,
        name: displayName,
        fullName: item.fullName || item.name,
      };
    });
  }, [data, isMobile]);

  // 🔥 Process data for All view (apply truncation to all items)
  const processedAllData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sorted = [...data].sort((a, b) => b.uv - a.uv);

    return sorted.map((item) => {
      const maxLen = isMobile ? 6  :10;
      return {
        ...item,
        originalName: item.name,
        name: truncateText(item.name, maxLen),
        fullName: item.fullName || item.name,
      };
    });
  }, [data, isMobile]);

  // Select data based on view mode
  const displayData = viewMode === "top" ? processedTopData : processedAllData;

  // 📊 Calculate stats for display
  const totalItems = displayData.length;
  const totalRevenue = displayData.reduce((sum, item) => sum + (item.uv || 0), 0);
  const maxRevenue = Math.max(...displayData.map((item) => item.uv || 0), 0);

  // 📏 Dynamic bar size
  const getBarSize = () => {
    if (isMobile) return Math.max(20, Math.min(35, 350 / (displayData.length || 1)));
    return Math.max(30, Math.min(50, 500 / (displayData.length || 1)));
  };

  // 🧠 Smart X-axis props with better ellipsis handling
  const getXAxisProps = () => {
    // Dynamic interval based on data length
    const interval =0
    if (isMobile) {
      return {
        dataKey: "name",
        tick: { 
          fontSize: 8, 
          fill: "#6b7280",
          fontWeight: 400,
        },
        interval: interval,
        angle: -35,
        textAnchor: "end" as const,
        height: 60,
        tickMargin: 5,
        axisLine: { stroke: "#e5e7eb", strokeWidth: 1 },
        tickLine: false,
      };
    }
    return {
      dataKey: "name",
      tick: { 
        fontSize: 10, 
        fill: "#4b5563", 
        fontWeight: 500,
      },
      interval: interval,
      angle: -35,
      textAnchor: "end" as const,
      height: 75,
      tickMargin: 8,
      axisLine: { stroke: "#e5e7eb", strokeWidth: 1 },
      tickLine: false,
    };
  };

  // YAxis props
  const getYAxisProps :any = () => {
    return {
      tick: { fontSize: isMobile ? 10 : 12, fill: "#6b7280" },
      tickFormatter: formatYAxis,
      width: 30,
      axisLine: false,
      tickLine: false,
    };
  };

  // Custom Tooltip with full name
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const revenueValue = payload[0].value || 0;
      const percentage = totalRevenue > 0 ? (revenueValue / totalRevenue) * 100 : 0;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-xl min-w-[220px] max-w-[300px]">
          <p className="text-xs font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-100 break-words">
            {d.originalName || d.fullName || label}
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Revenue:</span>
              <span className="text-xs font-bold text-[#0094FE]">
                {formatCurrency(revenueValue)}
              </span>
            </div>
           
            {d.totalUnits !== undefined && d.totalUnits > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Units:</span>
              <span className="text-xs text-gray-700">
  {(d.totalUnits / 1000).toLocaleString("en-IN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}{" "}
  kWh
</span>
              </div>
            )}
            {d.totalSessions !== undefined && d.totalSessions > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Sessions:</span>
                <span className="text-xs text-gray-700">{d.totalSessions.toLocaleString()}</span>
              </div>
            )}
            {d.utilization !== undefined && d.utilization > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Utilization:</span>
                <span className="text-xs text-gray-700">{d.utilization.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // No data state
  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center bg-gray-50 rounded-xl"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <svg
          className="w-12 h-12 text-gray-300 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const containerHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div className="w-full flex flex-col bg-white rounded-xl" style={{ height: containerHeight }}>
      {/* Title + Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb3">
        {title && (
          <div>
            <h2 className="text-sm md:text-base font-semibold text-gray-800">{title}</h2>
            
          </div>
        )}

        <div className="flex gap-1.5 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("top")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === "top"
                ? "bg-white text-[#0094FE] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Top {isMobile ? 8 : 15}
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === "all"
                ? "bg-white text-[#0094FE] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All ({data.length})
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
           
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />

            <XAxis {...getXAxisProps()} />

            <YAxis {...getYAxisProps()} />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />

            {displayData.length > (isMobile ? 15 : 25) && (
              <Brush
                dataKey="name"
                height={25}
                stroke="#0094FE"
                fill="#f0f9ff"
                travellerWidth={8}
                startIndex={0}
                endIndex={Math.min(19, displayData.length - 1)}
                className="mt-2"
              />
            )}

            <Bar
              dataKey="uv"
              fill="#0094FE"
              barSize={getBarSize()}
              radius={[6, 6, 0, 0]}
              animationDuration={800}
              animationBegin={0}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats (Mobile) */}
      {isMobile && displayData.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100 px-1">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Max: {formatCurrency(maxRevenue)}</span>
            <span>Total: {formatCurrency(totalRevenue)}</span>
            <span>Items: {displayData.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleBarChart;