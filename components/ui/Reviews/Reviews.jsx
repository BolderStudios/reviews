"use client";

import { useState, useEffect, useMemo } from "react";
import { ReviewsTable } from "./ReviewsTable";
import YelpLogo from "@/public/yelp_logo.svg";
import GoogleLogo from "@/public/google_logo.png";
import Image from "next/image";
import {
  Star,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  AlertCircle,
  CircleHelp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Buttons/button";
import { ReviewInsights } from "./ReviewInsights";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { getHighlightedWords } from "@/app/actions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const HighlightedText = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function Reviews({ selectedLocation, isFetching, reviews }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const review = row.original;

          return review.summary === null ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center cursor-pointer">
                    <CircleHelp className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-32 text-center">
                    Customer didn't leave a review
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <ReviewInsights review={review} />
            </div>
          );
        },
        width: 82.6,
      },
      {
        accessorKey: "source",
        header: () => <div className="text-center">Platform</div>,
        cell: ({ row }) => {
          const value = row.getValue("source");
          if (value === "yelp") {
            return <Image src={YelpLogo} alt="Yelp" width={50} height={50} />;
          } else if (value === "google") {
            return (
              <Image src={GoogleLogo} alt="Google" width={50} height={50} />
            );
          }
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        width: 88.3,
      },
      {
        accessorKey: "timestamp",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="w-full"
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const value = row.getValue("timestamp");
          const year = value.split("-")[0];
          const month = value.split("-")[1];
          const day = value.split("-")[2].split("T")[0];
          return <div className="text-center">{`${month}-${day}-${year}`}</div>;
        },
        width: 118.9,
      },
      {
        accessorKey: "rating",
        header: () => <div className="text-center">Rating</div>,
        cell: ({ row }) => {
          const value = row.getValue("rating");
          return (
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={i < value ? "text-yellow-400" : "text-gray-300"}
                  fill={i < value ? "currentColor" : "none"}
                  size={16}
                />
              ))}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id).toString());
        },
        width: 112,
      },
      {
        accessorKey: "sentiment",
        header: () => <div className="text-center">Sentiment</div>,
        cell: ({ row }) => {
          const value = row.getValue("sentiment");
          let badgeVariant;

          switch (value) {
            case "Positive":
              badgeVariant = "positive";
              break;
            case "Negative":
              badgeVariant = "negative";
              break;
            case "Mixed":
              badgeVariant = "mixed";
              break;
            default:
              badgeVariant = "default";
          }
          return (
            <div className="flex justify-center">
              <Badge variant={badgeVariant}>
                {value === null ? "unknown" : value}
              </Badge>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        width: 105.9,
      },
      {
        accessorKey: "summary",
        header: "Summary",
        filterFn: (row, id, value) => {
          const summary = row.getValue(id);
          return summary === null
            ? false
            : summary.toLowerCase().includes(value.toLowerCase());
        },
        cell: ({ row, table }) => {
          const value = row.getValue("summary");
          const filterValue =
            table.getColumn("summary")?.getFilterValue() || "";
          const [highlightedWords, setHighlightedWords] = useState([]);
          const [isLoading, setIsLoading] = useState(true);

          useEffect(() => {
            let isMounted = true;
            const getHighlightedWordsFunc = async () => {
              try {
                const response = await getHighlightedWords(row.original.id);
                if (isMounted) {
                  if (response.success) {
                    setHighlightedWords(response.data);
                  } else {
                    console.error(
                      "Failed to fetch highlighted words:",
                      response.message
                    );
                  }
                }
              } catch (error) {
                console.error("Error fetching highlighted words:", error);
              } finally {
                if (isMounted) {
                  setIsLoading(false);
                }
              }
            };
            getHighlightedWordsFunc();
            return () => {
              isMounted = false;
            };
          }, [row.original.id]);

          const getSentimentClass = (sentiment) => {
            switch (sentiment) {
              case "Positive":
                return "bg-green-50 text-green-700 border-green-400";
              case "Negative":
                return "bg-red-50 text-red-700 border-red-400";
              case "Mixed":
                return "bg-yellow-50 text-yellow-700 border-yellow-400";
              default:
                return "bg-gray-50 text-gray-700 border-gray-400";
            }
          };

          return (
            <div className="w-full flex flex-col">
              <div className={`${isLoading ? "h-8" : "h-fit"} mb-[6px]`}>
                {isLoading ? (
                  <div className="flex items-center h-full">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1 overflow-hidden">
                    {highlightedWords.map((word, index) => (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors border ${getSentimentClass(
                          word.sentiment
                        )}`}
                        key={`${word.word}-${index}`}
                      >
                        {word.word.toLowerCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="line-clamp-3">
                <HighlightedText
                  text={value === null ? "No summary available." : value}
                  highlight={filterValue}
                />
              </div>
            </div>
          );
        },
        width: 560,
      },
      {
        accessorKey: "has_responded_to",
        header: "Response",
        cell: ({ row }) => {
          const value = row.getValue("has_responded_to");
          return (
            <div className="flex items-center justify-center">
              {value ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value === row.getValue(id).toString();
        },
        width: 97.9,
      },
    ],
    []
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner pointer-events-none">
      <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Reviews Yet
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        It looks like there aren't any reviews for this location yet. As reviews
        come in, they'll appear here.
      </p>
    </div>
  );

  return (
    <SignedInLayout>
      <div className="px-4 mt-3">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-2xl">Reviews ({reviews.length})</h2>
        </div>

        {reviews.length > 0 ? (
          <ReviewsTable columns={columns} data={reviews} />
        ) : (
          <>
            {renderEmptyState()}
            <div className="mt-4 opacity-50 pointer-events-none">
              <ReviewsTable columns={columns} data={[]} />
            </div>
          </>
        )}
      </div>
    </SignedInLayout>
  );
}
