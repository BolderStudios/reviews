"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { ProductFeedbackTable } from "./ProductFeedbackTable";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";

const columns = [
  {
    accessorKey: "item",
    header: () => <div className="text-center">Item</div>,
    cell: ({ row }) => {
      const value = row.getValue("item");
      return <p className="text-center">{value}</p>;
    },
    filterFn: (row, id, value) => {
      return row.getValue(id).toLowerCase().includes(value.toLowerCase());
    },
    width: 200,
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
      return badgeVariant === "default" ? (
        <p className="text-center">N/A</p>
      ) : (
        <div className="flex justify-center">
          <Badge variant={badgeVariant}>{value}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    width: 120,
  },
  {
    accessorKey: "feedback",
    header: "Feedback",

    cell: ({ row }) => {
      const value = row.getValue("feedback");

      return <p>{value}</p>;
    },
  },
];

export default function ProductFeedback({
  selectedLocation,
  isFetching,
  productFeedbackList,
}) {
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
  const memoizedData = useMemo(
    () => productFeedbackList,
    [productFeedbackList]
  );

  const renderEmptyState = () => (
    <SignedInLayout>
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner pointer-events-none">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Mentioned Employees Yet
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          It looks like there aren't any mentioned staff for this location yet.
          As reviews come in, they'll appear here.
        </p>
      </div>
    </SignedInLayout>
  );

  return (
    <SignedInLayout>
      <div className="px-8 py-6">
        <h2 className="font-bold text-2xl mb-6">
          Product Feedback ({productFeedbackList.length})
        </h2>
        {isPageLoading ? (
          <SkeletonCard />
        ) : productFeedbackList.length > 0 ? (
          <ProductFeedbackTable columns={memoizedColumns} data={memoizedData} />
        ) : (
          <>
            {renderEmptyState()}
            <div className="mt-8 opacity-50 pointer-events-none">
              <ProductFeedbackTable columns={memoizedColumns} data={[]} />
            </div>
          </>
        )}
      </div>
    </SignedInLayout>
  );
}
