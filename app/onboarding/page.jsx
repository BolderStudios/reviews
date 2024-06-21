// app/onboarding/page.jsx

import Onboarding from "@/components/Onboarding";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Page() {
  console.log("Coming from page.jsx");
  console.log(auth().sessionClaims?.metadata.onboardingComplete);

  if (auth().sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/dashboard");
  }

  return <Onboarding />;
}
