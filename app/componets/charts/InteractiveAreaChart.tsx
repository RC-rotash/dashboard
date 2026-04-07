"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Brush,
} from "recharts";
import { useState, useEffect } from "react";

interface Props {
    data: any[];
    title?: string;
    dataKey?: string;
    size?: number | string;
    onPointClick?: (data: any) => void;
}

export default function InteractiveAreaChart({
    data,
    size = 200,
    title = "Interactive Chart",
    dataKey = "value",
    onPointClick, 
}: Props) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const formatYAxis :any = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataItem = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
                    <p className="text-xs font-semibold text-gray-800 mb-2">
                        {dataItem.fullName || label}
                    </p>
                    <div className="space-y-1">
                        <p className="text-xs text-[#6366f1] font-bold">
                            Revenue: ₹{payload[0].value?.toLocaleString('en-IN')}
                        </p>
                        {dataItem.units !== undefined && (
                            <p className="text-xs text-gray-600">
                                Units: {dataItem.units?.toLocaleString('en-IN')} kWh
                            </p>
                        )}
                        {dataItem.sessions !== undefined && (
                            <p className="text-xs text-gray-600">
                                Sessions: {dataItem.sessions?.toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    console.log("InteractiveAreaChart Data:", data);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
                <div className="w-full flex items-center justify-center" style={{ height: typeof size === 'number' ? size : 200 }}>
                    <p className="text-gray-400 text-sm">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
                {title}
            </h2>
            <div className="w-full" style={{ height: typeof size === 'number' ? size : 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                            angle={isMobile ? -45 : 0}
                            textAnchor={isMobile ? "end" : "middle"}
                            height={isMobile ? 50 : 30}
                            interval={isMobile ? 0 : Math.floor(data.length / 8)}
                        />
                        
                        <YAxis
                            width={isMobile ? 40 : 50}
                            tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
                            tickFormatter={formatYAxis}
                            axisLine={false}
                            tickLine={false}
                        />
                        
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
                        
                        <Brush 
                            dataKey="name" 
                            height={30} 
                            stroke="#6366f1" 
                            fill="#f0f9ff"
                            travellerWidth={10}
                            startIndex={0}
                            endIndex={Math.min(19, data.length - 1)}
                        />
                        
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="#6366f1"
                            fillOpacity={0.2}
                            name="Revenue"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {data.length > 0 && (
                <p className="text-xs text-gray-400 text-center mt-2">
                    Showing {data.length} {data.length === 1 ? 'charger' : 'chargers'} (use brush to navigate)
                </p>
            )}
        </div>
    );
}