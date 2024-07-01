// app/sign-up/[[...sign-up]]/page.jsx

import CustomSignUp from "@/components/CustomSignUp";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return <SignUp />;
  // return <CustomSignUp />;
}