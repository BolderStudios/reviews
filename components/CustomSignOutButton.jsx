"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ButtonLoading } from "./ui/ButtonLoading";

export const CustomSignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Simulate a longer sign-out process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await signOut();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false); // Reset state if there's an error
    }
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
