import Navbar from "@/components/ui/Navbar";
import SidebarNavigation from "@/components/SidebarNavigation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import Onboarding from "@/components/Onboarding";

async function SignedInPages({ children }) {
  const { userId } = await auth();

  if (!userId) {
    console.log("No Logged In User");
    redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", userId)
    .single();

  const onboardingComplete = data?.is_onboarding_complete;
  console.log("SignedInPages —> onboardingComplete:", onboardingComplete);
  console.log("SignedInPages —> data:", data);

  let locations = [];

  if (data !== null) {
    const { data: userLocations, error: locationsError } = await supabase
      .from("locations")
      .select()
      .eq("user_id", data?.id);

    locations = userLocations;
  }

  if (onboardingComplete !== true) {
    return (
      <>
        <Onboarding />
        {children}
      </>
    );
  }

  return (
    <div className="flex flex-1">
      <SidebarNavigation locations={locations} />
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}

export default SignedInPages;
