"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import SidebarNavigation from "@/components/SidebarNavigation";
import Navbar from "@/components/ui/Navbar";

const fullScreenPaths = ["/onboarding", "/sign-in", "/sign-up"];

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  if (fullScreenPaths.includes(pathname) || pathname === "/not-found") {
    return <main className="h-screen flex flex-col">{children}</main>;
  }

  if (userId) {
    return (
      <main className="h-screen flex flex-col">
        <div className="flex flex-1">
          <SidebarNavigation />
          <div className="flex flex-col w-full overflow-y-auto h-screen">
            <Navbar />
            <div className="flex-grow">{children}</div>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="h-screen flex flex-col">
        <div className="flex-grow">{children}</div>
      </main>
    );
  }
}