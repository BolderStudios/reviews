"use server";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";
import { redirect } from "next/navigation";

export const completeOnboarding = async (formData) => {
  const { userId } = auth();
  console.log("Data from completeOnboarding: ", formData);

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

    // Insert new location
    const { data: locationData, error: locationError } = await supabase
      .from("locations")
      .insert([
        {
          user_id: user.id,
          clerk_id: userId,
          is_primary: true,
          organization_name: formData.organizationName,
          name_of_contact: formData.nameOfContact,
          position_of_contact: formData.positionOfContact,
        },
      ])
      .select()
      .single();

    if (locationError) {
      throw locationError;
    }

    // Use the returned locationData instead of querying again
    const primaryLocation = locationData;

    console.log("Onboarding —> primaryLocation", primaryLocation);

    if (!primaryLocation || !primaryLocation.id) {
      throw new Error("Failed to create primary location");
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        is_onboarding_complete: true,
        organization_industry: formData.organizationIndustry,
        employee_count: formData.employeeCount,
        location_count: formData.locationCount,
        customer_retention_challenges: formData.customerRetentionChallenges,
        selected_location_id: primaryLocation.id,
      })
      .eq("clerk_id", userId);

    if (error) {
      throw error;
    }

    console.log("Onboarding complete. Redirecting to dashboard.");
    redirect("/dashboard");
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { message: "Error completing onboarding", error: error.message };
  }
};
