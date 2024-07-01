// app/dashboard/page.jsx

import Dashboard from "@/components/Dashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata.onboardingComplete === false) {
    redirect("/onboarding");
  }

  return <Dashboard />;
}
