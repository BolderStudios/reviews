// ———————————————————————————————————————————————————————————————————————————
// Helper functions for Reviews Table, Dashboard, and Keywords
// ———————————————————————————————————————————————————————————————————————————
import supabase from "@/utils/supabaseClient";

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

export async function getAllCustomerData(customerId) {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (error) throw new Error(error.message);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
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
    // console.log("firstReviewDate", firstReviewDate);
    // console.log("today", today);

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

    return {
      success: true,
      avgRating: avgRating.toFixed(1),
      totalReviewsCount: reviews.length,
      distributedRatings,
      responseCount,
      sentiments,
      averageReviewsPerWeek,
    };
  } catch (error) {
    console.error("Error calculating review data:", error);
    return { success: false, error: error.message };
  }
}

export async function extractKeywords(categoryName) {
  try {
    // Get all category ids for the given category name
    const { data: categories, error: categoriesError } = await supabase
      .from("business_categories")
      .select("id")
      .eq("name", categoryName);

    if (categoriesError) throw new Error(categoriesError.message);

    // Use Promise.all to fetch keywords for all categories concurrently
    const keywordPromises = categories.map((category) =>
      supabase
        .from("keywords")
        .select("*")
        .eq("business_category_id", category.id)
    );

    const keywordResults = await Promise.all(keywordPromises);

    // Flatten the results into a single array of keywords
    let allKeywords = keywordResults.flatMap((result) => result.data || []);

    allKeywords = allKeywords.map((keyword) => {
      return {
        name: keyword.name,
        sentiment: keyword.sentiment,
      };
    });

    return { success: true, keywords: allKeywords };
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return { success: false, error: error.message };
  }
}

export async function getCategories(locationId) {
  try {
    // Get all unique business categories for the location
    const { data: businessCategories, error: businessCategoriesError } =
      await supabase
        .from("business_categories")
        .select("name")
        .eq("location_id", locationId);

    if (businessCategoriesError)
      throw new Error(businessCategoriesError.message);

    // Extract unique category names
    const uniqueCategories = [
      ...new Set(businessCategories.map((cat) => cat.name)),
    ];

    return {
      success: true,
      categories: uniqueCategories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: error.message };
  }
}

export async function getCalendarDataByDay(locationId) {
  try {
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("*") // Select all fields
      .eq("location_id", locationId)
      .order("timestamp", { ascending: true });

    if (reviewsError) throw new Error(reviewsError.message);
    if (reviews.length === 0) {
      return {
        success: false,
        error: "No reviews found for the given location",
      };
    }

    const days = {};

    reviews.forEach((review) => {
      const formattedDate = new Date(review.timestamp)
        .toISOString()
        .split("T")[0];
        
      if (!days[formattedDate]) {
        days[formattedDate] = {
          totalRating: 0,
          count: 0,
          positive: 0,
          negative: 0,
          mixed: 0,
          google: 0,
          yelp: 0,
          responseCount: 0,
        };
      }
      
      days[formattedDate].totalRating += review.rating;
      days[formattedDate].count += 1;

      // Sentiment
      if (review.sentiment === "Positive") {
        days[formattedDate].positive += 1;
      } else if (review.sentiment === "Negative") {
        days[formattedDate].negative += 1;
      } else {
        days[formattedDate].mixed += 1;
      }

      // Source
      if (review.source === "google") {
        days[formattedDate].google += 1;
      } else if (review.source === "yelp") {
        days[formattedDate].yelp += 1;
      }

      // Response count
      if (review.has_responded_to === true) {
        days[formattedDate].responseCount += 1;
      }
    });

    const result = Object.entries(days).map(([date, data]) => ({
      date,
      nCount: data.count,
      avgRating: (data.totalRating / data.count).toFixed(2),
      nPositive: data.positive,
      nNegative: data.negative,
      nMixed: data.mixed,
      responseRate: ((data.responseCount / data.count) * 100).toFixed(2),
      sources: {
        google: data.google,
        yelp: data.yelp,
      },
    }));

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching calendar data by day:", error);
    return { success: false, error: error.message };
  }
}
