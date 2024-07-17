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

  if (onboardingComplete === true) {
    redirect("/dashboard");
  }

  return <Onboarding />;
}
