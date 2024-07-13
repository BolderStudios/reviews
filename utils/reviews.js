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

// Could be removed
export async function calcReviewData(locationId) {
  // console.log("Calculating review data for location:", locationId);

  // Find total reviews by location
  const { data: totalReviews, error: totalReviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", locationId);

  if (totalReviewsError) {
    return { success: false, error: totalReviewsError.message };
  }

  // Calculate average rating
  let allRatings = 0;
  let avgRating = 0;
  totalReviews.forEach((review) => {
    // console.log("Review:", review);

    allRatings += review.rating;
  });

  avgRating = allRatings / totalReviews.length;

  // Calculate response count
  const { data: responseCount, error: responseCountError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", locationId)
    .eq("has_responded_to", true);

  if (responseCountError) {
    return { success: false, error: responseCountError.message };
  }

  return {
    success: true,
    avgRating: avgRating,
    totalReviews: totalReviews.length,
    responseCount: responseCount.length,
  };
}
