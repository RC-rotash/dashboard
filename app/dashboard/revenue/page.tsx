import StatCard from "@/app/componets/cards/StatCard";
import { data } from "@/app/componets/chartData/dummyData";
import RevenueChart from "@/app/componets/charts/RevenueChart";

export default function RevenuePage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">

      {/* 🔹 Header */}
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Revenue Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Track revenue, transactions and energy consumption
        </p>
      </div>

      {/* 🔹 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Revenue" value="₹5,59,423" change="+12%" />
        <StatCard title="Transactions" value="29,425" change="+8%" />
        <StatCard title="Units Consumed" value="284,726 kWh" change="+10%" />
        <StatCard title="Avg Value" value="₹190" change="-2%" positive={false} />
      </div>

      {/* 🔹 Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
          <RevenueChart data={data} size={200} title="Revenue Trend" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
          <RevenueChart data={data} size={200} title="Units Consumed Trend" />
        </div>

      </div>

      {/* 🔹 Secondary Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-3">
          <RevenueChart data={data} size={200} title="Transactions Trend" />
        </div>

        {/* Insights Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Key Insights
          </h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              Revenue growing steadily across peak hours
            </li>
            <li className="flex items-start gap-2">
              Transactions increased during evening slots
            </li>
            <li className="flex items-start gap-2">
              High usage observed in top-performing sites
            </li>
            <li className="flex items-start gap-2">
              Average ticket size slightly decreased
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}