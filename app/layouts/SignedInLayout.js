"use client";

import Navbar from "@/components/ui/Navbar";
import SidebarNavigation from "@/components/SidebarNavigation";
import { useState, useEffect } from "react";
import { isOnboardingCompleteFunc } from "@/app/actions";
import Onboarding from "@/components/Onboarding";

export function SignedInLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(null);
  const [locations, setLocations] = useState([]);
  const [userSelectedLocation, setUserSelectedLocation] = useState(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const data = await isOnboardingCompleteFunc();
        if (data.success) {
          setOnboardingComplete(data.onboardingComplete);
          setLocations(data.locations || []);
          setUserSelectedLocation(data.userSelectedLocation);

        //   console.log("ALL DATA FROM checkOnboardingStatus:", data);
        } else {
          console.error("Error fetching onboarding status:", data.error);
        }
      } catch (error) {
        console.error("Error in checkOnboardingStatus:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (onboardingComplete === false) {
    return (
      <>
        <Onboarding />
        {children}
      </>
    );
  }

  return (
    <div className="flex flex-1">
      <SidebarNavigation
        locations={locations}
        userSelectedLocation={userSelectedLocation}
      />
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}

export default SignedInLayout;

// Simple loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
