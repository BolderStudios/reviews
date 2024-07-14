import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useCallback, useEffect } from "react";
import { extractKeywords } from "@/utils/reviews";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component

export function CategoryTabs({ categories }) {
  const defaultCategory = categories[0];
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    const callExtractKeywords = async () => {
      const extractedKeywords = await extractKeywords(selectedCategory);
      if (extractedKeywords.success) {
        setKeywords(extractedKeywords.keywords);
      } else {
        console.error("Failed to extract keywords:", extractedKeywords.error);
        setKeywords([]);
      }
    };
    callExtractKeywords();
  }, [selectedCategory]);

  const getKeywordColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            className="relative overflow-hidden py-4"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={selectedCategory} className="mt-4">
        <h4 className="text-lg font-semibold mb-3">Keywords for {selectedCategory}:</h4>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge 
              key={index}
              className={`${getKeywordColor(keyword.sentiment)} px-3 py-1`}
            >
              {keyword.name}
            </Badge>
          ))}
        </div>
        {keywords.length === 0 && (
          <p className="text-gray-500 italic">No keywords found for this category.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}