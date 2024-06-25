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
  const hostname = req.headers.get("host") || "";
  console.log("hostname:", hostname);

  // Check for subdomains
  const subdomains = ["admin", "student", "teacher"]; // Add all your subdomains here
  const subdomain = hostname.split(".")[0];
  console.log("subdomain:", subdomain);

  if (subdomains.includes(subdomain)) {
    // Rewrite for subdomain routes
    console.log("Rewriting URL for subdomain");
    const newUrl = new URL(`/${subdomain}${url.pathname}`, req.url);
    return NextResponse.rewrite(newUrl);
  }

  // Handle protected routes
  const { userId, sessionClaims } = auth();
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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};