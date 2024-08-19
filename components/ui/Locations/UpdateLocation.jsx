"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown, MapPin, Phone, Globe } from "lucide-react";
import {
  deleteLocationFunc,
  updateLocationFunc,
  getLocationInfo,
} from "@/app/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/Buttons/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

const positions = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "supervisor", label: "Supervisor" },
];

const formSchema = z.object({
  organizationName: z.string().optional(),
  nameOfContact: z.string().optional(),
  positionOfContact: z.string().optional(),
});

export function UpdateLocation({ selectedLocation }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const router = useRouter();

  console.log("selectedLocation", selectedLocation);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      nameOfContact: "",
      positionOfContact: "",
    },
  });

  useEffect(() => {
    const fetchLocationInfo = async () => {
      try {
        const response = await getLocationInfo(selectedLocation.id);
        setLocationData(response.selectedLocation);
      } catch (error) {
        console.error("Error fetching location info:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    };

    fetchLocationInfo();
  }, [selectedLocation]);

  const handleUpdate = async (formData) => {
    if (formData.nameOfContact === "" && formData.positionOfContact !== "") {
      toast.error("Please the name of contact.");
      return;
    }

    if (formData.positionOfContact === "" && formData.nameOfContact !== "") {
      toast.error("Please enter the position of contact.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await updateLocationFunc(selectedLocation.id, formData);

      if (response.success) {
        if (response.message === "No changes to apply") {
          toast.info(response.message);
        } else {
          window.location.reload();
          router.refresh();
          toast.success(response.message);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating location:", error);

      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (selectedLocation.is_primary) {
      toast.error("You cannot delete the primary location.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteLocationFunc(selectedLocation.id);
      if (response.success) {
        toast.success("Location deleted successfully!");
        if (response.newLocationId) {
          router.push(`/dashboard/${response.newLocationId}`);
        } else {
          router.push("/onboarding");
        }
        router.refresh();
      } else {
        toast.error(
          response.message || "Failed to delete location. Please try again."
        );
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={
            locationData?.organization_name === undefined ||
            locationData?.organization_name === null
              ? true
              : false
          }
          variant="outline"
          size="sm"
          className="w-fit"
        >
          Manage {locationData?.organization_name}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] h-fit">
        <div>
          <img
            src={selectedLocation.google_maps_main_image_url}
            alt="Google Business Profile Image"
            className="max-w-full h-40 w-full object-cover rounded-lg"
          />
        </div>
        <DialogHeader>
          <DialogTitle className="mb-3">
            {locationData?.organization_name}
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            <div className="flex items-center gap-[6px]">
              <MapPin size={16} />
              <span>{locationData?.address}</span>
            </div>

            <div className="flex items-center gap-[6px]">
              <Phone size={16} />
              <span>+1 {locationData?.business_phone_number}</span>
            </div>

            <div className="flex items-center gap-[6px]">
              <Globe size={16} />
              <Link className="text-blue-500" href={locationData?.business_url}>
                {locationData?.business_url.split("/")[2]}
              </Link>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div>

        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Organization Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter new organization name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="nameOfContact"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-foreground">
                      Point of Contact Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter new contact name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionOfContact"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-foreground">
                      Contact Position
                    </FormLabel>
                    <Popover open={openPosition} onOpenChange={setOpenPosition}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? positions.find(
                                  (position) => position.value === field.value
                                )?.label
                              : "Select new position..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandEmpty>No position found.</CommandEmpty>
                            <CommandGroup>
                              {positions.map((position) => (
                                <CommandItem
                                  value={position.value}
                                  key={position.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "positionOfContact",
                                      position.value
                                    );
                                    setOpenPosition(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      position.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {position.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <FormDescription className="text-xs mt-2">
              Leave fields blank to keep current values. Changes will be
              reflected after you refresh the page.
            </FormDescription>

            <div className="flex justify-between gap-4 mt-4">
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                type="submit"
                disabled={isUpdating || isDeleting}
              >
                {isUpdating ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#292524"
                      />
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Location"
                )}
              </Button>

              <Button
                size="lg"
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={
                  isUpdating || isDeleting || selectedLocation.is_primary
                }
              >
                {isDeleting ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#292524"
                      />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Location"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
