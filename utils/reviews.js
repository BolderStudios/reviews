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

    if (reviews.length === 0) {
      return {
        success: false,
        error: "No reviews found for the given location",
      };
    }

    // Initialize counters
    let allRatings = 0;
    const distributedRatings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const sentiments = { positive: 0, negative: 0, mixed: 0 };
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

    // Need to calculate how many reviews are received on a weekly basis —> what the rate of receiving them is
    // Calculate the number of weeks since the first review
    // Calculate the number of reviews received each week

    const { data: dates, error: datesError } = await supabase
      .from("reviews")
      .select("timestamp")
      .eq("location_id", locationId)
      .order("timestamp", { ascending: true });

    if (datesError) throw new Error(datesError.message);
    if (dates.length === 0) {
      return {
        success: false,
        error: "No review dates found for the given location",
      };
    }

    const firstReviewDate = new Date(dates[0].timestamp);
    const today = new Date();
    console.log("firstReviewDate", firstReviewDate);
    console.log("today", today);

    // Calculate the difference in milliseconds
    const timeDifference = today.getTime() - firstReviewDate.getTime();

    // Convert milliseconds to weeks
    const weeksSinceFirstReview = Math.floor(
      timeDifference / (7 * 24 * 60 * 60 * 1000)
    );

    // Calculate average reviews per week
    const averageReviewsPerWeek =
      weeksSinceFirstReview > 0
        ? (reviews.length / weeksSinceFirstReview).toFixed(2)
        : reviews.length;

    // Get all business categories for the location
    const { data: businessCategories, error: businessCategoriesError } =
      await supabase
        .from("business_categories")
        .select("*")
        .eq("location_id", locationId);

    if (businessCategoriesError)
      throw new Error(businessCategoriesError.message);

    console.log("businessCategories", businessCategories);

    let allCategories = {};

    // Fetch keywords for each category
    for (const category of businessCategories) {
      // Get keywords for this category
      const { data: keywords, error: keywordsError } = await supabase
        .from("keywords")
        .select("*")
        .eq("business_category_id", category.id);

      if (keywordsError) throw new Error(keywordsError.message);

      // Process keywords
      const positiveKeywords = keywords.filter(
        (keyword) => keyword.sentiment === "Positive"
      );
      const negativeKeywords = keywords.filter(
        (keyword) => keyword.sentiment === "Negative"
      );

      // Add or update category data in allCategories
      if (!allCategories[category.name]) {
        allCategories[category.name] = {
          totalPositiveKeywords: 0,
          totalNegativeKeywords: 0,
          keywords: [],
        };
      }

      allCategories[category.name].totalPositiveKeywords +=
        positiveKeywords.length;
      allCategories[category.name].totalNegativeKeywords +=
        negativeKeywords.length;

      // Add new keywords, avoiding duplicates
      keywords.forEach((keyword) => {
        if (
          !allCategories[category.name].keywords.some(
            (k) => k.keyword === keyword.name
          )
        ) {
          allCategories[category.name].keywords.push({
            keyword: keyword.name,
            sentiment: keyword.sentiment,
          });
        }
      });
    }

    console.log("Done processing categories", allCategories);

    return {
      success: true,
      avgRating: avgRating.toFixed(1),
      totalReviewsCount: reviews.length,
      distributedRatings,
      responseCount,
      sentiments,
      averageReviewsPerWeek,
      allCategories,
    };
  } catch (error) {
    console.error("Error calculating review data:", error);
    return { success: false, error: error.message };
  }
}
