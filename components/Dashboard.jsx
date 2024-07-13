"use client";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { calcReviewData } from "@/utils/reviews";
import { KpiCard } from "@/components/ui/KpiCard";
import { Star, BarChart, MessageSquareQuote, Smile } from "lucide-react";

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

  // Calculate CSAT
  const calculateCSAT = () => {
    if (!dashboardData) return 0;
    const { sentiments } = dashboardData;
    const totalSentiments =
      sentiments.Positive + sentiments.Negative + sentiments.Mixed;
    let css = 0;
    if (totalSentiments > 0) {
      css = (
        (sentiments.Positive * 100 +
          sentiments.Mixed * 75 +
          sentiments.Negative * 50) /
        totalSentiments
      ).toFixed(0);
    }
    if (css > 90) return "A";
    if (css > 80) return "B";
    if (css > 70) return "C";
    if (css > 60) return "D";
    return "F";
  };

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

  const getCSATStatus = (score) => {
    if (score === "A" || score === "B") return "positive";
    if (score === "C") return "neutral";
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

  const getCSATDescription = (score) => {
    const descriptions = {
      A: "Excellent: Customers are very satisfied",
      B: "Good: Most customers are satisfied",
      C: "Average: There's room for improvement",
      D: "Below Average: Immediate attention required",
      F: "Poor: Urgent action needed to improve satisfaction",
    };
    return descriptions[score] || "";
  };

  const getTotalReviewsStatus = (count) => {
    if (count >= 75) return "positive";
    if (count >= 50) return "neutral";
    if (count >= 25) return "mixed";

    return "negative";
  };

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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Average Rating"
            value={dashboardData?.avgRating}
            icon={<Star className="w-6 h-6" />}
            avg={true}
            status={getAverageRatingStatus(
              parseFloat(dashboardData?.avgRating)
            )}
            description={getAverageRatingDescription(
              parseFloat(dashboardData?.avgRating)
            )}
          />
          <KpiCard
            title="Total Reviews"
            value={dashboardData?.totalReviewsCount}
            icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
            status={getTotalReviewsStatus(dashboardData?.totalReviewsCount)}
            description={getTotalReviewsDescription(
              dashboardData?.totalReviewsCount
            )}
          />
          <KpiCard
            title="Response Rate"
            value={`${(
              (dashboardData?.responseCount /
                dashboardData?.totalReviewsCount) *
              100
            ).toFixed(0)}%`}
            icon={
              <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
            }
            status={getResponseRateStatus(
              (dashboardData?.responseCount /
                dashboardData?.totalReviewsCount) *
                100
            )}
            description={getResponseRateDescription(
              (dashboardData?.responseCount /
                dashboardData?.totalReviewsCount) *
                100
            )}
          />
          <KpiCard
            title="Satisfaction Score"
            value={`${calculateCSAT()}`}
            icon={<Smile className="h-4 w-4 text-muted-foreground" />}
            status={getCSATStatus(calculateCSAT())}
            description={getCSATDescription(calculateCSAT())}
          />
        </div>
      )}
    </div>
  );
}
