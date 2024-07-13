import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export function CategoryTabs({ categories }) {
  console.log(categories);
  const defaultCategory = Object.keys(categories)[0];

  const calculateSentimentPercentages = (categoryData) => {
    const total =
      categoryData.totalPositiveKeywords + categoryData.totalNegativeKeywords;

    return {
      positive: (categoryData.totalPositiveKeywords / total) * 100,
      negative: (categoryData.totalNegativeKeywords / total) * 100,
    };
  };

  return (
    <Tabs defaultValue={defaultCategory} className="w-full mt-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-4">
        {Object.entries(categories).map(([categoryName, categoryData]) => {
          const percentages = calculateSentimentPercentages(categoryData);

          return (
            <TabsTrigger
              key={categoryName}
              value={categoryName}
              className="relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-[2px] w-full flex">
                <span
                  className="bg-emerald-300"
                  style={{ width: `${percentages.positive}%` }}
                />
                <span
                  className="bg-red-300"
                  style={{ width: `${percentages.negative}%` }}
                />
              </div>
              <div className="pt-[4px]">{categoryName}</div>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.entries(categories).map(([categoryName, categoryData]) => (
        <TabsContent key={categoryName} value={categoryName}>
          <h3 className="text-lg font-semibold mb-2">{categoryName}</h3>
          <p>Positive Keywords: {categoryData.totalPositiveKeywords}</p>
          <p>Negative Keywords: {categoryData.totalNegativeKeywords}</p>
          <h4 className="text-md font-semibold mt-4 mb-2">Keywords:</h4>
          <ul>
            {categoryData.keywords.map((keyword, index) => (
              <li key={index}>
                {keyword.keyword} - {keyword.sentiment}
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
