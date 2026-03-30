"use client";

import {
  Bell,
  Search,
  Settings,
  ChevronDown,
  LogOut,
  User
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    router.replace("/dashboard/settings");
  };

  return (
    <header
      className="fixed top-0 left-0 lg:left-60 right-0 z-40 h-16
      bg-white border-b border-gray-200
      flex items-center justify-between px-6 "
    >
      {/* 🔹 Left */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-gray-800">
          Analytics Dashboard
        </h1>
      </div>

      {/* 🔹 Center - Wide Search */}
      <div className="flex-1 flex justify-center px-6">
        <div className="w-full max-w-xl flex items-center border border-gray-200 bg-gray-50 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search anything..."
            className="ml-2 w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* 🔹 Right */}
      <div className="flex items-center gap-3">

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          <Settings size={18} className="text-gray-600" />
        </button>

        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg"
          >
            <Image
              src="/Images/profile.jpg"
              alt="profile"
              width={35}
              height={35}
              className="rounded-full"
            />
            <ChevronDown size={14} className="text-gray-500" />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-md border p-2">

              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded">
                <User size={16} /> Profile
              </button>

              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded">
                <Settings size={16} /> Settings
              </button>

              <hr className="my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded"
              >
                <LogOut size={16} /> Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}