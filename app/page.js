// app/page.js

import Header from "@/components/ui/Header";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";

export default async function Home() {
  return (
    <>
      <SignedIn>
        <Header isSignedIn={true} />
      </SignedIn>

      <SignedOut>
        <Header isSignedIn={false} />
      </SignedOut>
    </>
  );
}
