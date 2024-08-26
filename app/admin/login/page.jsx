// app/sign-in/page.jsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CustomSignIn from "@/components/CustomSignIn";

export default async function Page() {
    return <h1>Sign In</h1>
    //   return <CustomSignIn />;
}