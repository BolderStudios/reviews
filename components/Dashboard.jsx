"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { calcReviewData } from "@/utils/reviews";
import { KpiCard } from "@/components/ui/KpiCard";
import { RatingDistributionChart } from "@/components/ui/Charts/RatingDistributionChart";
import { UpdateLocation } from "@/components/ui/Locations/UpdateLocation";
import {
  Star,
  BarChart,
  MessageSquareQuote,
  Smile,
  AlertCircle,
  TrendingUp,
  Frown,
  Meh,
} from "lucide-react";
import { YearsCalendar } from "./ui/YearsCalendar";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";
import { MentionsDashboard } from "@/components/ui/MentionsDashboard";
import { CategoriesChart } from "./ui/Charts/CategoriesChart";

export default function Dashboard({
  selectedLocation,
  ratingDistribution,
  sentimentDistribution,
  customersObservations,
  categoriesChartData,
  categoriesCharConfig,
}) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [totalSentimentReviews, setTotalSentimentReviews] = useState(
    sentimentDistribution.positive +
      sentimentDistribution.negative +
      sentimentDistribution.mixed
  );
  const [positivePercentage, setPositivePercentage] = useState(
    ((sentimentDistribution.positive / totalSentimentReviews) * 100).toFixed(1)
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsPageLoading(true);
      const data = await calcReviewData(selectedLocation.id);
      setDashboardData(data);

      setIsPageLoading(false);
    };

    fetchDashboardData();
  }, [selectedLocation]);

  const renderKpiCards = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="px-4 mt-3">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-2xl">Dashboard</h2>
          <UpdateLocation selectedLocation={selectedLocation} />
        </div>
        {isPageLoading ? (
          <div className="mt-6 space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : dashboardData && dashboardData.totalReviewsCount > 0 ? (
          <div className="flex flex-col gap-4">
            {renderKpiCards()}

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-[50%] space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <RatingDistributionChart
                    ratingDistribution={ratingDistribution}
                  />

                  <div className="grid grid-cols-1 grid-rows-2 justify-between gap-4">
                    <KpiCard
                      title="Sentiment Distribution"
                      className="h-full"
                      value={`${positivePercentage}% Positive`}
                      icon={getSentimentIcon(parseFloat(positivePercentage))}
                      status={getSentimentStatus(
                        parseFloat(positivePercentage)
                      )}
                      description={getSentimentDescription(
                        parseFloat(positivePercentage)
                      )}
                    />

                    {/* Empty Fake Card */}
                    <KpiCard
                      title="Sentiment Distribution"
                      className="h-full"
                      value={`${positivePercentage}% Positive`}
                      icon={getSentimentIcon(parseFloat(positivePercentage))}
                      status={getSentimentStatus(
                        parseFloat(positivePercentage)
                      )}
                      description={getSentimentDescription(
                        parseFloat(positivePercentage)
                      )}
                      empty={true}
                    />
                  </div>
                </div>

                {/* Empty Fake Card */}
                <KpiCard
                  title="Sentiment Distribution"
                  value={`${positivePercentage}% Positive`}
                  icon={getSentimentIcon(parseFloat(positivePercentage))}
                  status={getSentimentStatus(parseFloat(positivePercentage))}
                  description={getSentimentDescription(
                    parseFloat(positivePercentage)
                  )}
                  empty={true}
                />
              </div>

              <div className="w-full lg:w-[50%]">
                <CategoriesChart
                  categoriesChartData={categoriesChartData}
                  categoriesCharConfig={categoriesCharConfig}
                />
              </div>
            </div>

            <MentionsDashboard customersObservations={customersObservations} />
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
  if (rating >= 4.5) return "Well above industry average";
  if (rating >= 4.0) return "Above average performance";
  if (rating >= 3.5) return "Room for improvement";
  return "Immediate attention required";
};

const getTotalReviewsDescription = (count) => {
  if (count >= 100) return "High volume of reviews";
  if (count >= 50) return "Solid number of reviews";
  if (count >= 25) return "Growing review base";
  return "Need to encourage more reviews";
};

const getResponseRateDescription = (rate) => {
  if (rate >= 80) return "High engagement with customers";
  if (rate >= 60) return "Above average response rate";
  if (rate >= 40) return "Room for improvement";
  return "Need to increase response rate";
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

  return "Need to encourage more reviews";
};

const getSentimentStatus = (positivePercentage) => {
  if (positivePercentage >= 90) return "positive";
  if (positivePercentage >= 75) return "neutral";
  if (positivePercentage >= 50) return "mixed";
  return "negative";
};

const getSentimentDescription = (positivePercentage) => {
  if (positivePercentage >= 90)
    return "Excellent: Overwhelmingly positive sentiment";
  if (positivePercentage >= 75) return "Good: Strong positive sentiment";
  if (positivePercentage >= 50) return "Average: Balanced sentiment";
  return "Negative sentiment dominates";
};

const getSentimentIcon = (positivePercentage) => {
  if (positivePercentage >= 90)
    return <Smile className="h-4 w-4 text-green-500" />;
  if (positivePercentage >= 75)
    return <TrendingUp className="h-4 w-4 text-green-400" />;
  if (positivePercentage >= 50)
    return <Meh className="h-4 w-4 text-yellow-500" />;
  return <Frown className="h-4 w-4 text-red-500" />;
};
