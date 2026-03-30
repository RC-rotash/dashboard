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
import {
    MouseHandlerDataParam,
    RelativePointer,
    getRelativeCoordinate,
} from "recharts";
import type { MouseEvent, TouchEvent } from "react";
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
    return (
        <div className="bg-white">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
                {title}
            </h2>
            <div className="w-full" style={{ height: size }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        // onClick={(mouseData: MouseHandlerDataParam, e: MouseEvent<SVGElement>) => {
                        //     const pointer: RelativePointer = getRelativeCoordinate(e);
                        //     console.log("Click:", mouseData, pointer);
                        //     onPointClick?.(mouseData);
                        // }}
                        onMouseMove={(mouseData, e) => {
                            const pointer = getRelativeCoordinate(e);
                            console.log("Move:", pointer);
                        }}
                        onMouseEnter={() => console.log("Mouse Enter")}
                        onMouseLeave={() => console.log("Mouse Leave")}
                        onDoubleClick={(mouseData, e) => {       
                            const pointer = getRelativeCoordinate(e);
                            console.log("Double Click:", pointer);
                        }}
                        // onTouchStart={(mouseData, e: TouchEvent<SVGElement>) => {
                        //     const pointer = getRelativeCoordinate(e);
                        //     console.log("Touch Start:", pointer);
                        // }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        {/* <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            /> */}
                        <XAxis
                            dataKey="label"
                            interval={Math.floor(data.length / 8)} // dynamic control
                            tick={{ fontSize: 12 }}
                        />
                        <Brush dataKey="label" height={20} stroke="#6366f1" />
                        <YAxis
                            width={40}
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                fontSize: "12px",
                            }}
                        />
                        <Area
                            type="step"
                            dataKey={dataKey}
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="#6366f1"
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}