import Navbar from "@/components/ui/Navbar";
import SidebarNavigation from "@/components/SidebarNavigation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import Onboarding from "@/components/Onboarding";

async function SignedInPage({ children }) {
  const { userId } = await auth();
  // Need to get user data whether they finished onboarding or not
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", userId)
    .single();

  const onboardingComplete = data?.is_onboarding_complete;

  console.log("Dashboard page. onboardingComplete:", onboardingComplete);

  if (onboardingComplete !== true) {
    return <div>
      <Onboarding />
    </div>
  }

  return (
    <div className="flex flex-1">
      <SidebarNavigation />

      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}

export default SignedInPage;
