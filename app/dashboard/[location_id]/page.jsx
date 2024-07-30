// app/dashboard/[location_id]/page.jsx

import Dashboard from "@/components/Dashboard";
import supabase from "@/utils/supabaseClient";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { location_id } = params;

  const { data: location, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", location_id)
    .single();

  if (error || !location) {
    notFound();
  }

  const { data: positiveReviews, error: positiveReviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", location_id)
    .eq("sentiment", "Positive");
  const { data: negativeReviews, error: negativeReviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", location_id)
    .eq("sentiment", "Negative");
  const { data: mixedReviews, error: mixedReviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", location_id)
    .eq("sentiment", "Mixed");

  console.log("Positive reviews length: ", positiveReviews.length);
  console.log("Negative reviews length: ", negativeReviews.length);
  console.log("Mixed reviews length: ", mixedReviews.length);

  const sentimentDistribution = {
    positive: positiveReviews.length,
    negative: negativeReviews.length,
    mixed: mixedReviews.length,
  };

  return <Dashboard selectedLocation={location} sentimentDistribution={sentimentDistribution} />;
}
