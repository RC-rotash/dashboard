"use client";

import { useState } from "react";
import { chargerData, chargerData2, datasimple } from "@/app/componets/chartData/dummyData";
import CompareChart from "@/app/componets/charts/CompareChart";



export default function ChargersPage() {


  return (
    <div className="w-full mx-auto p-2 bg-white mt-16">
   <CompareChart
        data={chargerData2}
       title="Charger Performance Dashboard"
  height={500}
  itemsPerPage={25} // Show 25 per page
  unit="kWh"
      />
    </div>
  );
}


