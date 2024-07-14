import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { extractKeywords } from "@/utils/reviews";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

export function CategoryTabs({ categories }) {
  const defaultCategory = categories[0];
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const callExtractKeywords = async () => {
      setIsLoading(true);
      const extractedKeywords = await extractKeywords(selectedCategory);
      if (extractedKeywords.success) {
        setKeywords(extractedKeywords.keywords);
      } else {
        console.error("Failed to extract keywords:", extractedKeywords.error);
        setKeywords([]);
      }
      setIsLoading(false);
    };
    callExtractKeywords();
  }, [selectedCategory]);

  const getKeywordColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "negative":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "mixed":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Tabs
      value={selectedCategory}
      onValueChange={setSelectedCategory}
      className="w-full mt-6"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="relative overflow-hidden py-4 px-2 text-sm font-medium transition-colors hover:bg-gray-100 data-[state=active]:bg-gray-200"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={selectedCategory} className="mt-4">
        <h4 className="text-lg font-semibold mb-3">
          Keywords for {selectedCategory}:
        </h4>
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(10)].map((_, index) => (
              <Skeleton key={index} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        ) : keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge
                key={index}
                className={`${getKeywordColor(keyword.sentiment)} px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-default`}
              >
                {keyword.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No keywords found for this category.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}