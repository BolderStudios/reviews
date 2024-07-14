"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { getKeywords } from "@/utils/reviews";
import { CategoryTabs } from "@/components/ui/CategoryTabs";

export default function Keywords({ selectedLocation }) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [keywordsData, setKeywordsData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsPageLoading(true);
      const data = await getKeywords(selectedLocation.id);
      setKeywordsData(data);
      setIsPageLoading(false);
    };
    fetchDashboardData();
  }, [selectedLocation]);

  console.log("keywordsData", keywordsData);

  return isPageLoading || keywordsData === null ? (
    <div className="mt-6 space-y-6">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  ) : (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl">Extracted Keywords</h2>
      </div>
      <CategoryTabs categories={keywordsData.allCategories} />
    </div>
  );
}
