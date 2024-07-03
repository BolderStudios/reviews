// app/onboarding/_actions.js

"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";
import { redirect } from "next/navigation";

export const completeOnboarding = async (formData) => {
  const { userId } = auth();
  console.log("Data from completeOnboarding: ", formData);

  if (!userId) {
    console.log("No Logged In User");
    return { message: "No Logged In User" };
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      is_onboarding_complete: true,
    })
    .eq("clerk_id", userId);

  if (!error) {
    console.log("Onboarding complete. Redirecting to dashboard.");
    redirect("/dashboard");
  }
};
