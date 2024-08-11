"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { CustomersTable } from "./CustomersTable";
import { AlertCircle, Loader2 } from "lucide-react";
import { ViewCustomer } from "@/components/ui/Customers/ViewCustomer";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";
import { getSingleCustomerData } from "@/utils/reviews";
import { AddCustomers } from "@/components/ui/Customers/AddCustomers";
import { getAllCustomers } from "@/app/actions";

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
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};

export default function Customers({ selectedLocation }) {
  const [customerData, setCustomerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const columns = useMemo(
    () => [
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <ViewCustomer customer={row.original} />,
      },
      {
        accessorKey: "first_name",
        header: "First Name",
      },
      {
        accessorKey: "email_address",
        header: "Email",
      },
      {
        accessorKey: "phone_number",
        header: "Phone",
      },
      {
        accessorKey: "requests",
        header: "Email Requests",
        cell: ({ row }) => {
          const [requestStatus, setRequestStatus] = useState("Not Sent");
          const [isStatusLoading, setIsStatusLoading] = useState(true);

          useEffect(() => {
            const fetchRequestStatus = async () => {
              try {
                const customerData = await getSingleCustomerData(
                  row.original.id
                );

                if (customerData.requests.length > 0) {
                  const latestRequest = customerData.requests[0];

                  if (latestRequest.clicked) setRequestStatus("Clicked");
                  else if (latestRequest.opened) setRequestStatus("Opened");
                  else if (latestRequest.delivered)
                    setRequestStatus("Delivered");
                  else if (latestRequest.sent) setRequestStatus("Sent");
                }
              } catch (error) {
                console.error("Error fetching request status:", error);
                setRequestStatus("Error");
              } finally {
                setIsStatusLoading(false);
              }
            };

            fetchRequestStatus();
          }, [row.original.id]);

          if (isStatusLoading) {
            return <Loader2 className="h-4 w-4 animate-spin" />;
          }

          return <RequestStatusBadge status={requestStatus} />;
        },
      },
    ],
    []
  );

  const fetchCustomerData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllCustomers(selectedLocation.id);

      if (result.success) {
        setCustomerData(result.data);
      } else {
        console.error("Error fetching customer data:", result.error);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation.id]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData, refreshTrigger]);

  const refreshPage = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl">
            Customers ({customerData.length})
          </h2>
          <AddCustomers
            selectedLocation={selectedLocation}
            refreshPage={refreshPage}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : customerData.length > 0 ? (
          <CustomersTable columns={columns} data={customerData} />
        ) : (
          <>
            {renderEmptyState()}
            <div className="mt-8 opacity-50 pointer-events-none">
              <CustomersTable columns={columns} data={[]} />
            </div>
          </>
        )}
      </div>
    </SignedInLayout>
  );
}
