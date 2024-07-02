// app/onboarding/page.jsx

import Onboarding from "@/components/Onboarding";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";

export default async function Page() {
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", userId)
    .single();

  const onboardingComplete = data?.is_onboarding_complete;

  console.log("Onboarding page —> onboardingComplete:", onboardingComplete);

  if (onboardingComplete === true) {
    redirect("/dashboard");
  }

  return <Onboarding />;
}