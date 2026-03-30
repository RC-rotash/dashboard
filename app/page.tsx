"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export default function DashboardLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      localStorage.setItem("isAuth", "true");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-green-50 via-white to-green-100 p-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md 
      border border-green-100 rounded-2xl shadow-xl p-6 space-y-5">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-500">
            Login to your dashboard
          </p>
        </div>

        {/* Email */}
        <div className="relative">
          <Mail size={16} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock size={16} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-lg text-white font-medium
          bg-gradient-to-r from-green-500 to-green-400
          hover:from-green-600 hover:to-green-500
          transition-all duration-300 shadow-md"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400">
          Powered by Reliable Charge ⚡
        </p>

      </div>
    </div>
  );
}