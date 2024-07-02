// app/onboarding/page.jsx

import Onboarding from "@/components/Onboarding";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";

export default async function Page() {
  // const { sessionClaims } = await auth();

  // console.log("Onboarding page. sessionClaims:", sessionClaims);
  // console.log("Onboarding page. sessionClaims.metadata.onboardingComplete:", sessionClaims?.metadata.onboardingComplete)

  // if (sessionClaims?.metadata.onboardingComplete === true) {
  //   redirect("/dashboard");
  // }

  const { userId } = await auth();
  // Need to get user data whether they finished onboarding or not
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", userId)
    .single();

  const onboardingComplete = data?.is_onboarding_complete;

  console.log("Onboarding page. onboardingComplete:", onboardingComplete);

  if (onboardingComplete === true) {
    redirect("/dashboard");
  }

  return <Onboarding />;
}

// {
// 	"metadata": "{{user.public_metadata}}"
// }
