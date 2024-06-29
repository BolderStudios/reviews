import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/billing",
  "/onboarding",
  "/file-uploader",
  "/api/create-checkout-session",
]);

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;

  // Handle protected routes
  const { userId, sessionClaims } = auth();
  console.log("userId:", userId);
  if (isProtectedRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
    // Check if onboarding is complete
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
    if (!onboardingComplete && url.pathname !== "/onboarding") {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/api/(.*)"],
};