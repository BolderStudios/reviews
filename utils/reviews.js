// ———————————————————————————————————————————————————————————————————————————
// Helper functions for Reviews Table
// ———————————————————————————————————————————————————————————————————————————
import supabase from "@/utils/supabaseClient";
import {
  eachDayOfInterval,
  parseISO,
  format,
  addDays,
  startOfDay,
  endOfDay,
} from "date-fns";

export async function getAllReviewData(reviewId) {
  const result = {
    success: true,
    data: {},
    errors: {},
  };

  // Helper function to fetch data and handle errors
  const fetchData = async (table, key) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("review_id", reviewId);
    if (error) {
      result.success = false;
      result.errors[key] = error.message;
    } else {
      result.data[key] = data;
    }
  };

  await fetchData("business_category_mentions", "business_category_mentions");
  await fetchData("detailed_aspects", "detailed_aspects");
  await fetchData("product_service_feedback", "product_service_feedback");
  await fetchData("keywords", "keywords");

  //   await fetchData("business_categories", "business_categories");
  //   await fetchData("staff_mentions", "staff_mentions");

  return result;
}

async function calcReviewData(locationId, dateRange) {
  let startDate, endDate;

  if (dateRange.startDate === null || dateRange.endDate === null) {
    // Fetch date of the first review
    const { data: firstReview, error } = await supabase
      .from("reviews")
      .select("timestamp")
      .eq("location_id", locationId)
      .order("timestamp", { ascending: true })
      .limit(1);

    if (error) {
      console.error("Error fetching first review:", error);
      return null;
    }

    startDate = firstReview[0]?.timestamp
      ? startOfDay(new Date(firstReview[0].timestamp))
      : startOfDay(new Date());
    endDate = endOfDay(new Date());
  } else {
    startDate = startOfDay(new Date(dateRange.startDate));
    endDate = endOfDay(new Date(dateRange.endDate));
  }

  // Create a list of dates between the start and end date
  const dates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Determine the increment based on whether it's all time or a specific range
  const increment = dateRange.startDate === null ? 14 : 1;

  // Fetch all reviews for the entire date range at once
  const { data: allReviews, error: fetchError } = await supabase
    .from("reviews")
    .select("rating, sentiment, has_responded_to, timestamp")
    .eq("location_id", locationId)
    .gte("timestamp", format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX"))
    .lte("timestamp", format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX"))
    .order("timestamp", { ascending: true });

  if (fetchError) {
    console.error("Error fetching reviews:", fetchError);
    return null;
  }

  // Calculate all-time metrics
  const allTimeMetrics = {
    averageRating:
    parseFloat(allReviews.reduce((sum, review) => sum + review.rating, 0) /
      allReviews.length).toFixed(2),
    totalReviews: allReviews.length,
    responsesCount: allReviews.filter((review) => review.has_responded_to)
      .length,
  };

  let result = [];

  // Add zero point for "all time" cases
  if (dateRange.startDate === null) {
    result.push({
      date: format(startDate, "yyyy-MM-dd"),
      averageRating: null,
      totalReviews: 0,
      positiveReviews: 0,
      negativeReviews: 0,
      mixedReviews: 0,
      responsesCount: 0,
      responseRate: 0,
    });
  }

  for (let i = 0; i < dates.length; i += increment) {
    const currentDate = dates[i];
    const nextDate =
      i + increment < dates.length ? dates[i + increment] : endDate;

    // Filter reviews up to the current date
    const reviewsUpToDate = allReviews.filter(
      (review) => new Date(review.timestamp) <= nextDate
    );

    const totalRating = reviewsUpToDate.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const totalReviews = reviewsUpToDate.length;
    const positiveReviews = reviewsUpToDate.filter(
      (review) => review.sentiment === "Positive"
    ).length;
    const negativeReviews = reviewsUpToDate.filter(
      (review) => review.sentiment === "Negative"
    ).length;
    const mixedReviews = reviewsUpToDate.filter(
      (review) => review.sentiment === "Mixed"
    ).length;
    const responsesCount = reviewsUpToDate.filter(
      (review) => review.has_responded_to
    ).length;

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : null;
    const responseRate =
      totalReviews > 0 ? (responsesCount / totalReviews) * 100 : 0;

    result.push({
      date: format(currentDate, "yyyy-MM-dd"),
      averageRating:
        averageRating !== null ? Number(averageRating.toFixed(2)) : null,
      totalReviews: totalReviews,
      positiveReviews: positiveReviews,
      negativeReviews: negativeReviews,
      mixedReviews: mixedReviews,
      responsesCount: responsesCount,
      responseRate: Number(responseRate.toFixed(2)),
    });
  }

  // For single day, 7 days, or 30 days, only return the last (most recent) data point
  if (dateRange.startDate !== null) {
    return {
      data: [result[result.length - 1]],
      allTimeMetrics: allTimeMetrics,
    };
  }

  return {
    data: result,
    allTimeMetrics: allTimeMetrics,
  };
}

export async function fetchDataFromAPI(locationId, dateRange) {
  const { data: reviewData, allTimeMetrics } = await calcReviewData(
    locationId,
    dateRange
  );
  // Fetch other data as needed
  return {
    reviewData,
    allTimeMetrics,
    // other data...
  };
}
