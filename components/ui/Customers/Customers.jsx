"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/Misc/SkeletonCard";
import { CustomersTable } from "./CustomersTable";
import { AlertCircle } from "lucide-react";
import { ViewCustomer } from "@/components/ui/Customers/ViewCustomer";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";


const columns = [
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex flex-col items-center justify-center">
          <ViewCustomer customer={customer} />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email_address",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
];

export default function Customers({ selectedLocation, customers }) {
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
  const memoizedData = useMemo(() => customers, [customers]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner pointer-events-none">
      <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Reviews Yet
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        It looks like there aren't any customers for this location yet. As
        customers come in, they'll appear here.
      </p>
    </div>
  );

  return (
    <SignedInLayout>
      <div className="px-8 py-6">
        <h2 className="font-bold text-2xl mb-6">
          Customers ({customers.length})
        </h2>

        {isPageLoading ? (
          <SkeletonCard />
        ) : customers.length > 0 ? (
          <CustomersTable columns={memoizedColumns} data={memoizedData} />
        ) : (
          <>
            {renderEmptyState()}
            <div className="mt-8 opacity-50 pointer-events-none">
              <CustomersTable columns={memoizedColumns} data={[]} />
            </div>
          </>
        )}
      </div>
    </SignedInLayout>
  );
}
