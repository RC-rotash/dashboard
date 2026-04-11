"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit2, 
  Save, 
  X,
  Camera,
  Building,
  Briefcase,
  Award,
  Clock,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 98765 43210",
    location: "Noida, Uttar Pradesh",
    role: "Senior Fleet Manager",
    company: "EV Charging Solutions",
    department: "Operations",
    joinDate: "15 January 2024",
    employeeId: "EMP001234",
    experience: "5+ years",
    achievements: "Top Performer 2024"
  });

  const [formData, setFormData] = useState({ ...userData });

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    window.location.href = "/";
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setUserData(formData);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-1">
      <div className="max-w-4xl mx-auto">
        
       

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Cover with pattern */}
          <div className="relative h-32 bg-gradient-to-r from-[#0094FE] via-blue-500 to-cyan-500">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1.5" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern)" />
              </svg>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar Section */}
            <div className="flex justify-between items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-r from-[#0094FE] to-blue-600 p-1 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-[#0094FE] to-blue-600 bg-clip-text text-transparent">
                      {userData.name.charAt(0)}
                    </span>
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors border border-gray-200">
                    <Camera className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                )}
              </div>
              
              {/* Edit/Logout Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xs font-medium hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-gradient-to-r from-[#0094FE] to-blue-600 text-white rounded-xl text-xs font-medium hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-medium hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name & Role */}
            <div className="mb-6">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-xl font-bold text-gray-800 border border-gray-200 rounded-lg px-3 py-1 w-full max-w-md mb-2"
                  />
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 w-full max-w-[200px]"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{userData.role}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-xs text-[#0094FE] font-medium">{userData.experience}</span>
                  </div>
                </>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-center">
                <Award className="w-5 h-5 text-[#0094FE] mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-800">{userData.achievements}</p>
                <p className="text-[9px] text-gray-500">Achievement</p>
              </div>
              <div className="text-center border-l border-blue-200">
                <Clock className="w-5 h-5 text-[#0094FE] mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-800">{userData.experience}</p>
                <p className="text-[9px] text-gray-500">Experience</p>
              </div>
             
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Mail className="w-4 h-4 text-[#0094FE]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 mt-0.5">{userData.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Phone className="w-4 h-4 text-[#0094FE]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Phone</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 mt-0.5">{userData.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-[#0094FE]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 mt-0.5">{userData.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building className="w-4 h-4 text-[#0094FE]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Company</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 mt-0.5">{userData.company}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Briefcase className="w-4 h-4 text-[#0094FE]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Department</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 mt-0.5">{userData.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-[#0094FE]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Joined</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 mt-0.5">{userData.joinDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Employee ID Badge */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Employee ID:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                  />
                ) : (
                  <span className="text-xs font-mono text-gray-700">{userData.employeeId}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <LogOut className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Ready to Leave?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to logout? You'll need to login again to access your account.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0094FE] to-blue-600 flex items-center justify-center text-white font-bold">
                      {userData.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{userData.name}</p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    Stay
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}