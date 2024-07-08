// "@/app/connections/[id]/page.jsx"

import React from "react";
import Connections from "@/components/Connections";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { id } = params;
  const { userId } = await auth();

  const { data: location, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

    console.log("Location data: ", location);
    console.log("Location error: ", error);

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
  );
}