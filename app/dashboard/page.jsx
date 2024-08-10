import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from 'react';
import LoadingSpinner from "@/components/ui/LoadingSpinner";

async function DashboardRedirect() {
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    return <div>Error loading dashboard. Please try again.</div>;
  }

  if (!data || !data.selected_location_id) {
    console.error("No selected location found for user");
    return <div>No location selected. Please choose a location.</div>;
  }

  redirect(`/dashboard/${data.selected_location_id}`);
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardRedirect />
    </Suspense>
  );
}