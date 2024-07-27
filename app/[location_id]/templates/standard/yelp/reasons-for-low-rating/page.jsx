// "[location_id]/templates/standard/yelp/reasons-for-low-rating/page.jsx"

"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Buttons/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const [selectedReasons, setSelectedReasons] = useState({});
  const router = useRouter();

  const reasons = [
    {
      id: "poor-customer-service",
      title: "Poor Customer Service",
    },
    {
      id: "disappointing-final-results",
      title: "Disappointing Final Results",
    },
    {
      id: "unpleasant-atmosphere",
      title: "Unpleasant Atmosphere",
    },
    {
      id: "lack-of-communication",
      title: "Lack of Communication",
    },
    {
      id: "cleanliness-hygiene-issues",
      title: "Cleanliness & Hygiene Issues",
    },
    {
      id: "pricing-value-concerns",
      title: "Pricing & Value Concerns",
    },
  ];

  useEffect(() => {
    const storedReasons = localStorage.getItem("selectedReasons");
    if (storedReasons) {
      setSelectedReasons(JSON.parse(storedReasons));
    }
  }, []);

  const handleReasonToggle = (id) => {
    setSelectedReasons((prevReasons) => {
      const updatedReasons = {
        ...prevReasons,
        [id]: !prevReasons[id],
      };
      localStorage.setItem("selectedReasons", JSON.stringify(updatedReasons));
      return updatedReasons;
    });
  };

  const handleNext = () => {
    const selectedCount = Object.values(selectedReasons).filter(Boolean).length;
    if (selectedCount === 0) {
      toast.error("Please select at least one reason for low rating.");
    } else {
      router.push("/templates/standard/yelp/submit-form");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <h2 className="text-sm text-center text-gray-500 mb-2">
          Step 2 of 3 - Dive deeper! 🏊‍♂️
        </h2>
        <h1 className="text-3xl font-bold mb-2 text-center">
          What bummed you out?
        </h1>
        <p className="text-center mb-6 text-gray-600">
          Don't hold back - multiple choices welcome! Let's pinpoint the
          hiccups.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {reasons.map((reason) => (
            <ReasonCard
              key={reason.id}
              {...reason}
              isSelected={!!selectedReasons[reason.id]}
              onToggle={() => handleReasonToggle(reason.id)}
            />
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center">
          <Button
            onClick={handleNext}
            className="py-6 px-12 text-lg bg-blue-500 hover:bg-blue-600"
          >
            Moving on!
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReasonCard({ id, title, description, isSelected, onToggle }) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      } flex justify-between items-center cursor-pointer`}
      onClick={onToggle}
    >
      <div>
        <h3>{title}</h3>
      </div>
      {isSelected && <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />}
    </div>
  );
}
