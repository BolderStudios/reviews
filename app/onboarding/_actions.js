"use server";

import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";
import { redirect } from "next/navigation";
import axios from "axios";
import { initiateGoogleFetch } from "@/app/actions";

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
      const fetchedLocationData = response.data.tasks[0].result[0].items[0];
      console.log(
        "Fetched response from Google Places API: ",
        fetchedLocationData
      );

      const { data: primaryLocation, error: primaryLocationError } =
        await supabase
          .from("locations")
          .insert([
            {
              user_id: user.id,
              clerk_id: userId,
              is_primary: true,
              name_of_contact: formData.nameOfContact,
              position_of_contact: formData.positionOfContact.toUpperCase(),
              organization_name: fetchedLocationData?.title,
              address: fetchedLocationData?.address,
              business_url: fetchedLocationData?.url,
              business_phone_number: fetchedLocationData?.phone
                .split("+1")
                .join(" "),
              google_maps_url: fetchedLocationData?.check_url,
              last_updated_date_time:
                fetchedLocationData?.last_updated_time.split(" ")[0] +
                " " +
                fetchedLocationData?.last_updated_time.split(" ")[1],
              cid: fetchedLocationData?.cid,
              google_maps_category: fetchedLocationData?.category,
              google_maps_main_image_url: fetchedLocationData?.main_image,
              domain_name: fetchedLocationData?.domain,
            },
          ])
          .select()
          .single();

      const categoryIds = fetchedLocationData?.category_ids;

      if (categoryIds) {
        categoryIds.forEach(async (category_name) => {
          const { data, error } = await supabase
            .from("category_ids")
            .insert([
              {
                location_id: newLocation.id,
                category_name: category_name.split("_").join(" "),
              },
            ])
            .select();
        });
      }

      const additionalCategories = fetchedLocationData?.additional_categories;

      if (additionalCategories) {
        additionalCategories.forEach(async (category) => {
          const { data, error } = await supabase
            .from("additional_categories")
            .insert([
              {
                location_id: newLocation.id,
                category_name: category,
              },
            ])
            .select();
        });
      }

      const placeTopics = fetchedLocationData?.place_topics;

      if (placeTopics) {
        Object.keys(placeTopics).forEach(async (topic_name) => {
          const { data, error } = await supabase
            .from("place_topics")
            .insert([
              {
                location_id: newLocation.id,
                topic: topic_name,
                count: placeTopics[topic_name],
              },
            ])
            .select();
        });
      }

      const peopleAlsoSearch = fetchedLocationData?.people_also_search;

      if (peopleAlsoSearch) {
        peopleAlsoSearch.forEach(async (search) => {
          const { data, error } = await supabase
            .from("people_also_search")
            .insert([
              {
                location_id: newLocation.id,
                search_term: search.title,
                cid: search.cid,
                google_rating:
                  search.rating && typeof search.rating.value !== "undefined"
                    ? search.rating.value
                    : null,
              },
            ])
            .select();
        });
      }

      if (!primaryLocation || !primaryLocation.id) {
        throw new Error("Failed to create primary location");
      }

      const businessCategory =
        formData.businessCategory.split("-").length > 1
          ? formData.businessCategory.split("-").join(" ")
          : formData.businessCategory;

      const { data, error } = await supabase
        .from("users")
        .update({
          is_onboarding_complete: true,
          business_category: businessCategory,
          business_type: formData.businessType,
          testimonial_process: formData.testimonialProcess,
          selected_location_id: primaryLocation.id,
        })
        .eq("clerk_id", userId);

      if (error) {
        throw error;
      }

      const { success } = await initiateGoogleFetch(formData.businessLocation);

      if (success) {
        console.log("Successfully initiated Google Fetch");

        console.log("Onboarding complete. Redirecting to dashboard.");
        redirect("/dashboard");
      }
    } else {
      console.log("Error fetching location data from Google Places API");
    }
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { message: "Error completing onboarding", error: error.message };
  }
};
