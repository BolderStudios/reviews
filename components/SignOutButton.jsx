"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    // Clicking on this button will sign out a user
    // and reroute them to the "/" (home) page.
    <>
      <Button onClick={() => signOut({ redirectUrl: "/" })}>Sign out</Button>
    </>
  );
};
