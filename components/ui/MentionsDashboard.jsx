"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/Buttons/button";
import { ThumbsUp, ThumbsDown, Frown, HeartCrack } from "lucide-react";
import { getSingleReviewData } from "@/app/actions";

export const MentionsDashboard = ({ customersObservations }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 15;

  const tabData = [
    {
      id: "customers_love",
      label: "Customer Favorites",
      icon: ThumbsUp,
      color: "text-green-500",
      description: "Top aspects that delight our customers",
      data: customersObservations?.peopleLove || [],
    },
    {
      id: "customers_dislike",
      label: "Unlikable Areas",
      icon: ThumbsDown,
      color: "text-yellow-500",
      description: "Aspects customers feel could be better",
      data: customersObservations?.peopleDontLike || [],
    },
    {
      id: "customers_hate",
      label: "Major Concerns",
      icon: Frown,
      color: "text-red-500",
      description: "Critical issues that need immediate attention",
      data: customersObservations?.peopleHate || [],
    },
    {
      id: "customer_pain_points",
      label: "Customer Frustrations",
      icon: HeartCrack,
      color: "text-purple-500",
      description: "Recurring problems affecting customer experience",
      data: customersObservations?.peoplesPains || [],
    },
  ];

  const handleLabelClick = async (review_id) => {
    setIsLoading(true);

    try {
      const response = await getSingleReviewData(review_id);
      if (response.success) {
        setSelectedReview(response.data);
      } else {
        console.error(response.message);
        setSelectedReview(null);
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      setSelectedReview(null);
    }
    setIsLoading(false);
  };

  const renderObservations = (observations, TabIcon, iconColor) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentObservations = observations.slice(startIndex, endIndex);

    return (
      <div className="grid grid-cols-3 p-2">
        {currentObservations.map((observation, index) => (
          <div
            key={`${observation.label}-${index}`}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
            onMouseEnter={() => handleLabelClick(observation.review_id)}
          >
            <TabIcon className={`h-4 w-4 ${iconColor}`} />
            <p className="text-[14px]">{observation.label}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="customers_love" className="w-full">
      <TabsList className="grid w-full grid-cols-2 gap-2 mt-4">
        {tabData.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} onClick={() => setCurrentPage(1)}>
            <tab.icon className={`h-4 w-4 mr-2 ${tab.color}`} />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabData.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="">
          <CardContent className="min-h-[200px]">
            {renderObservations(tab.data, tab.icon, tab.color)}
          </CardContent>

          <CardFooter className="flex justify-between mt-4 p-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {Math.ceil(tab.data.length / itemsPerPage)}
            </span>
            <Button
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(tab.data.length / itemsPerPage))
                )
              }
              disabled={
                currentPage === Math.ceil(tab.data.length / itemsPerPage)
              }
            >
              Next
            </Button>
          </CardFooter>
        </TabsContent>
      ))}
    </Tabs>
  );
};
