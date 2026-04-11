"use client";

import {
  Bell,
  Search,
  Settings,
  ChevronDown,
  LogOut,
  User,
  Menu
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardHeader({title,subtitle}:any) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Get breadcrumb from pathname
  const getBreadcrumb = () => {
    const path = pathname.split("/").filter(Boolean);
    if (path.length === 1) return "Dashboard";
    return path[1].charAt(0).toUpperCase() + path[1].slice(1);
  };

  // User details (in real app, fetch from context/state)
  const userDetails = {
    name: "Reliable Charge",
    email: "reliablecharge@gmail.com",
    role: "Admin",
    board: "Dashboard",
    avatar: "/Images/profile.jpg"
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    router.push("/");
  };

  return (
    <header
      className="fixed top-0 left-0 lg:left-60 right-0 z-40 h-16
      bg-white border-b border-gray-200
      flex items-center justify-between px-4 sm:px-6"
    >
      {/* Left Section - Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => {
            const event = new CustomEvent('toggleSidebar');
            window.dispatchEvent(event);
          }}
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        
        <div>
          <h1 className="text-base font-semibold text-gray-800">
            {title}
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">
          {subtitle}
          </p>
        </div>
      </div>


      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
      

        
        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
          >
            <Image
              src={userDetails.avatar}
              alt="profile"
              width={35}
              height={35}
              className="rounded-full object-cover"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-800">{userDetails.name}</p>
              <p className="text-xs text-gray-500">{userDetails.role}</p>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              {/* User Info in Dropdown */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{userDetails.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{userDetails.email}</p>
                <p className="text-xs text-blue-600 mt-1">{userDetails.board}</p>
              </div>
              
              {/* <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User size={16} className="text-gray-500" />
                Profile
              </button> */}

              {/* <button 
                onClick={() => router.push("/dashboard/settings")}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} className="text-gray-500" />
                Settings
              </button> */}

              <hr className="my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}