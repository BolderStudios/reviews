// ———————————————————————————————————————————————————————————————————————————
// Helper functions for Reviews Table
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

  // Fetch all necessary data
  //   await fetchData("business_categories", "business_categories");
  await fetchData("business_category_mentions", "business_category_mentions");
  await fetchData("detailed_aspects", "detailed_aspects");
  await fetchData("product_service_feedback", "product_service_feedback");
  //   await fetchData("staff_mentions", "staff_mentions");
  await fetchData("keywords", "keywords");

  return result;
}
