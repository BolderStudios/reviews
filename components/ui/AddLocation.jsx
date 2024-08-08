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
import { Check, ChevronsUpDown } from "lucide-react";
import { addLocationFunc } from "@/app/actions";
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
import { ButtonLoading } from "@/components/ui/Buttons/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const positions = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "supervisor", label: "Supervisor" },
];

const formSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  nameOfContact: z.string().min(1, "Point of contact name is required"),
  positionOfContact: z.string().min(1, "Please select a position"),
});

export function AddLocation() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      nameOfContact: "",
      positionOfContact: "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const response = await addLocationFunc(formData);

      if (response.success === true) {
        toast.success("Location added successfully!");

        form.reset({
          organizationName: "",
          nameOfContact: "",
          positionOfContact: "",
        });

        router.refresh();
      } else {
        toast.error("Failed to add location. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Add New Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Form to add a new location</DialogTitle>
          <DialogDescription>
            Enter the details of the new location you want to add.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              // Display toast for each error
              Object.values(errors).forEach((error) => {
                toast.error(error.message);
              });
            })}
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
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
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
                        <Input placeholder="Enter contact name" {...field} />
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
                      <Popover
                        open={openPosition}
                        onOpenChange={setOpenPosition}
                      >
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
                                : "Select position..."}
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
                After succesfully adding a location, refresh the page.
              </FormDescription>
            </div>

            <div>
              {isLoading ? (
                <ButtonLoading
                  size="lg"
                  width="w-full"
                  className="mt-2"
                  content="Adding location ..."
                />
              ) : (
                <Button type="submit" size="lg" className="w-full mt-2">
                  Add Location
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
