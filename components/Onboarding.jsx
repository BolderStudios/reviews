// components/Onboarding.jsx

"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/app/onboarding/_actions";
import { SignOutButton } from "./SignOutButton";

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData) => {
    console.log("formData", formData);
    const res = await completeOnboarding(formData);

    if (res?.message) {
      await user?.reload();

      // This is a workaround to reload the page unless the router.refresh works
      // window.location.reload();

      router.push("/dashboard");
      router.refresh();
    }

    if (res?.error) {
      setError(res?.error);
    }
  };

  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-red-50 z-40">
      <h1>Welcome</h1>
      <form action={handleSubmit}>
        <div>
          <label>Application Name</label>
          <p>Enter the name of your application.</p>
          <input type="text" name="applicationName" required />
        </div>

        <div>
          <label>Application Type</label>
          <p>Describe the type of your application.</p>
          <input type="text" name="applicationType" required />
        </div>
        {error && <p className="text-red-600">Error: {error}</p>}
        <button type="submit">Submit</button>
      </form>

      <SignOutButton />
    </div>
  );
}
