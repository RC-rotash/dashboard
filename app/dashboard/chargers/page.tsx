"use client";

import { useState } from "react";
import { chargerData } from "@/app/componets/chartData/dummyData";

const ITEMS_PER_PAGE = 20;

export default function ChargersPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(chargerData.length / ITEMS_PER_PAGE);
  const currentData = chargerData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="w-full mx-auto p-2 bg-white mt-16">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Charger Summary</h2>

      <div className="overflow-x-auto">
        <div className="w-full border border-gray-200 rounded-md">
          {/* Header Row */}
          <div className="grid grid-cols-[30px_1fr_80px_70px_70px_90px_70px_80px_70px] 
                          bg-blue-100 text-blue-700 font-semibold text-[11px] p-1 border-b border-gray-200">
            <div className="text-left">Id</div>
            <div className="text-left truncate">Charger Name</div>
            <div className="text-left">Install</div>
            <div className="text-center">Units</div>
            <div className="text-right">Avg kW</div>
            <div className="text-center">Revenue</div>
            <div className="text-right">Avg Unit/Tx</div>
            <div className="text-right">Avg Duration</div>
            <div className="text-right">% Revenue</div>
          </div>

          {/* Data Rows */}
          {currentData.map((charger, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[30px_0.98fr_80px_70px_70px_90px_70px_80px_70px] 
                         text-[11px] font-semibold p-1 border-b border-gray-100
                         bg-white text-gray-600"
            >
              <div className="text-left">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</div>
              <div className="text-left truncate">{charger.name}</div>
              <div className="text-left">{charger.installation || "N/A"}</div>
              <div className="text-right">{charger.units.toLocaleString()}</div>
              <div className="text-right">{charger.avgSpeed}</div>
              <div className="text-right">₹{charger.revenue.toLocaleString()}</div>
              <div className="text-right">{charger.avgUnitTransaction}</div>
              <div className="text-right">{charger.avgDuration}</div>
              <div className="text-right text-blue-600">{charger.revenuePercent}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2 sm:gap-0 text-sm">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}