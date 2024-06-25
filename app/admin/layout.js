import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <SignedIn>
        {/* Admin-specific navigation or components */}
        <main>{children}</main>
        <h1>Signed In</h1>
      </SignedIn>

      <SignedOut>
        <h1>Not Signed In</h1>
      </SignedOut>
    </div>
  );
}
