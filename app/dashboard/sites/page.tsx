"use client";

import { useState } from "react";
import { datasimple, pieDataDayOfWeek } from "@/app/componets/chartData/dummyData";
import PieChartComponent from "@/app/componets/charts/PieChartComponent";
import SimpleBarChart from "@/app/componets/charts/SimpleBarChart";

const filters = ["Today", "Yesterday", "1M", "6M", "1Y", "3Y"];

export default function SitesPage() {
  const [activeFilter, setActiveFilter] = useState("Yesterday");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getFilterDate = (filter: string) => {
    const today = new Date();
    let date = new Date(today);

    switch (filter) {
      case "Today": return today;
      case "Yesterday": date.setDate(today.getDate() - 1); return date;
      case "1M": date.setMonth(today.getMonth() - 1); return date;
      case "6M": date.setMonth(today.getMonth() - 6); return date;
      case "1Y": date.setFullYear(today.getFullYear() - 1); return date;
      case "3Y": date.setFullYear(today.getFullYear() - 3); return date;
      default: return today;
    }
  };

  const filteredData = datasimple.filter((item) => {
    const itemDate = new Date(item.id);

    if (startDate && endDate) {
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    }

    switch (activeFilter) {
      case "Today":
      case "Yesterday":
        return item.id === getFilterDate(activeFilter).toISOString().split("T")[0];
      case "1M":
      case "6M":
      case "1Y":
      case "3Y":
        const start = getFilterDate(activeFilter);
        const end = new Date();
        return itemDate >= start && itemDate <= end;
      default: return true;
    }
  });

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 md:p-8 space-y-6 mt-16">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Sites Analytics
          </h1>
        </div>

        {/* FILTERS + CALENDAR */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveFilter(item);
                setStartDate("");
                setEndDate("");
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all
                ${activeFilter === item && !startDate
                  ? "bg-[#0094FE] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {item}
            </button>
          ))}

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Calendar Range */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
          />
          <span className="text-gray-500 px-1">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-sm px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0094FE]"
          />
        </div>
      </div>

      {/* TOP CHART */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
        {filteredData.length > 0 ? (
          <SimpleBarChart
            height={350}
            data={filteredData}
            title={`Revenue by Site ${
              startDate && endDate
                ? `(${startDate} to ${endDate})`
                : `(${activeFilter})`
            }`}
          />
        ) : (
          <div className="flex justify-center items-center h-[350px] text-gray-400 font-medium text-lg">
            No data found
          </div>
        )}
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
          <PieChartComponent
            data={pieDataDayOfWeek}
            title="Revenue Share by Property"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition">
          <PieChartComponent
            data={pieDataDayOfWeek}
            title="Units Distribution (Weekly)"
          />
        </div>
      </div>
    </div>
  );
}