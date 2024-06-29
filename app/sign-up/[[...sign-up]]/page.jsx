// app/sign-up/[[...sign-up]]/page.jsx

import CustomSignUp from "@/components/CustomSignUp";
import { SignUp } from "@clerk/nextjs";


export default function Page() {
  return <CustomSignUp />;
  // return <SignUp />;
}
