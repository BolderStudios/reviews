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

  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("clerk_id", userId)
      .single();

    if (error) throw error;

    const onboardingComplete = data?.is_onboarding_complete;
    console.log("SignedInPages —> onboardingComplete:", onboardingComplete);

    if (!data) {
      console.error("User data not found");
      // Handle this case appropriately
      return <div>User data not found. Please try again.</div>;
    }

    const { data: locations, error: locationsError } = await supabase
      .from("locations")
      .select()
      .eq("user_id", data.id);

    if (locationsError) throw locationsError;

    console.log("Locations: ", locations);

    if (onboardingComplete !== true) {
      return <Onboarding>{children}</Onboarding>;
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
  } catch (error) {
    console.error("Error in SignedInPages:", error);
    // Handle the error appropriately
    return <div>An error occurred. Please try again later.</div>;
  }
}

export default SignedInPages;
