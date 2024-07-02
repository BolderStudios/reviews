// app/dashboard/page.jsx

import Dashboard from "@/components/Dashboard";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";

export default async function Page() {
  const { userId } = await auth();
  // Need to get user data whether they finished onboarding or not
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", userId)
    .single();

  const onboardingComplete = data?.is_onboarding_complete;

  console.log("Dashboard page. onboardingComplete:", onboardingComplete);

  if (onboardingComplete !== true) {
    redirect("/onboarding");
  }


  return <Dashboard />;
}
