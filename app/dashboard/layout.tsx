"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home, BarChart3, MapPin, Zap, IndianRupee,
  Activity, Battery, AlertTriangle, TrendingUp,
  FileText, Users, CreditCard, Settings, FileClock,
  ChevronRight, Menu, X
} from "lucide-react";
import DashboardHeader from "../componets/DashboardHeader";
import LogoutPage from "../componets/LogoutPage";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/overview", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/sites", label: "Sites", icon: MapPin },
  { href: "/dashboard/chargers", label: "Chargers", icon: Zap },
  { href: "/dashboard/revenue", label: "Revenue", icon: IndianRupee },
  { href: "/dashboard/sessions", label: "Sessions", icon: Activity },
  { href: "/dashboard/energy", label: "Energy", icon: Battery },
  { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/dashboard/utilization", label: "Utilization", icon: TrendingUp },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/logs", label: "Logs", icon: FileClock },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAuth");
    setIsAuth(!!auth);

      if (!auth) {
    window.location.href = "/";
  }
  }, []);

  // ⏳ prevent flicker
  if (isAuth === null) return null;

  return (
    isAuth ? (
      <div className="flex min-h-screen bg-gray-100">

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 w-60 h-full bg-white border-r shadow-lg
        overflow-y-auto z-50 transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

          <div className="flex items-center justify-between p-3">
            <Image src="/Images/logo.png" alt="EV Charger" width={160} height={80} />
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium
                  ${isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white"
                    : "text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} />
                    {item.label}
                  </div>

                  <ChevronRight size={16} />
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Hamburger */}
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        <DashboardHeader />

        {/* Main */}
        <main className="flex-1 lg:ml-60">
          {children}
        </main>
      </div>
    ) : (
      <LogoutPage />
    )
  );
}