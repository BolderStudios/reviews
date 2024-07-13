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

export async function calcReviewData(locationId) {
  try {
    // Fetch reviews for the given location
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating, sentiment, has_responded_to")
      .eq("location_id", locationId);

    if (reviewsError) throw new Error(reviewsError.message);

    // Initialize counters
    let allRatings = 0;
    const distributedRatings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const sentiments = { Positive: 0, Negative: 0, Mixed: 0 };
    let responseCount = 0;

    // Process reviews
    reviews.forEach(({ rating, sentiment, has_responded_to }) => {
      allRatings += rating;
      distributedRatings[rating]++;
      if (sentiment in sentiments) sentiments[sentiment]++;
      if (has_responded_to) responseCount++;
    });

    // Calculate average rating
    const avgRating = reviews.length > 0 ? allRatings / reviews.length : 0;

    return {
      success: true,
      avgRating: avgRating.toFixed(1),
      totalReviewsCount: reviews.length,
      distributedRatings,
      responseCount,
      sentiments,
    };
  } catch (error) {
    console.error("Error calculating review data:", error);
    return { success: false, error: error.message };
  }
}
