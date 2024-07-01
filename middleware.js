import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/billing",
  "/onboarding",
  "/file-uploader",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  // Add other public routes here
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const url = req.nextUrl;
    console.log("Middleware called for path:", url.pathname);

    const { userId, sessionClaims } = await auth();
    console.log("userId:", userId);

    console.log("Full URL:", req.url);
    console.log("Pathname:", url.pathname);
    console.log("Search params:", url.searchParams.toString());
    console.log("Is protected route:", isProtectedRoute(req));
    console.log("Is public route:", isPublicRoute(req));

    // Explicitly allow sign-in and sign-up pages
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      console.log("Allowing access to sign-in/sign-up page");
      return NextResponse.next();
    }

    // Handle 404 for unknown routes
    if (!isProtectedRoute(req) && !isPublicRoute(req)) {
      console.log("Unknown route, redirecting to 404");
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    // Handle protected routes
    if (isProtectedRoute(req)) {
      if (!userId) {
        console.log("Unauthenticated user, redirecting to sign-in");
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }

      const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
      console.log("onboardingComplete:", onboardingComplete);

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
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
