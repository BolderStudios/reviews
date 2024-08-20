"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";

export default function CampaignYelp() {
  const pathname = usePathname();
  const customerId = pathname.split("/").pop();

  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRating = (value) => {
    localStorage.setItem("rating_campaign", value.toString());
    if (value >= 4) {
      router.push("https://google.com/review");
    } else {
      router.push(
        `/templates/standard/yelp/campaign/${customerId}/reasons-for-low-rating`
      );
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-2xl">
        <h2 className="text-sm text-center text-gray-500 mb-2">
          Step 1 of 3 - Let's roll! 🎢
        </h2>
        <h1 className="text-3xl font-bold mb-2 text-center">
          How awesome was your visit?
        </h1>
        <p className="text-center mb-8 text-gray-600">
          Your take on our service is gold! Help us keep the awesomeness
          flowing!
        </p>
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-16 h-16 ${
                    star <= hoveredRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
