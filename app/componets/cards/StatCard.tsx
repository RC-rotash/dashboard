// // export default function StatCard({ title, value }: any) {
// //   return (
// //     <div className="h-full flex flex-col justify-center">
// //       <p className="text-gray-500 text-lg text-center">{title}</p>
// //       <h2 className="text-sm text-center">{value}</h2>
// //     </div>
// //   );
// // }

// import { TrendingUp, TrendingDown } from "lucide-react";

// interface Props {
//   title: string;
//   value: string;
//   change?: string;
//   positive?: boolean;
// }

// export default function StatCard({ title, value, change, positive = true }: Props) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all">
      
//       {/* Title */}
//       <p className="text-xs text-gray-500">{title}</p>

//       {/* Value */}
//       <div className="flex items-center justify-between mt-2">
//         <h2 className="text-lg font-semibold text-gray-800">{value}</h2>

//         {change && (
//           <div
//             className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
//               ${positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
//           >
//             {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
//             {change}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export default function StatCard({ title, value, change, positive = true }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 border border-gray-100 shadow-sm transition-all duration-300 
    bg-gradient-to-br from-white via-blue-50 to-white
    hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]">

      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-100/20 via-transparent to-blue-100/20"></div>

      {/* Content */}
      <div className="relative z-10">
        
        {/* Title */}
        <p className="text-xs text-gray-400">{title}</p>

        {/* Value + Change */}
        <div className="flex items-center justify-between mt-3">
          <h2 className="text-xl font-semibold text-gray-800">{value}</h2>

          {change && (
            <div
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full transition-all
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
  );
}