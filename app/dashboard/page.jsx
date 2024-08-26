'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import supabase from "@/utils/supabaseClient";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { userId } = useAuth();

  console.log("userId", userId);

  useEffect(() => {
    async function checkUserAndRedirect() {
      if (!userId) {
        console.log("No userId, redirecting to sign-in");
        router.push('/sign-in');
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("selected_location_id")
          .eq("clerk_id", userId)
          .single();

        if (error) throw error;

        if (!data || !data.selected_location_id) {
          console.log("No selected location, redirecting to select-location");
          // router.push('/select-location');
        } else {
          console.log("Redirecting to:", `/dashboard/${data.selected_location_id}`);
          router.push(`/dashboard/${data.selected_location_id}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // router.push('/error');
      }
    }

    checkUserAndRedirect();
  }, [userId, router]);

  return <LoadingSpinner />;
}