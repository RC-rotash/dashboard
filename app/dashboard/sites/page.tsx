import { data, pieDataDayOfWeek } from "@/app/componets/chartData/dummyData";
import PieChartComponent from "@/app/componets/charts/PieChartComponent";
import RevenueChart from "@/app/componets/charts/RevenueChart";

export default function SitesPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 space-y-6 mt-13">

      {/* 🔹 Header */}
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Sites Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Monitor performance across all EV charging sites
        </p>
      </div>

      {/* 🔹 Top Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
          <RevenueChart data={data} title="Units Consumed By Hour" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
          <RevenueChart data={data} title="Units by Day of Week" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
          <RevenueChart data={data} title="Monthly Units by Property" />
        </div>

      </div>

      {/* 🔹 Bottom Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
          <PieChartComponent
            data={pieDataDayOfWeek}
            title="Revenue Share by Property"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">
          <PieChartComponent
            data={pieDataDayOfWeek}
            title="Units Distribution (Weekly)"
          />
        </div>

      </div>

    </div>
  );
}