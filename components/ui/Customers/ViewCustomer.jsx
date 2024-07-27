"use client";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Buttons/button";
import { ButtonLoading } from "@/components/ui/Buttons/ButtonLoading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MousePointerClick } from "lucide-react";
import { getAllCustomerData } from "@/utils/reviews";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { sendEmailRequest, sendSMSRequest } from "@/app/actions";

export function ViewCustomer({ customer }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSMSLoading, setIsSMSLoading] = useState(false);

  const handleTriggerClick = () => {
    setIsSheetOpen(true);
  };

  useEffect(() => {
    if (isSheetOpen) {
      const fetchData = async () => {
        const result = await getAllCustomerData(customer.id);
        setCustomerData(result.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      };
      fetchData();
    }
  }, [isSheetOpen, customer.id]);

  const handleEmailRequest = async () => {
    setIsEmailLoading(true);
    try {
      const { success, error } = await sendEmailRequest(customer);
      if (success) {
        toast.success("Email request sent successfully");
      } else {
        toast.error(`Failed to send email request: ${error}`);
      }
    } catch (error) {
      toast.error(`Error sending email request: ${error.message}`);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSMSRequest = async () => {
    setIsSMSLoading(true);
    try {
      const { success, error } = await sendSMSRequest(customer);
      if (success) {
        toast.success("SMS request sent successfully");
      } else {
        toast.error(`Failed to send sms request: ${error}`);
      }
    } catch (error) {
      toast.error(`Error sending sms request: ${error.message}`);
    } finally {
      setIsSMSLoading(false);
    }
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {customer.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{`${customer.phone_number}`}</p>
                  <p className="text-sm text-muted-foreground">{`${customer.email_address}`}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {isEmailLoading ? (
                  <ButtonLoading />
                ) : (
                  <Button
                    onClick={handleEmailRequest}
                    variant="outline"
                    size="xs"
                  >
                    Email Review Request
                  </Button>
                )}

                {isSMSLoading ? (
                  <ButtonLoading />
                ) : (
                  <Button
                    onClick={handleSMSRequest}
                    variant="outline"
                    size="xs"
                  >
                    SMS Review Request
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
