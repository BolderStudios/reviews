import React from "react";
import Connections from "@/components/Connections";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  // Get ID of selected location
  const { userId } = await auth();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  // Pass location's object into the component
  const { data: selectedLocation, error: selectedLocationError } =
    await supabase
      .from("locations")
      .select("*")
      .eq("id", data.selected_location_id)
      .single();

  return <Connections selectedLocation={selectedLocation} isFetching={data.isFetching} />;
}
