"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

export default function DashboardLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
const [loginError, setLoginError] = useState("");
 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const validEmail = "reliablecharge@gmail.com";
  const validPassword = "admin@123";

  if (!email || !password) return;

  setIsLoading(true);
  setLoginError("");

  setTimeout(() => {
    if (email === validEmail && password === validPassword) {
      localStorage.setItem("isAuth", "true");

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      router.push("/dashboard");
    } else {
      setLoginError("Invalid email or password");
    }

    setIsLoading(false);
  }, 1000);
};

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXZ8ZW58MHx8MHx8fDA%3D')] bg-cover bg-center opacity-90" />
        
        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Reliable Charge</h1>
              <p className="text-sm text-white/80">EV Charging Solutions</p>
            </div>
          </div>

          {/* Quote */}
          <div className="space-y-4 max-w-md">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-xl font-medium leading-relaxed">
                "Powering the future of mobility, one charge at a time."
              </p>
              <p className="text-sm text-white/80 mt-3">
                Join thousands of EV owners who trust Reliable Charge for their daily charging needs.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-white/80">Charging Stations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-xs text-white/80">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-white/80">Support</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-white/60">
            © 2026 Reliable Charge. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Reliable Charge</h2>
            <p className="text-gray-500 text-sm">EV Charging Dashboard</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-2">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="admin@reliablecharge.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    transition-all duration-200 bg-gray-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    transition-all duration-200 bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
{loginError && (
  <p className="text-sm text-red-500 text-center">{loginError}</p>
)}
              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-green-600 to-green-500
                hover:from-green-700 hover:to-green-600
                transition-all duration-300 shadow-lg hover:shadow-xl
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Credentials */}
              {/* <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Demo Credentials
                </p>
                <div className="flex justify-center gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="text-gray-600 ml-1 font-medium">admin@reliablecharge.com</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Password:</span>
                    <span className="text-gray-600 ml-1 font-medium">admin123</span>
                  </div>
                </div>
              </div> */}
            </form>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <button className="text-green-600 hover:text-green-700 font-medium">
              Contact Admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}