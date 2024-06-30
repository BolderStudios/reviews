"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SidebarNavigation from "@/components/SidebarNavigation";
import Navbar from "@/components/ui/Navbar";

const fullScreenPaths = ["/onboarding"];

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  if (fullScreenPaths.includes(pathname) || pathname === "/not-found") {
    return <main className="h-screen flex flex-col">{children}</main>;
  }

  return (
    <main className="h-screen flex flex-col">
      <SignedIn>
        <div className="flex flex-1">
          <SidebarNavigation />
          <div className="flex flex-col w-full overflow-y-auto h-screen">
            <Navbar />
            <div className="flex-grow">{children}</div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex-grow">{children}</div>
      </SignedOut>
    </main>
  );
}