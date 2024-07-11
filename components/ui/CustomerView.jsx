import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MousePointerClick } from "lucide-react";
import { getAllReviewData } from "@/utils/reviews";
import { Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function CustomerView({ review }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const generatedResponseRef = useRef(null);

  const date = review.timestamp;

  const handleTriggerClick = () => {
    setIsSheetOpen(true);
  };

  const copyGeneratedResponse = () => {
    if (generatedResponseRef.current) {
      navigator.clipboard
        .writeText(generatedResponseRef.current.innerText)
        .then(() => {
          // Optionally, you can show a toast or some other feedback that the text was copied
          console.log("Response was copied to clipboard");
          toast.success("Response was copied to clipboard");
        })
        .catch((err) => {
          toast.error("Failed to copy response");
          console.error("Failed to copy response: ", err);
        });
    }
  };

  useEffect(() => {
    if (isSheetOpen) {
      const fetchData = async () => {
        const result = await getAllReviewData(review.id);
        console.log("Review data", JSON.stringify(result.data, null, 2));
        setReviewData(result.data);

        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      };
      fetchData();
    }
  }, [isSheetOpen, review.id]);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text, mentions) => {
    if (!mentions || mentions.length === 0) return text;

    let parts = text.split(
      new RegExp(
        `(${mentions.map((m) => escapeRegExp(m.context)).join("|")})`,
        "gi"
      )
    );
    return parts.map((part, index) => {
      const mention = mentions.find(
        (m) => m.context.toLowerCase() === part.toLowerCase()
      );
      if (mention) {
        let className = "";
        switch (mention.sentiment.toLowerCase()) {
          case "positive":
            className = "bg-green-100 text-green-800";
            break;
          case "negative":
            className = "bg-red-100 text-red-800";
            break;
          default:
            className = "bg-yellow-100 text-yellow-800";
            break;
        }
        return (
          <span key={index} className={`px-1 rounded ${className}`}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          onClick={handleTriggerClick}
          variant="outline"
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">View customer</span>
          <MousePointerClick className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-[95vw] max-w-[1000px]">
        <SheetHeader>
          <SheetTitle>Detailed information about the customer</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="mt-6 space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <CustomerInfoSection review={review} date={date} />
            <KeywordsAndSentimentSection
              reviewData={reviewData}
              review={review}
            />
            <ReviewTextSection
              review={review}
              reviewData={reviewData}
              highlightText={highlightText}
            />
            <DetailedAspectsTable aspects={reviewData?.detailed_aspects} />
            <div className="pt-4">
              <ProductServiceFeedbackTable
                feedback={reviewData?.product_service_feedback}
              />

              <div className="mt-6 space-y-6">
                <GeneratedResponseSection
                  generatedResponse={review?.generated_response}
                  generatedResponseRef={generatedResponseRef}
                  copyGeneratedResponse={copyGeneratedResponse}
                />
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CustomerInfoSection({ review, date }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {review.customer_name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="font-semibold">{review.customer_name}</h3>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <StarRating rating={review.rating} />
        <Badge variant={getSentimentVariant(review.sentiment)}>
          {review.sentiment}
        </Badge>
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
          fill={i < rating ? "currentColor" : "none"}
          size={16}
        />
      ))}
    </div>
  );
}

function KeywordsAndSentimentSection({ reviewData, review }) {
  return (
    <div>
      <h4 className="mb-2 font-semibold">Keywords</h4>
      <div className="flex flex-wrap gap-2">
        {reviewData?.keywords.map((keyword, index) => (
          <Badge
            key={`keyword-${index}`}
            variant={getSentimentVariant(review.sentiment)}
          >
            {keyword.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function getSentimentVariant(sentiment) {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "positive";
    case "negative":
      return "negative";
    case "mixed":
      return "mixed";
    default:
      return "secondary";
  }
}

function ReviewTextSection({ review, reviewData, highlightText }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <h4 className="mb-2 font-semibold">Review</h4>
      <p className={`${isExpanded ? "" : "line-clamp-3"}`}>
        {highlightText(
          review.review_text,
          reviewData?.business_category_mentions
        )}
      </p>
      <div className="flex items-center justify-end">
        <Button variant="link" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "See less" : "See more"}
        </Button>
      </div>
    </div>
  );
}

function DetailedAspectsTable({ aspects }) {
  if (!aspects || aspects.length === 0) return null;

  const formatContext = (context) => {
    return context.replace(/\*{1,2}(.*?)\*{1,2}/g, "<strong>$1</strong>");
  };

  return (
    <div>
      <h4 className="mb-2 font-semibold">Detailed Aspects</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Aspect</th>
              <th className="text-left p-2">Sentiment</th>
              <th className="text-left p-2">Context</th>
            </tr>
          </thead>
          <tbody>
            {aspects.map((aspect, index) => (
              <tr key={`aspect-${index}`} className="border-b">
                <td className="py-2">{aspect.aspect}</td>
                <td className="p-2">
                  <Badge variant={getSentimentVariant(aspect.sentiment)}>
                    {aspect.sentiment}
                  </Badge>
                </td>
                <td
                  className="p-2"
                  dangerouslySetInnerHTML={{
                    __html: formatContext(aspect.detail),
                  }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductServiceFeedbackTable({ feedback }) {
  if (!feedback || feedback.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 font-semibold">Feedback</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Product/Service</th>
              <th className="text-left py-2">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item, index) => (
              <tr key={`feedback-${index}`} className="border-b">
                <td className="py-2">{item.item}</td>
                <td className="py-2">{item.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GeneratedResponseSection({
  generatedResponse,
  generatedResponseRef,
  copyGeneratedResponse,
}) {
  return (
    generatedResponse && (
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">Generated Review</h4>
          <Button onClick={copyGeneratedResponse} variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <p
          ref={generatedResponseRef}
          className="p-4 mt-4 bg-gray-100 rounded-md"
        >
          {generatedResponse}
        </p>
      </div>
    )
  );
}
