import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/billing",
  "/onboarding",
  "/file-uploader",
  "/form",
  "/onboarding(.*)",
  "/connections",
  "/reviews(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const url = req.nextUrl;

    if (isProtectedRoute(req)) {
      const { userId, sessionClaims } = await auth();

      if (!userId) {
        console.log("No user ID, redirecting to sign-in");
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }

      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("clerk_id", userId)
        .single();

      const onboardingComplete = data?.is_onboarding_complete;

      if (
        !onboardingComplete &&
        !req.nextUrl.pathname.startsWith("/onboarding")
      ) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }

      if (onboardingComplete && req.nextUrl.pathname === "/onboarding") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else {
      console.log("Non-protected route");
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// export const config = {
//   matcher: [
//     "/((?!api/webhooks/clerk|.*\\..*|_next).*)",
//     "/",
//     "/((?!api/webhooks/clerk)api|trpc)(.*)",
//   ],
// };
