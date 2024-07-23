// "@/app/employee_mentions/[location_id]/page.jsx"

import React from "react";
import EmployeeMentions from "@/components/ui/EmployeeMentions/EmployeeMentions";
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

  const { data: staffMentions, error: staffMentionsError } = await supabase
    .from("staff_mentions")
    .select("*")
    .eq("location_id", location_id);

  return (
    <EmployeeMentions
      selectedLocation={location}
      isFetching={userData?.is_fetching}
      staffMentions={staffMentions}
    />
  );
}
