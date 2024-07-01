// app/onboarding/page.jsx
import Onboarding from "@/components/Onboarding";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }

  return <Onboarding />;
}