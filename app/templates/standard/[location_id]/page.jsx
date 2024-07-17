// "@/app/review_us_page/[location_id]/page.jsx"

import React from "react";
import StandardTemplate from "@/components/ui/StandardTemplate";
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

  return (
    <StandardTemplate
      selectedLocation={location}
      isFetching={userData?.is_fetching}
    />
  );
}
