// "@/components/connection.jsx"

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import YelpLogo from "@/public/yelp_logo.svg";
import GoogleLogo from "@/public/google_logo.png";
import { AddYelpConnection } from "./ui/Connections/AddYelpConnection";
import { AddGoogleConnection } from "./ui/Connections/AddGoogleConnection";
import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/Misc/SkeletonCard";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";

export default function Connections({ selectedLocation, isFetching }) {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    // console.log("Router triggered!");
    setIsPageLoading(true);

    setTimeout(() => {
      setIsPageLoading(false);
    }, 500);

    clearTimeout();
  }, [router]);

  return (
    <SignedInLayout>
      <div className="px-8 py-6">
        <h2 className="font-bold text-2xl mb-6">Review Platforms</h2>

        {isPageLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-stone-200 rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center justify-center h-32 bg-white">
                <Image
                  src={YelpLogo}
                  alt="Yelp Logo"
                  width={120}
                  height={40}
                  priority
                  className="object-contain"
                />
              </div>
              <div className="p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">Yelp Reviews</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your Yelp business profile to manage reviews.
                </p>
                <AddYelpConnection
                  is_fetching={isFetching}
                  is_yelp_configured={selectedLocation?.is_yelp_configured}
                  yelp_profile_url={selectedLocation?.yelp_profile_url}
                />
              </div>
            </div>

            <div className="border border-stone-200 rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center justify-center h-32 bg-white">
                <Image
                  src={GoogleLogo}
                  alt="Google Logo"
                  width={120}
                  height={40}
                  priority
                  className="object-contain"
                />
              </div>
              <div className="p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">Google Reviews</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your Google Business Profile to manage reviews.
                </p>
                <AddGoogleConnection
                  is_fetching={isFetching}
                  is_google_configured={selectedLocation?.is_google_configured}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </SignedInLayout>
  );
}
