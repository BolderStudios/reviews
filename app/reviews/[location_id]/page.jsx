// "@/app/reviews/[location_id]/page.jsx"

import React from "react";
import Reviews from "@/components/ui/Reviews/Reviews";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { location_id } = params;
  const { userId } = await auth();

  const { data: location, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", location_id)
    .single();

  if (error || !location) {
    notFound();
  }

  const { data: userData } = await supabase
    .from("users")
    .select("is_fetching")
    .eq("clerk_id", userId)
    .single();

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", location_id)
    .order("created_at", { ascending: false });

  return (
    <Reviews selectedLocation={location} isFetching={userData?.is_fetching} reviews={reviews} />
  );
}
