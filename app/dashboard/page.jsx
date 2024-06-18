import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userID } = await auth();

  console.log("userID:", userID);

  return (
    <div>
      <SignOutButton redirectUrl="/sign-in" />
    </div>
  );
}
