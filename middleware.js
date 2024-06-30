import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/billing",
  "/onboarding",
  "/file-uploader",
  "/api/create-checkout-session",
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const url = req.nextUrl;

    // Handle protected routes
    if (isProtectedRoute(req)) {
      const { userId, sessionClaims } = await auth();
      console.log("userId:", userId);

      if (!userId) {
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }

      // Check if onboarding is complete —> only works for protected pages
      const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
      console.log("onboardingComplete:", onboardingComplete);
      console.log("url.pathname:", url.pathname);

      if (onboardingComplete !== true && url.pathname !== "/onboarding") {
        console.log("Redirecting to onboarding");
        const onboardingUrl = new URL("/onboarding", req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
});

export const config = {
  // matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/api/(.*)"],
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
