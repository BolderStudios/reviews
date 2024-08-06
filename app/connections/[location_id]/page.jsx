// "@/app/connections/[id]/page.jsx"

import React from "react";
import Connections from "@/components/Connections";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import GooglePlacesAPI from "@/components/ui/Connections/GooglePlacesAPI";

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
    <Connections
      selectedLocation={location}
      isFetching={userData?.is_fetching}
    />

    // <GooglePlacesAPI />
  );
}
