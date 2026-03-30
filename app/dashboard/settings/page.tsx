"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem("isAuth");
  window.location.href = "/";
};

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-red-50 via-white to-red-100 p-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center space-y-5">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-red-100 text-red-500">
            <LogOut size={28} />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-gray-800">
          Logout from Dashboard?
        </h2>

        <p className="text-sm text-gray-500">
          Are you sure you want to logout? You’ll need to login again to access your dashboard.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">

          {/* Cancel */}
          <button
            onClick={handleCancel}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 
            hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex-1 py-2 rounded-lg text-white 
            bg-gradient-to-r from-red-500 to-red-400 
            hover:from-red-600 hover:to-red-500 
            transition shadow-md"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}