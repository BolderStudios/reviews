// app/page.js

import Header from "@/components/ui/Header";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import MainPage from "@/components/ui/MainPage/MainPage";

export default async function Home() {
  return (
    <>
      <SignedIn>
        {/* <Header isSignedIn={true} /> */}
        <MainPage />
      </SignedIn>

      <SignedOut>
        {/* <Header isSignedIn={false} /> */}
        <MainPage />
      </SignedOut>
    </>
  );
}
