"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  Zap,
  Battery,
  Filter
} from 'lucide-react';

// Simple light colors
const AC_COLOR = '#60a5fa'; // Light blue
const DC_COLOR = '#34d399'; // Light green
const CHART_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#2dd4bf', '#fb923c'];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${data.type === 'ac' ? 'bg-blue-400' : 'bg-green-400'}`} />
          <span className="text-gray-600">{data.type === 'ac' ? 'AC' : 'DC'}:</span>
          <span className="font-medium text-gray-800">{data.value.toFixed(1)} kWh</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{data.location}</p>
      </div>
    );
  }
  return null;
};

interface ChargerData {
  name: string;
  type: 'ac' | 'dc';
  value: number;
  location: string;
}

interface ChargerBarChartProps {
  data?: any[];
  title?: string;
  height?: number;
  unit?: string;
  itemsPerPage?: number;
}

export default function ChargerBarChart({
  data = [],
  title = "Charger Energy Consumption",
  height = 400,
  unit = "kWh",
  itemsPerPage = 25
}: ChargerBarChartProps) {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'ac' | 'dc'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableView, setIsTableView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get unique locations with counts (memoized for performance)
  const locations = useMemo(() => {
    const locationMap = new Map<string, { count: number; acCount: number; dcCount: number; totalEnergy: number }>();
    
    for (const item of data) {
      const existing = locationMap.get(item.location);
      if (!existing) {
        locationMap.set(item.location, {
          count: 1,
          acCount: item.type === 'ac' ? 1 : 0,
          dcCount: item.type === 'dc' ? 1 : 0,
          totalEnergy: item.value
        });
      } else {
        existing.count++;
        if (item.type === 'ac') existing.acCount++;
        else existing.dcCount++;
        existing.totalEnergy += item.value;
      }
    }
    
    return Array.from(locationMap.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        acCount: stats.acCount,
        dcCount: stats.dcCount,
        totalEnergy: stats.totalEnergy,
        avgPerCharger: stats.totalEnergy / stats.count
      }))
      .sort((a, b) => b.totalEnergy - a.totalEnergy);
  }, [data]);

  // Filter and sort data (optimized for large datasets)
  const processedData = useMemo(() => {
    let filtered = data;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }
    
    // Sort by value descending for best performance
    return [...filtered].sort((a, b) => b.value - a.value);
  }, [data, searchTerm, selectedLocation, selectedType]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  // Statistics (memoized)
  const statistics = useMemo(() => {
    let totalAC = 0, totalDC = 0, acCount = 0, dcCount = 0, maxValue = 0;
    
    for (const item of processedData) {
      if (item.type === 'ac') {
        totalAC += item.value;
        acCount++;
      } else {
        totalDC += item.value;
        dcCount++;
      }
      if (item.value > maxValue) maxValue = item.value;
    }
    
    const totalEnergy = totalAC + totalDC;
    
    return {
      totalAC: totalAC.toFixed(1),
      totalDC: totalDC.toFixed(1),
      totalEnergy: totalEnergy.toFixed(1),
      avgEnergy: processedData.length ? (totalEnergy / processedData.length).toFixed(1) : '0',
      maxValue: maxValue.toFixed(1),
      acCount,
      dcCount,
      totalChargers: processedData.length,
      totalStations: locations.length
    };
  }, [processedData, locations]);

  // Chart data - show top 20 for performance
  const chartData = useMemo(() => {
    return processedData.slice(0, 20);
  }, [processedData]);

  // Station data for pie chart
  const stationData = useMemo(() => {
    return locations.slice(0, 10).map(loc => ({
      name: loc.name,
      value: loc.totalEnergy,
      count: loc.count
    }));
  }, [locations]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
    setSelectedType('all');
    setCurrentPage(1);
  };

  if (!isClient) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-100 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {statistics.totalChargers} chargers • {statistics.totalStations} stations
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTableView(!isTableView)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isTableView ? '📊 Chart' : '📋 Table'}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <Filter size={12} />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-5 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search charger..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400"
                />
              </div>
              
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg"
              >
                <option value="all">All Stations ({locations.length})</option>
                {locations.slice(0, 15).map(loc => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="ac">AC Only</option>
                <option value="dc">DC Only</option>
              </select>
            </div>
            
            {(searchTerm || selectedLocation !== 'all' || selectedType !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-blue-500">AC Energy</p>
            <p className="text-sm font-semibold text-blue-600">{statistics.totalAC}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-green-500">DC Energy</p>
            <p className="text-sm font-semibold text-green-600">{statistics.totalDC}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-purple-500">Total</p>
            <p className="text-sm font-semibold text-purple-600">{statistics.totalEnergy}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">Avg</p>
            <p className="text-sm font-semibold text-gray-600">{statistics.avgEnergy}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-orange-500">Max</p>
            <p className="text-sm font-semibold text-orange-600">{statistics.maxValue}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-indigo-500">Stations</p>
            <p className="text-sm font-semibold text-indigo-600">{statistics.totalStations}</p>
          </div>
        </div>

        {/* Type Distribution Bar */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setSelectedType('all')}
            className={`flex-1 py-1.5 text-xs rounded-lg transition-all ${
              selectedType === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All ({statistics.totalChargers})
          </button>
          <button
            onClick={() => setSelectedType('ac')}
            className={`flex-1 py-1.5 text-xs rounded-lg transition-all flex items-center justify-center gap-1 ${
              selectedType === 'ac' ? 'bg-blue-400 text-white' : 'bg-blue-50 text-blue-600'
            }`}
          >
            <Zap size={12} /> AC ({statistics.acCount})
          </button>
          <button
            onClick={() => setSelectedType('dc')}
            className={`flex-1 py-1.5 text-xs rounded-lg transition-all flex items-center justify-center gap-1 ${
              selectedType === 'dc' ? 'bg-green-400 text-white' : 'bg-green-50 text-green-600'
            }`}
          >
            <Battery size={12} /> DC ({statistics.dcCount})
          </button>
        </div>

        {/* Chart View */}
        {!isTableView && chartData.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] text-gray-400 mb-2">Top 20 chargers by energy consumption</p>
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={35}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'ac' ? AC_COLOR : DC_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Table View */}
        {isTableView && (
          <div className="mb-5 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Charger</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">Station</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500">Type</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-500">Energy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedData.map((charger) => (
                  <tr key={charger.name} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">{charger.name}</td>
                    <td className="px-3 py-2 text-gray-500">{charger.location}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        charger.type === 'ac' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {charger.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-700">{charger.value.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">
                  {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs text-gray-500 px-2">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export */}
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={() => {
              const csv = processedData.map(item => `${item.name},${item.location},${item.type},${item.value}`).join('\n');
              const blob = new Blob([`Name,Location,Type,Energy(${unit})\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `chargers-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}