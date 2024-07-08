// "@/components/connection.jsx"

"use client";

import Image from "next/image";
import YelpLogo from "@/public/yelp_logo.svg";
import GoogleLogo from "@/public/google_logo.png";
import { AddYelpConnection } from "./ui/AddYelpConnection";
import { AddGoogleConnection } from "./ui/AddGoogleConnection";
import { getLocationInfo } from "@/app/actions";
import { usePathname } from "next/navigation";

export default function Connections({ selectedLocation, isFetching }) {
  return (
    <div className="px-8 py-6">
      <h2 className="font-bold text-2xl mb-6">Review Platforms</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Yelp Card */}
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
              is_yelp_configured={selectedLocation.is_yelp_configured}
              yelp_profile_url={selectedLocation.yelp_profile_url}
            />
          </div>
        </div>

        {/* Google Card */}
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
              is_google_configured={selectedLocation.is_google_configured}
              is_fetching={selectedLocation.is_fetching}
              google_place_id={selectedLocation.google_place_id}
              google_place_coordinates={
                selectedLocation.google_place_coordinates
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
