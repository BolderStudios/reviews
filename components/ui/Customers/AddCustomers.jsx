"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { addCustomerManually } from "@/app/actions";
import { Button } from "@/components/ui/Buttons/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SingleFileUploader } from "@/components/ui/Misc/SingleFileUploader";

const formSchema = z.object({
  firstName: z.string().min(1, "Please enter customer's first name."),
  emailAddress: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
});

export function AddCustomers({ selectedLocation, refreshPage }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      emailAddress: "",
      phoneNumber: "",
    },
  });

  const handleManual = async (formData) => {
    if (
      !formData.firstName &&
      !formData.emailAddress &&
      !formData.phoneNumber
    ) {
      toast.error("Please provide at least the customer's first name.");
      return;
    }

    const phoneNumber = formData.phoneNumber;

    if (!formData.emailAddress && !phoneNumber) {
      toast.error("Please provide either an email address or a phone number.");
      return;
    }

    if (
      (phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) ||
      phoneNumber.length < 10
    ) {
      toast.error(
        "Invalid phone number format. Please use a valid format (e.g., +1-234-567-8900)."
      );
      return;
    }

    let updatedPhoneNumber = formData.phoneNumber;

    if (formData.phoneNumber) {
      // Remove all non-digit characters
      const digitsOnly = formData.phoneNumber.replace(/\D/g, "");

      if (digitsOnly.length === 10) {
        // Format: XXX-XXX-XXXX
        updatedPhoneNumber = `+1 ${digitsOnly.substring(
          0,
          3
        )}-${digitsOnly.substring(3, 6)}-${digitsOnly.substring(6)}`;
      } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
        // Format: +1 XXX-XXX-XXXX
        updatedPhoneNumber = `+1 ${digitsOnly.substring(
          1,
          4
        )}-${digitsOnly.substring(4, 7)}-${digitsOnly.substring(7)}`;
      } else if (digitsOnly.length === 11 && !digitsOnly.startsWith("1")) {
        // Invalid format
        toast.error(
          "Invalid phone number format. For 11-digit numbers, it should start with '1'."
        );
        return;
      } else if (
        formData.phoneNumber.startsWith("+1") &&
        digitsOnly.length === 11
      ) {
        // Already in +1 XXX-XXX-XXXX format, just standardize the formatting
        updatedPhoneNumber = `+1 ${digitsOnly.substring(
          1,
          4
        )}-${digitsOnly.substring(4, 7)}-${digitsOnly.substring(7)}`;
      } else if (digitsOnly.length === 12 && digitsOnly.startsWith("1")) {
        // Format: +1 XXX-XXX-XXXX
        updatedPhoneNumber = `+1 ${digitsOnly.substring(
          1,
          4
        )}-${digitsOnly.substring(4, 7)}-${digitsOnly.substring(7)}`;
      } else if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        // Invalid length
        toast.error(
          "Invalid phone number length. Please enter a number between 10 and 15 digits."
        );
        return;
      }

      // For any other case, keep the original input
    }

    try {
      const response = await addCustomerManually(
        {
          ...formData,
          phoneNumber: updatedPhoneNumber,
        },
        selectedLocation.id
      );

      if (response.success) {
        toast.success("Customer added successfully.");
        form.reset();

        // setIsOpen(false);

        router.refresh();
        refreshPage();
      } else {
        toast.error(response.error || "Failed to add customer.");
      }
    } catch (error) {
      console.error("Error adding a customer:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit">
          Add a customer
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add a customer</DialogTitle>
          <DialogDescription>
            {/* Add customers manually or upload from a CSV file. */}
            Fill in the customer's information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleManual, (errors) => {
              Object.values(errors).forEach((error) => {
                toast.error(error.message);
              });
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">First name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    Email address (optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="john@outlook.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">
                    Phone number (optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234-567-8900" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Adding..." : "Add Customer"}
            </Button>
          </form>
        </Form>

        {/* <Tabs defaultValue="manually" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manually">Add manually</TabsTrigger>
            <TabsTrigger value="upload-csv">Upload from .csv</TabsTrigger>
          </TabsList>

          <TabsContent value="manually">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleManual, (errors) => {
                  Object.values(errors).forEach((error) => {
                    toast.error(error.message);
                  });
                })}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">First name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Email address (optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="john@outlook.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">
                        Phone number (optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234-567-8900" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Adding..." : "Add Customer"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="upload-csv">
            <SingleFileUploader />
          </TabsContent>
        </Tabs> */}
      </DialogContent>
    </Dialog>
  );
}