"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SidebarNavigation from "@/components/SidebarNavigation";
import Navbar from "@/components/ui/Navbar";
import { ErrorBoundary } from "react-error-boundary";

const fullScreenPaths = ["/onboarding", "/sign-in", "/sign-up"];

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  const content =
    fullScreenPaths.includes(pathname) || pathname === "/not-found" ? (
      <main className="h-screen flex flex-col">{children}</main>
    ) : (
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

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{content}</ErrorBoundary>
  );
}
