import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = auth();

    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
