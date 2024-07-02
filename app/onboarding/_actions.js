// app/onboarding/_actions.js

"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";
import { redirect } from "next/navigation";

export const completeOnboarding = async (formData) => {
  const { userId } = auth();

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
    redirect("/dashboard");
  }

  // try {
  //   const res = await clerkClient.users.updateUser(userId, {
  //     publicMetadata: {
  //       onboardingComplete: true,
  //       applicationName: formData.get("applicationName"),
  //       applicationType: formData.get("applicationType"),
  //     },
  //   });

  //   return { message: res.publicMetadata };
  // } catch (err) {
  //   return { error: "There was an error updating the user metadata." };
  // }
};
