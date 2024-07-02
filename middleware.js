import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/billing",
  "/onboarding",
  "/file-uploader",
  "/form",
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const url = req.nextUrl;
    console.log("Middleware processing:", url.pathname);

    // Handle protected routes
    if (isProtectedRoute(req)) {
      const { userId, sessionClaims } = await auth();
      console.log("Protected route. userId:", userId);

      if (!userId) {
        console.log("No user ID, redirecting to sign-in");
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }

      console.log("User ID from middleware:", userId);

      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("clerk_id", userId)
        .single();

      const onboardingComplete = data?.is_onboarding_complete;
      console.log("onboardingComplete:", onboardingComplete);

      if (onboardingComplete !== true && url.pathname !== "/onboarding") {
        console.log("Onboarding not complete, redirecting to onboarding");
        const onboardingUrl = new URL("/onboarding", req.url);
        return NextResponse.redirect(onboardingUrl);
      }

      // Check if onboarding is complete
      // const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
      // console.log("onboardingComplete:", onboardingComplete);

      // if (onboardingComplete !== true && url.pathname !== "/onboarding") {
      //   console.log("Onboarding not complete, redirecting to onboarding");
      //   const onboardingUrl = new URL("/onboarding", req.url);
      //   return NextResponse.redirect(onboardingUrl);
      // }
    } else {
      console.log("Non-protected route");
    }

    console.log("Proceeding to next middleware/route handler");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
