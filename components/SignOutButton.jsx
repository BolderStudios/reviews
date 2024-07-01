"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ButtonLoading } from "./ui/ButtonLoading";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Simulate a longer sign-out process
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 2 second delay

      // Sign out
      await signOut();

      // Short delay to ensure sign-out is processed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Then redirect
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false); // Reset state if there's an error
    }
    // Note: We're not resetting isSigningOut to false here to keep the loading state during navigation
  };

  return (
    <>
      {isSigningOut ? (
        <ButtonLoading size="lg" width="w-full" content="Signing out ..." />
      ) : (
        <Button onClick={handleSignOut}>Sign out</Button>
      )}
    </>
  );
};
