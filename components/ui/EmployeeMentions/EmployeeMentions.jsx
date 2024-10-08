"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EmployeeMentionsTable } from "./EmployeeMentionsTable";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";

const columns = [
  {
    accessorKey: "employee_name",
    header: () => <div className="text-center">Name/Identifier</div>,
    cell: ({ row }) => {
      const value = row.getValue("employee_name");
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
    accessorKey: "context",
    header: "Context",

    cell: ({ row }) => {
      const value = row.getValue("context");

      return <p>{value}</p>;
    },
  },
];

export default function EmployeeMentions({
  selectedLocation,
  isFetching,
  staffMentions,
}) {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(false);

  const memoizedColumns = useMemo(() => columns, []);
  const memoizedData = useMemo(() => staffMentions, [staffMentions]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner pointer-events-none">
      <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Mentioned Employees Yet
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        It looks like there aren't any mentioned staff for this location yet. As
        reviews come in, they'll appear here.
      </p>
    </div>
  );

  return (
    <SignedInLayout>
      <div className="px-4 mt-3">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-2xl">
            Mentioned Employees ({staffMentions.length})
          </h2>
        </div>

        {staffMentions.length > 0 ? (
          <EmployeeMentionsTable
            columns={memoizedColumns}
            data={memoizedData}
          />
        ) : (
          <>
            {renderEmptyState()}
            <div className="mt-4 opacity-50 pointer-events-none">
              <EmployeeMentionsTable columns={memoizedColumns} data={[]} />
            </div>
          </>
        )}
      </div>
    </SignedInLayout>
  );
}
