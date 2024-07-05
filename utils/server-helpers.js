"use server";

import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";

export async function fetchYelpReviews(formData) {
  try {
    await updateIsFetching(true);
    const workerUrl = "https://fetch-yelp-reviews.kuznetsov-dg495.workers.dev/";
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-cache",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, message: error.message };
  } finally {
    await updateIsFetching(false);
  }
}

export async function updateLocationAfterYelpFetch(formData) {
  const { userId } = await auth();
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("selected_location_id")
    .eq("clerk_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return { success: false };
  }

  const { data: updatedLocation, error: errorLocation } = await supabase
    .from("locations")
    .update({
      yelp_profile_url: formData.yelpBusinessLink,
      is_yelp_configured: true,
    })
    .eq("id", userData.selected_location_id);

  if (!errorLocation) {
    console.log("Yelp is configured. Location is updated.");
    return { success: true };
  } else {
    console.error("Failed to update location:", errorLocation);
    return { success: false };
  }
}

export async function updateIsFetching(booleanState) {
  const { userId } = await auth();
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("selected_location_id")
    .eq("clerk_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return { success: false };
  }

  const { error: updateError } = await supabase
    .from("locations")
    .update({ is_fetching: booleanState })
    .eq("id", userData.selected_location_id);

  if (!updateError) {
    console.log("Fetch state is updated");
    return { success: true };
  } else {
    console.error("Failed to update fetch state:", updateError);
    return { success: false };
  }
}
