// "[location_id]/templates/standard/yelp/reasons-for-low-rating/page.jsx"
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const [selectedReasons, setSelectedReasons] = useState({});
  const router = useRouter();

  const reasons = [
    {
      id: "poor-customer-service",
      title: "Poor Customer Service",
      icon: "🙁",
      description: "Staff was rude or unhelpful",
    },
    {
      id: "disappointing-final-results",
      title: "Disappointing Final Results",
      icon: "😔",
      description: "The outcome wasn't as desired",
    },
    {
      id: "unpleasant-atmosphere",
      title: "Unpleasant Atmosphere",
      icon: "🏢",
      description: "The salon environment was uncomfortable",
    },
    {
      id: "lack-of-communication",
      title: "Lack of Communication",
      icon: "🗨️",
      description: "Poor explanation or listening to needs",
    },
    {
      id: "cleanliness-hygiene-issues",
      title: "Cleanliness and Hygiene Issues",
      icon: "🧼",
      description: "Salon or tools weren't clean",
    },
    {
      id: "pricing-value-concerns",
      title: "Pricing and Value Concerns",
      icon: "💰",
      description: "Service was overpriced or not worth the cost",
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

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    let isSelectedCounter = 0;
    const objectReasons = Object.keys(selectedReasons);
    objectReasons.forEach((reason) =>
      selectedReasons[reason] === true ? isSelectedCounter++ : null
    );

    if (isSelectedCounter === 0) {
      toast.error("Please select at least one reason for low rating.");
      return;
    } else {
      router.push("/templates/standard/yelp/submit-form");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Reasons for Low Ratings
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reasons.map((reason) => (
          <ReasonCard
            key={reason.id}
            {...reason}
            isSelected={!!selectedReasons[reason.id]}
            onToggle={() => handleReasonToggle(reason.id)}
          />
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={handleBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleNext} className="flex items-center">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ReasonCard({ id, title, icon, description, isSelected, onToggle }) {
  return (
    <Card
      className={`hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col border-2 ${
        isSelected ? "border-blue-500" : "border-stone-100"
      }`}
      onClick={onToggle}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-xl">{icon}</span>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow flex flex-col justify-between">
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex items-center justify-end mt-2 h-4">
          {isSelected && <Check className="h-4 w-4 text-blue-500" />}
        </div>
      </CardContent>
    </Card>
  );
}
