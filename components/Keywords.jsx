"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { getKeywords, getCategories } from "@/utils/reviews";
import { CategoryTabs } from "@/components/ui/CategoryTabs";

export default function Keywords({ selectedLocation }) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [keywordsData, setKeywordsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsPageLoading(true);
      const keywords = await getKeywords(selectedLocation.id);
      const categories = await getCategories(selectedLocation.id);
      setKeywordsData(keywords);
      setCategoriesData(categories);

      setIsPageLoading(false);
    };
    fetchDashboardData();
  }, [selectedLocation]);

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl">Extracted Keywords</h2>
      </div>
      {isPageLoading || keywordsData === null ? (
        <div className="mt-6 space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <CategoryTabs categories={categoriesData.categories} />
      )}
    </div>
  );
}
