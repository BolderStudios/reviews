"use client";

import { Sidebar } from "./ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";

export default function SidebarNavigation() {
  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div>
        <MobileNav />
      </div>
    </div>
  );
}
