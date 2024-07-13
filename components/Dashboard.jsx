// components/[location_id]/page.jsx

"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { calcReviewData } from "@/utils/reviews";
import { KpiCard } from "@/components/ui/KpiCard";
import { Star, BarChart, MessageSquareQuote } from "lucide-react";

export default function Dashboard({ selectedLocation }) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsPageLoading(true);
      const data = await calcReviewData(selectedLocation.id);
      setDashboardData(data);
      setIsPageLoading(false);
    };
    fetchDashboardData();
  }, [selectedLocation]);

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
        <div className="w-full flex gap-12">
          <KpiCard
            title="Average Rating"
            value={dashboardData?.avgRating}
            icon={<Star className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard
            title="Total Reviews"
            value={dashboardData?.totalReviews}
            icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard
            title="Response Rate"
            value={`${
              (dashboardData?.responseCount / dashboardData?.totalReviews) * 100
            }%`}
            icon={
              <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
            }
          />
        </div>
      )}
    </div>
  );
}
