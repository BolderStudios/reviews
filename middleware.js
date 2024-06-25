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
  const hostname = req.headers.get("host") || `${process.env.HOST_NAME}`;
  const { userId, sessionClaims } = auth();

  if (userId) {
    // Set a cookie with user-relevant data
    const res = NextResponse.next();
    res.cookies.set("user-id", userId, { httpOnly: true, sameSite: "lax" });
    return res;
  }

  // Check if it's an admin subdomain
  const isAdminSubdomain =
    hostname.startsWith("admin.") ||
    hostname === `admin.${process.env.HOST_NAME}`;

  console.log("isAdminSubdomain: ", isAdminSubdomain);

  if (isAdminSubdomain) {
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
