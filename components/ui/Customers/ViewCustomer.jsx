"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageSquare, Phone, AtSign, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Buttons/button";
import { ButtonLoading } from "@/components/ui/Buttons/ButtonLoading";
import { MousePointerClick } from "lucide-react";
import { getSingleCustomerData } from "@/utils/reviews";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  sendEmailRequest,
  sendSMSRequest,
  updateCustomerInfo,
} from "@/app/actions";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function ViewCustomer({ customer, refreshPage }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSMSLoading, setIsSMSLoading] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const router = useRouter();

  const handleTriggerClick = () => {
    setIsSheetOpen(true);
  };

  useEffect(() => {
    if (isSheetOpen) {
      const fetchData = async () => {
        const { data } = await getSingleCustomerData(customer.id);
        setCustomerData(data);
        setNewEmail(data.email_address || "");
        setNewPhone(data.phone_number || "");
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

  const formatPhoneNumber = (phoneNumber) => {
    const digitsOnly = phoneNumber.replace(/\D/g, "");

    if (digitsOnly.length === 10) {
      return `+1 ${digitsOnly.substring(0, 3)}-${digitsOnly.substring(
        3,
        6
      )}-${digitsOnly.substring(6)}`;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
      return `+1 ${digitsOnly.substring(1, 4)}-${digitsOnly.substring(
        4,
        7
      )}-${digitsOnly.substring(7)}`;
    } else if (phoneNumber.startsWith("+1") && digitsOnly.length === 11) {
      return `+1 ${digitsOnly.substring(1, 4)}-${digitsOnly.substring(
        4,
        7
      )}-${digitsOnly.substring(7)}`;
    } else {
      return phoneNumber;
    }
  };

  const handleUpdateInfo = async (field) => {
    try {
      let updatedInfo;

      if (field === "email") {
        const formatedEmail = newEmail.trim().toLowerCase();
        let re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(formatedEmail) === false) {
          toast.error("Invalid email address");
          return;
        }

        if (formatedEmail === newEmail && newEmail.length > 0) {
          toast.warning(
            "Email address didn't change after formatting or might be invalid."
          );
          return;
        }

        updatedInfo = { email_address: formatedEmail || null };
      } else {
        const formattedPhone = formatPhoneNumber(newPhone);

        if (formattedPhone === newPhone && newPhone.length > 0) {
          toast.warning(
            "Phone number didn't change after formatting or might be invalid."
          );
          return;
        }

        updatedInfo = { phone_number: formattedPhone || null };
      }

      const { success, error } = await updateCustomerInfo(
        customer.id,
        updatedInfo
      );

      if (success) {
        toast.success(
          `${field === "email" ? "Email" : "Phone number"} updated successfully`
        );

        setCustomerData({ ...customerData, ...updatedInfo });
        setIsEditingEmail(false);
        setIsEditingPhone(false);

        refreshPage();
      } else {
        toast.error(`Failed to update ${field}: ${error}`);
      }
    } catch (error) {
      toast.error(`Error updating ${field}: ${error.message}`);
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
      <SheetContent className="overflow-y-auto w-[50vw] max-w-[1000px]">
        <SheetHeader>
          <SheetTitle>Customer information</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="mt-6 space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col justify-between">
              <h3 className="font-semibold">{customer.first_name}</h3>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div>
                    <div className="flex items-center gap-2 mt-2">
                      <AtSign className="h-4 w-4 inline-block text-stone-700" />
                      {isEditingEmail ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="h-8 w-48"
                          />
                          <Button
                            onClick={() => handleUpdateInfo("email")}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => setIsEditingEmail(false)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <p
                          className="text-sm text-muted-foreground cursor-pointer hover:underline"
                          onClick={() => setIsEditingEmail(true)}
                        >
                          {customerData.email_address || "Add email"}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="h-4 w-4 inline-block text-stone-700" />
                      {isEditingPhone ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="h-8 w-48"
                          />
                          <Button
                            onClick={() => handleUpdateInfo("phone")}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => setIsEditingPhone(false)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <p
                          className="text-sm text-muted-foreground cursor-pointer hover:underline"
                          onClick={() => setIsEditingPhone(true)}
                        >
                          {customerData.phone_number || "Add phone number"}
                        </p>
                      )}
                    </div>
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
                      disabled={!customerData.email_address}
                      className={`${
                        !customerData.email_address ? "cursor-not-allowed" : ""
                      }`}
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
                      disabled={!customerData.phone_number}
                      className={`${
                        !customerData.phone_number ? "cursor-not-allowed" : ""
                      }`}
                    >
                      SMS Review Request
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="w-full h-40 border border-gray-200 bg-stone-100 rounded-lg flex flex-col items-center justify-center p-4">
                <MessageSquare className="text-gray-400 mb-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  No Testimonial Yet
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  Testimonial will appear here once submitted.
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
