"use client";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { getCategories } from "@/utils/reviews";
import { CategoryTabs } from "@/components/ui/CategoryTabs";
import { AlertCircle } from "lucide-react";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";

export default function Keywords({ selectedLocation }) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState(null);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setIsPageLoading(true);
      const categories = await getCategories(selectedLocation.id);
      setCategoriesData(categories);
      setIsPageLoading(false);
    };
    fetchCategoriesData();
  }, [selectedLocation]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner pointer-events-none">
      <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Keywords Available
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        We haven't extracted any keywords for this location yet. As reviews come
        in, we'll analyze them to provide insights into common themes and
        sentiments.
      </p>
    </div>
  );

  return (
    <SignedInLayout>
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl">Extracted Keywords</h2>
        </div>
        {isPageLoading ? (
          <div className="mt-6 space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : categoriesData && categoriesData.categories.length > 0 ? (
          <CategoryTabs categories={categoriesData.categories} />
        ) : (
          <>
            {renderEmptyState()}
            <div className="mt-8 opacity-50 pointer-events-none">
              <CategoryTabs categories={[]} />
            </div>
          </>
        )}
      </div>
    </SignedInLayout>
  );
}
