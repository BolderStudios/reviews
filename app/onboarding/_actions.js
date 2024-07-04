// app/onboarding/_actions.js

"use server";

import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";
import { redirect } from "next/navigation";

export const completeOnboarding = async (formData) => {
  const { userId } = auth();
  console.log("Data from completeOnboarding: ", formData);

  if (!userId) {
    console.log("No Logged In User");
    return { message: "No Logged In User" };
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", userId)
    .single();

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
    ]);

  const { data, error } = await supabase
    .from("users")
    .update({
      is_onboarding_complete: true,
      organization_industry: formData.organizationIndustry,
      employee_count: formData.employeeCount,
      location_count: formData.locationCount,
      customer_retention_challenges: formData.customerRetentionChallenges,
    })
    .eq("clerk_id", userId);

  if (!error && !locationError && !userError) {
    console.log("Onboarding complete. Redirecting to dashboard.");
    redirect("/dashboard");
  } else {
    console.error("Error completing onboarding:", error);
  }
};
