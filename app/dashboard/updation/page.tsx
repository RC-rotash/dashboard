

"use client";

import { useApi } from "@/app/componets/api/apiService";
import { useState, useEffect, useMemo } from "react";

interface Charger {
  id: string;
  name: string;
  property_id: string;
  power_output: string;
  group?: string;
  installDate?: string;
}

export default function ChargerUpdation() {
  const { get, post } = useApi();
  
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "assigned" | "unassigned">("all");
  
  // Form states
  const [selectedGroup, setSelectedGroup] = useState("");
  const [installDate, setInstallDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Group options
  const groupOptions = [
    { id: "group-1", value: "NOIDA135HUB", label: "Noida 135 Hub", color: "bg-blue-100 text-blue-800" },
    { id: "group-2", value: "STANDALONE", label: "Standalone", color: "bg-green-100 text-green-800" },
    { id: "group-3", value: "HIGHWAY", label: "Highway", color: "bg-purple-100 text-purple-800" },
    { id: "group-4", value: "RWA", label: "RWA", color: "bg-orange-100 text-orange-800" }
  ];

  // Fetch charger list
  const fetchChargers = async () => {
    try {
      setLoading(true);
      const response = await get<any>("/public/charger-list");
      console.log("Charger list response:", response);
      const data = response?.data || [];
      setChargers(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch charger list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, []);

  // Filter chargers based on search and assignment filter
  const filteredChargers = useMemo(() => {
    let filtered = [...chargers];
    
    // Apply assignment filter
    if (assignmentFilter === "assigned") {
      filtered = filtered.filter(c => c.group);
    } else if (assignmentFilter === "unassigned") {
      filtered = filtered.filter(c => !c.group);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        c.power_output.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [chargers, assignmentFilter, searchQuery]);

  // Handle update click
  const handleUpdateClick = (charger: Charger) => {
    setSelectedCharger(charger);
    setSelectedGroup(charger.group || "");
    setInstallDate(charger.installDate || new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  // Handle update submission
  const handleUpdateSubmit = async () => {
    if (!selectedCharger) {
      setError("No charger selected");
      return;
    }
    
    if (!selectedGroup) {
      setError("Please select a group");
      return;
    }
    
    if (!installDate) {
      setError("Please select install date");
      return;
    }
    
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      
      const payload = {
        chargerId: selectedCharger.id,
        installDate: installDate,
        group: selectedGroup
      };
      
      console.log("Sending payload to /admin/attach-charger:", payload);
      
      const response = await post<any>("/admin/group-list", payload);
      
      console.log("Update response:", response);
      
      if (response?.status === 200 || response?.status === 201) {
        setSuccess(`Charger "${selectedCharger.name}" updated successfully!`);
        
        // Update local state
        setChargers(prev => prev.map(c => 
          c.id === selectedCharger.id 
            ? { ...c, group: selectedGroup, installDate: installDate }
            : c
        ));
        
        // Close modal after 1.5 seconds
        setTimeout(() => {
          setShowModal(false);
          setSelectedCharger(null);
          setSelectedGroup("");
          setInstallDate("");
          setSuccess(null);
        }, 1500);
      } else {
        setError(response?.message || "Failed to update charger");
      }
    } catch (err: any) {
      console.error("Update error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update charger. Please try again.";
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCharger(null);
    setSelectedGroup("");
    setInstallDate("");
    setError(null);
    setSuccess(null);
  };

  // Get group badge color
  const getGroupBadge = (group?: string) => {
    if (!group) return "bg-gray-100 text-gray-500";
    const option = groupOptions.find(g => g.value === group);
    return option?.color || "bg-gray-100 text-gray-500";
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0094FE] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chargers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#0094FE] to-blue-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Charger Management
              </h1>
              <p className=" text-xs text-gray-500">Update charger groups and installation dates</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div key="stat-total" className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-medium">Total Chargers</p>
            <p className="text-2xl font-bold text-black-800">{chargers.length}</p>
          </div>
          <div key="stat-assigned" className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium">Assigned</p>
            <p className="text-2xl font-bold text-black-800">{chargers.filter(c => c.group).length}</p>
          </div>
          <div key="stat-unassigned" className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium">Unassigned</p>
            <p className="text-2xl font-bold text-black-800">{chargers.filter(c => !c.group).length}</p>
          </div>
          <div key="stat-groups" className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-medium">Groups Available</p>
            <p className="text-2xl font-bold text-black-800">{groupOptions.length}</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="rounded-xl pb-5">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search Charger</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, ID, or power output..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2  text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE] focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Assignment Filter Buttons */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Status</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAssignmentFilter("all")}
                  className={`px-4 py-2 rounded-lg  text-xs font-medium transition-all ${
                    assignmentFilter === "all"
                      ? "bg-gradient-to-r from-[#0094FE] to-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setAssignmentFilter("assigned")}
                  className={`px-4 py-2 rounded-lg  text-xs font-medium transition-all ${
                    assignmentFilter === "assigned"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Assigned
                </button>
                <button
                  onClick={() => setAssignmentFilter("unassigned")}
                  className={`px-4 py-2 rounded-lg  text-xs font-medium transition-all ${
                    assignmentFilter === "unassigned"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Unassigned
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chargers Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0094FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">Charger List</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-6 py-3 font-medium">Charger Name</th>
                  <th className="px-6 py-3 font-medium">Charger ID</th>
                  <th className="px-6 py-3 font-medium">Power Output</th>
                  <th className="px-6 py-3 font-medium">Group</th>
                  <th className="px-6 py-3 font-medium">Install Date</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredChargers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No chargers found
                    </td>
                  </tr>
                ) : (
                  filteredChargers.map((charger) => (
                    <tr key={charger.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <span className="text-xs font-medium text-gray-800">{charger.name}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs font-mono text-gray-500">{charger.id}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          charger.power_output === "DC" 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {charger.power_output}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {charger.group ? (
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getGroupBadge(charger.group)}`}>
                            {groupOptions.find(g => g.value === charger.group)?.label || charger.group}
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs text-gray-500">
                          {charger.installDate || "Not set"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleUpdateClick(charger)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && selectedCharger && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-[#0094FE] to-blue-600 rounded-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Update Charger</h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Charger Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Charger</p>
                <p className="text-xs font-medium text-gray-800">{selectedCharger.name}</p>
                <p className="text-xs font-mono text-gray-400 mt-1">ID: {selectedCharger.id}</p>
                <p className="text-xs text-gray-500 mt-1">Power: {selectedCharger.power_output}</p>
              </div>

              {/* Group Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Select Group *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {groupOptions.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        selectedGroup === group.value
                          ? `${group.color} ring-2 ring-offset-1 ring-[#0094FE]`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Install Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Install Date *
                </label>
                <input
                  type="date"
                  value={installDate}
                  onChange={(e) => setInstallDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094FE] focus:border-transparent"
                />
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-xs flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Charger
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}