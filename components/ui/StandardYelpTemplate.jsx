"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";

export default function StandardYelpTemplate() {
  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState(0);
  const rating = localStorage.getItem("rating");

  const handleRating = (value) => {
    localStorage.setItem("rating", value.toString());
    if (value >= 4) {
      // Redirect to Google or Yelp review page -> replace with actual URL
      router.push("https://google.com/review");
    } else {
      router.push("/templates/standard/yelp/reasons-for-low-rating");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <p className="text-md mb-1 text-muted-foreground">
          Hey there! How'd we do?
        </p>
        <p className="text-xl font-bold mb-4">
          We're always aiming to provide the best experience possible, and your
          opinion means the world to us.
        </p>
      </div>
      <div className="text-center mb-8">
        <p className="text-xl mb-4">How was your visit today?</p>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform"
            >
              <Star
                className={`w-10 h-10 ${
                  star <= hoveredRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <p className="text-center mt-8">
        Thanks a million for helping us grow! Your input is the secret sauce to
        our success.
      </p>
    </div>
  );
}
