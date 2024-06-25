import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/billing",
  "/onboarding",
  "/file-uploader",
]);

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  console.log("Requested host name: ", req.headers.get("host"));

  // Check if it's an admin subdomain
  // const isAdminSubdomain =
  //   hostname.startsWith("admin.") ||
  //   hostname === `admin.${process.env.HOST_NAME}`;

  if (hostname.includes("admin")) {
    // Construct the new URL for the admin section
    const newUrl = new URL(`/admin${url.pathname}`, url);
    return NextResponse.rewrite(newUrl);
  }

  if (isProtectedRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Check if onboarding is complete
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
    if (!onboardingComplete && req.nextUrl.pathname !== "/onboarding") {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
