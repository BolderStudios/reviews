"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { calcReviewData } from "@/utils/reviews";
import { KpiCard } from "@/components/ui/KpiCard";
import { SentimentDistribution } from "./ui/Charts/SentimentDistribution";
import { EmployeeMentionsChart } from "./ui/Charts/EmployeeMentionsChart";
import { ProductFeedbackChart } from "./ui/Charts/ProductFeedbackChart";
import { UpdateLocation } from "@/components/ui/UpdateLocation";
import {
  Star,
  BarChart,
  MessageSquareQuote,
  Smile,
  CircleX,
  AlertCircle,
} from "lucide-react";
import { YearsCalendar } from "./ui/YearsCalendar";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";

export default function Dashboard({
  selectedLocation,
  sentimentDistribution,
  staffChartData,
  staffChartConfig,
  productChartData,
  productChartConfig,
}) {
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

  // Determine status for each KPI
  const getAverageRatingStatus = (rating) => {
    if (rating >= 4.5) return "positive";
    if (rating >= 4.0) return "neutral";
    return "negative";
  };

  const getResponseRateStatus = (rate) => {
    if (rate >= 80) return "positive";
    if (rate >= 60) return "neutral";
    return "negative";
  };

  const getAverageRatingDescription = (rating) => {
    if (rating >= 4.5) return "Excellent: Well above industry average";
    if (rating >= 4.0) return "Good: Above average performance";
    if (rating >= 3.5) return "Average: Room for improvement";
    return "Below Average: Immediate attention required";
  };

  const getTotalReviewsDescription = (count) => {
    if (count >= 100) return "Excellent: High volume of reviews";
    if (count >= 50) return "Good: Solid number of reviews";
    if (count >= 25) return "Average: Growing review base";
    return "Below Average: Need to encourage more reviews";
  };

  const getResponseRateDescription = (rate) => {
    if (rate >= 80) return "Excellent: High engagement with customers";
    if (rate >= 60) return "Good: Above average response rate";
    if (rate >= 40) return "Average: Room for improvement";
    return "Below Average: Need to increase response rate";
  };

  const getTotalReviewsStatus = (count) => {
    if (count >= 75) return "positive";
    if (count >= 50) return "neutral";
    if (count >= 25) return "mixed";

    return "negative";
  };

  const getFrequencyStatus = (frequency) => {
    if (frequency >= 1.25) return "positive";
    if (frequency >= 0.75) return "mixed";
    return "negative";
  };

  const getFrequencyDescription = (frequency) => {
    if (frequency >= 1.25) return "Excellent: High review frequency";
    if (frequency >= 0.75) return "Average: Consistent review frequency";

    return "Below Average: Need to encourage more reviews";
  };

  const renderKpiCards = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Average Rating"
        value={dashboardData?.avgRating || "0"}
        icon={<Star className="w-6 h-6" />}
        avg={true}
        status={getAverageRatingStatus(
          parseFloat(dashboardData?.avgRating || 0)
        )}
        description={getAverageRatingDescription(
          parseFloat(dashboardData?.avgRating || 0)
        )}
      />
      <KpiCard
        title="Total Reviews"
        value={dashboardData?.totalReviewsCount || 0}
        icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
        status={getTotalReviewsStatus(dashboardData?.totalReviewsCount || 0)}
        description={getTotalReviewsDescription(
          dashboardData?.totalReviewsCount || 0
        )}
      />
      <KpiCard
        title="Response Rate"
        value={`${(
          (dashboardData?.responseCount / dashboardData?.totalReviewsCount) *
            100 || 0
        ).toFixed(0)}%`}
        icon={<MessageSquareQuote className="h-4 w-4 text-muted-foreground" />}
        status={getResponseRateStatus(
          (dashboardData?.responseCount / dashboardData?.totalReviewsCount) *
            100 || 0
        )}
        description={getResponseRateDescription(
          (dashboardData?.responseCount / dashboardData?.totalReviewsCount) *
            100 || 0
        )}
      />
      <KpiCard
        title="Frequency of Reviews"
        value={`${dashboardData?.averageReviewsPerWeek || 0} per week`}
        icon={<Smile className="h-4 w-4 text-muted-foreground" />}
        status={getFrequencyStatus(dashboardData?.averageReviewsPerWeek || 0)}
        description={getFrequencyDescription(
          dashboardData?.averageReviewsPerWeek || 0
        )}
      />
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner pointer-events-none">
      <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Data Available
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        We haven't received any reviews for this location yet. Start collecting
        reviews to see your dashboard come to life!
      </p>
    </div>
  );

  return (
    <SignedInLayout>
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl">Location Overview</h2>
          <UpdateLocation selectedLocation={selectedLocation} />
        </div>
        {isPageLoading ? (
          <div className="mt-6 space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : dashboardData && dashboardData.totalReviewsCount > 0 ? (
          <div className="flex flex-col gap-6">
            {renderKpiCards()}{" "}
            <div className="grid grid-cols-3 gap-6">
              <SentimentDistribution
                sentimentDistribution={sentimentDistribution}
              />
              <EmployeeMentionsChart
                staffChartData={staffChartData}
                staffChartConfig={staffChartConfig}
              />
              <ProductFeedbackChart
                productChartData={productChartData}
                productChartConfig={productChartConfig}
              />
            </div>
            <YearsCalendar selectedLocation={selectedLocation} />
          </div>
        ) : (
          <>
            {renderEmptyState()}
            <div className="mt-8 opacity-50 pointer-events-none flex flex-col">
              {renderKpiCards()}
              <YearsCalendar selectedLocation={selectedLocation} />
            </div>
          </>
        )}
      </div>
    </SignedInLayout>
  );
}
