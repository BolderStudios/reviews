"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/Misc/SkeletonCard";
import { CustomersTable } from "./CustomersTable";
import { AlertCircle, Loader2 } from "lucide-react";
import { ViewCustomer } from "@/components/ui/Customers/ViewCustomer";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";
import { getAllCustomerData } from "@/utils/reviews";

const RequestStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Opened":
        return "bg-yellow-100 text-yellow-800";
      case "Clicked":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center justify-center">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
      >
        {status}
      </span>
    </div>
  );
};

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
    header: <p className="text-left">Phone</p>,
  },
  {
    accessorKey: "requests",
    header: () => <div className="text-center">Email Requests</div>,
    cell: ({ row }) => {
      const [requestStatus, setRequestStatus] = useState("Loading...");
      const [isLoading, setIsLoading] = useState(true);
      const customer = row.original;

      useEffect(() => {
        const fetchCustomerData = async () => {
          try {
            const customerData = await getAllCustomerData(customer.id);

            if (customerData.requests.length > 0) {
              const latestRequest = customerData.requests[0];

              if (latestRequest.clicked) setRequestStatus("Clicked");
              else if (latestRequest.opened) setRequestStatus("Opened");
              else if (latestRequest.delivered) setRequestStatus("Delivered");
              else if (latestRequest.sent) setRequestStatus("Sent");
              else setRequestStatus("Not Sent");
            } else {
              setRequestStatus("Not Sent");
            }
          } catch (error) {
            console.error("Error fetching customer data:", error);
            setRequestStatus("Error");
          } finally {
            setIsLoading(false);
          }
        };

        fetchCustomerData();
      }, [customer.id]);

      if (isLoading) {
        return (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        );
      }

      return <RequestStatusBadge status={requestStatus} />;
    },
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
        No Customers Yet
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
