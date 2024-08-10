"use server";

import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";
import { redirect } from "next/navigation";
import axios from "axios";

export const completeOnboarding = async (formData) => {
  console.log("Data from completeOnboarding: ", formData);
  const { userId } = auth();

  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select()
      .eq("clerk_id", userId)
      .single();

    if (!userId || userError || !user) {
      console.log("No Logged In User");
      return { message: "No Logged In User" };
    }

    console.log(
      "User from completeOnboarding: ",
      `${formData.businessLocation.lat},${formData.businessLocation.lng}`
    );

    // Fetch location data using Google Places API
    const liveBusinessListingsAPIEndpoint =
      "https://api.dataforseo.com/v3/business_data/business_listings/search/live";

    const post_array = [];
    post_array.push({
      location_coordinate: `${formData.businessLocation.lat},${formData.businessLocation.lng}, 10`,
      filters: [["place_id", "=", formData.businessLocation.place_id]],
    });

    const response = await axios({
      method: "post",
      url: liveBusinessListingsAPIEndpoint,
      auth: {
        username: process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME,
        password: process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD,
      },
      data: post_array,
      headers: { "content-type": "application/json" },
    });

    if (
      response.data.status_message === "Ok." &&
      response.data.status_code === 20000
    ) {
      console.log("Response from Google Places API: ", response.data.tasks[0].result[0].items);
    } else {
      console.log("Error fetching location data from Google Places API");
    }

    // Use data from Google Places API and insert new location
    // const { data: locationData, error: locationError } = await supabase
    //   .from("locations")
    //   .insert([
    //     {
    //       user_id: user.id,
    //       clerk_id: userId,
    //       is_primary: true,
    //       organization_name: formData.organizationName,
    //       name_of_contact: formData.nameOfContact,
    //       position_of_contact: formData.positionOfContact,
    //       daily_customers_count: formData.customersCount,
    //     },
    //   ])
    //   .select()
    //   .single();

    // if (locationError) {
    //   throw locationError;
    // }

    // Use the returned locationData instead of querying again
    // const primaryLocation = locationData;

    // console.log("Onboarding —> primaryLocation", primaryLocation);

    // if (!primaryLocation || !primaryLocation.id) {
    //   throw new Error("Failed to create primary location");
    // }

    // const { data, error } = await supabase
    //   .from("users")
    //   .update({
    //     is_onboarding_complete: true,
    //     business_category: formData.businessCategory,
    //     business_type: formData.businessType,
    //     testimonial_process: formData.testimonialProcess,
    //     selected_location_id: primaryLocation.id,
    //   })
    //   .eq("clerk_id", userId);

    // if (error) {
    //   throw error;
    // }

    // console.log("Onboarding complete. Redirecting to dashboard.");
    // redirect("/dashboard");
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { message: "Error completing onboarding", error: error.message };
  }
};
