// @/app/dashboard/page.js

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";

export default async function Page({ params }) {
  console.log("Dashboard page params:", params);

  const { userId } = await auth();

  if (!userId) {
    console.log("No userId, redirecting to sign-in");
    redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("users")
    .select("selected_location_id")
    .eq("clerk_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    redirect("/error");
  }

  if (!data || !data.selected_location_id) {
    console.log("No selected location, redirecting to select-location");
    redirect("/select-location");
  }

  console.log("Redirecting to:", `/dashboard/${data.selected_location_id}`);
  redirect(`/dashboard/${data.selected_location_id}`);
}
