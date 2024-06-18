import React from "react";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div className="px-8 py-4 flex items-center justify-between border-b">
      &nbsp;
      <UserButton />
    </div>
  );
}
