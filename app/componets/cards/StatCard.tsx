
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  variant?:
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "pink"
    | "indigo"
    | "teal"
    | "yellow"
    | "red"
    | "cyan";
}

const gradientMap = {
  blue: "from-blue-100 via-blue-50 to-blue-100",
  green: "from-green-100 via-green-50 to-green-100",
  purple: "from-purple-100 via-purple-50 to-purple-100",
  orange: "from-orange-100 via-orange-50 to-orange-100",
  pink: "from-pink-100 via-pink-50 to-pink-100",
  indigo: "from-indigo-100 via-indigo-50 to-indigo-100",
  teal: "from-teal-100 via-teal-50 to-teal-100",
  yellow: "from-yellow-100 via-yellow-50 to-yellow-100",
  red: "from-red-100 via-red-50 to-red-100",
  cyan: "from-cyan-100 via-cyan-50 to-cyan-100",
};
export default function StatCard({
  title,
  value,
  change,
  positive = true,
  variant = "blue",
}: Props) {
  return (
    <div
      className={`rounded-2xl p-[1px] bg-gradient-to-r ${gradientMap[variant]} hover:shadow-md transition`}
    >
      <div className="relative overflow-hidden rounded-2xl p-4">

        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10">
          
          {/* Title */}
          <p className="text-xs text-gray-400">{title}</p>

          {/* Value */}
          <div className="flex items-center justify-between mt-3">
            <h2 className="text-xl font-semibold text-gray-800">{value}</h2>

            {change && (
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                  ${positive 
                    ? "bg-green-50 text-green-600" 
                    : "bg-red-50 text-red-500"}`}
              >
                {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {change}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}