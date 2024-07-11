// components/[location_id]/page.jsx

"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { fetchDataFromAPI } from "@/utils/reviews";

export default function Dashboard({ selectedLocation }) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsPageLoading(true);
      const data = await fetchDataFromAPI(
        selectedLocation.id,
        selectedDateRange
      );
      setDashboardData(data);

      console.log("Dashboard data", data);
      setIsPageLoading(false);
    };
    fetchDashboardData();
  }, [selectedLocation, selectedDateRange]);

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl">Location Overview</h2>
      </div>
      {isPageLoading ? (
        <div className="mt-6 space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <div className="w-full">
          <h1>No data yet!</h1>
        </div>
      )}
    </div>
  );
}
