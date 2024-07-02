import Navbar from "@/components/ui/Navbar";
import SidebarNavigation from "@/components/SidebarNavigation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import Onboarding from "@/components/Onboarding";

async function SignedInPages({ children }) {
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", userId)
    .single();

  const onboardingComplete = data?.is_onboarding_complete;
  console.log("Dashboard page. onboardingComplete:", onboardingComplete);

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
      <SidebarNavigation />
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}

export default SignedInPage;
