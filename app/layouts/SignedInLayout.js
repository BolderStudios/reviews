"use client";

import { useState, useEffect, useCallback } from "react";
import SidebarNavigation from "@/components/SidebarNavigation";
import { isOnboardingCompleteFunc, fetchSidebarLocations } from "@/app/actions";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export function SignedInLayout({ children }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("is_onboarding_complete") === "true";
    }
    return false;
  });
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const checkOnboardingStatus = useCallback(async () => {
    setLoading(true);
    
    try {
      const onboardingData = await isOnboardingCompleteFunc();

      if (onboardingData.success) {
        setOnboardingComplete(onboardingData.onboardingComplete);

        localStorage.setItem(
          "is_onboarding_complete",
          onboardingData.onboardingComplete.toString()
        );
      } else {
        console.error(
          "Error fetching onboarding status:",
          onboardingData.error
        );
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const locationsData = await fetchSidebarLocations();

      if (locationsData.success) {
        setLocations(locationsData.locations);

        setSelectedLocation(locationsData.selectedLocation);
      } else {
        console.error("Error fetching locations:", locationsData.error);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, []);

  useEffect(() => {
    if (!onboardingComplete) {
      checkOnboardingStatus();
    }
    
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [
    onboardingComplete,
    locations.length,
    checkOnboardingStatus,
    fetchLocations,
  ]);

  return (
    <div className="flex flex-1">
      <SidebarNavigation
        passedLocations={locations}
        passedSelectedLocation={selectedLocation}
      />
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <div className="flex-grow">
          {loading ? <LoadingSpinner /> : children}
        </div>
      </div>
    </div>
  );
}

export default SignedInLayout;
