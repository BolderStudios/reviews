"use client";

import React from "react";
import Navbar from "@/components/ui/Navbar";
import SidebarNavigation from "@/components/SidebarNavigation";

function SignedInPage({ children }) {
  return (
    <div className="flex flex-1">
      <SidebarNavigation />

      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}

export default SignedInPage;
