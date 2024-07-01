// app/sign-in/[[...sign-in]]/page.jsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CustomSignIn from "@/components/CustomSignIn";
import { SignIn } from "@clerk/nextjs";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  // return <SignIn />;
  return <CustomSignIn />;
}