"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/Misc/SkeletonCard";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Buttons/button";
import { CustomerView } from "./CustomerView";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";

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

const columns = [
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="flex flex-col items-center justify-center">
          <CustomerView review={review} />
        </div>
      );
    },
  },
  {
    accessorKey: "source",
    header: () => <div className="text-center">Platform</div>,
    cell: ({ row }) => {
      const value = row.getValue("source");
      if (value === "yelp") {
        return <Image src={YelpLogo} alt="Yelp" width={50} height={50} />;
      } else if (value === "google") {
        return <Image src={GoogleLogo} alt="Google" width={50} height={50} />;
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
          <Badge variant={badgeVariant}>{value}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "summary",
    header: "Summary",
    filterFn: (row, id, value) => {
      return row.getValue(id).toLowerCase().includes(value.toLowerCase());
    },
    cell: ({ row, table }) => {
      const value = row.getValue("summary");
      const [isExpanded, setIsExpanded] = useState(false);
      const filterValue = table.getColumn("summary")?.getFilterValue() || "";

      return (
        <div className="w-full">
          <div className={isExpanded ? "" : "line-clamp-2"}>
            <HighlightedText text={value} highlight={filterValue} />
          </div>
          {/* <div className="flex items-center justify-end mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div> */}
        </div>
      );
    },
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
  },
];

export default function Reviews({ selectedLocation, isFetching, reviews }) {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    return () => clearTimeout();
  }, [router]);

  const memoizedColumns = useMemo(() => columns, []);
  const memoizedData = useMemo(() => reviews, [reviews]);

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
      <div className="px-8 py-6">
        <h2 className="font-bold text-2xl mb-6">
          Customer Reviews ({reviews.length})
        </h2>
        {isPageLoading ? (
          <SkeletonCard />
        ) : reviews.length > 0 ? (
          <ReviewsTable columns={memoizedColumns} data={memoizedData} />
        ) : (
          <>
            {renderEmptyState()}
            <div className="mt-8 opacity-50 pointer-events-none">
              <ReviewsTable columns={memoizedColumns} data={[]} />
            </div>
          </>
        )}
      </div>
    </SignedInLayout>
  );
}
