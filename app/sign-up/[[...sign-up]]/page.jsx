// app/sign-up/[[...sign-up]]/page.jsx

import CustomSignUp from "@/components/CustomSignUp";
import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return <CustomSignUp />;
  // return <SignUp />;
}
