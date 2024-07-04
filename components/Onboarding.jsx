// components/Onboarding.jsx

"use client";

import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { completeOnboarding } from "@/app/onboarding/_actions";
import Logo from "@/public/logoBlack.png";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const industries = [
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "technology", label: "Technology" },
  // Add more industries as needed
];

const positions = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "supervisor", label: "Supervisor" },
  // Add more positions as needed
];

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Please select an industry"),
  positionOfContact: z.string().min(1, "Please select a position"),
  numberOfEmployees: z.coerce
    .number()
    .min(1, "Add number of employees you have"),
  numberOfLocations: z.coerce
    .number()
    .min(1, "Add number of locations you run"),
  businessChallenges: z
    .string()
    .min(1, "Describe your custom retential challenges"),
  pointOfContactName: z.string().min(1, "Review overseer's name is required"),
  positionOfContact: z
    .string()
    .min(1, "Review overseer's position is required"),
  // googleMapsLink: z.string().url("Invalid Google Maps link"),
  // googleRedirectLink: z.string().url("Invalid Google Redirect link"),
  // yelpBusinessLink: z.string().url("Invalid Yelp Business link"),
  // yelpRedirectLink: z.string().url("Invalid Yelp Redirect link"),
  // complementarySolutions: z
  //   .string()
  //   .min(1, "Complementary solutions are required"),
});

export default function OnboardingComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      numberOfEmployees: "",
      numberOfLocations: "",
      businessChallenges: "",
      pointOfContactName: "",
      positionOfContact: "",
      // googleMapsLink: "",
      // googleRedirectLink: "",
      // yelpBusinessLink: "",
      // yelpRedirectLink: "",
      // complementarySolutions: "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      await completeOnboarding(formData);
      toast.success("Onboarding complete 🎉");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative flex items-center justify-center">
      {/* Go Back button */}
      <div className="absolute top-4 left-4">
        <SignOutButton redirectUrl="/sign-in">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-[6px]"
          >
            <ArrowLeft size={14} className="mt-[1px]" />
            <p className="leading-7">Signout</p>
          </Button>
        </SignOutButton>
      </div>

      {/* Main onboarding component */}
      <div className="w-[600px] py-6 px-8">
        <div className="flex flex-col items-center justify-center mb-6">
          <Image
            src={Logo}
            alt="Brand Armor Logo"
            width={99}
            height={10}
            priority
          />
        </div>

        <div className="flex flex-col text-center gap-2 mb-6">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-stone-900">
            Complete Your Profile
          </h4>
          <p className="leading-5 text-stone-700">
            Please provide some information about your business.
          </p>
        </div>

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
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="businessName"
                    >
                      What is your company called?
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="businessName"
                        placeholder="Enter business name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="businessType"
                    >
                      What type of business is it?
                    </FormLabel>
                    <Popover open={openIndustry} onOpenChange={setOpenIndustry}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openIndustry}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? industries.find(
                                  (industry) => industry.value === field.value
                                )?.label
                              : "Select industry..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search industry..." />
                          <CommandEmpty>No industry found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {industries?.map((industry) => (
                                <CommandItem
                                  key={`industry-${industry.value}`}
                                  value={industry.value}
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    setOpenIndustry(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === industry.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {industry.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="pointOfContactName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="pointOfContactName"
                    >
                      Who is the point of contact?
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="pointOfContactName"
                        placeholder="Enter name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionOfContact"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="positionOfContact"
                    >
                      What is their position?
                    </FormLabel>
                    <Popover open={openPosition} onOpenChange={setOpenPosition}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPosition}
                            className="w-full justify-between"
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
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search position..." />
                          <CommandEmpty>No position found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {positions.map((position) => (
                                <CommandItem
                                  key={`position-${position.value}`}
                                  value={position.value}
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    setOpenPosition(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === position.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {position.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="numberOfEmployees"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="numberOfEmployees"
                    >
                      How many employees do you have?
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="numberOfEmployees"
                        placeholder="Enter number of employees"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfLocations"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="numberOfLocations"
                    >
                      How many locations do you run?
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="numberOfLocations"
                        placeholder="Enter number of locations"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="flex gap-4">
              <FormField
                control={form.control}
                name="googleMapsLink"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="googleMapsLink"
                    >
                      Google Maps Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="googleMapsLink"
                        placeholder="https://www.google.com/maps/..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="googleRedirectLink"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="googleRedirectLink"
                    >
                      Google Redirect Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="googleRedirectLink"
                        placeholder="https://g.page/..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div> */}

            {/* <div className="flex gap-4">
              <FormField
                control={form.control}
                name="yelpBusinessLink"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="yelpBusinessLink"
                    >
                      Yelp Business Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="yelpBusinessLink"
                        placeholder="https://www.yelp.com/biz/..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yelpRedirectLink"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="yelpRedirectLink"
                    >
                      Yelp Redirect Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="yelpRedirectLink"
                        placeholder="https://yelp.to/..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div> */}

            <FormField
              control={form.control}
              name="businessChallenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-foreground"
                    htmlFor="businessChallenges"
                  >
                    Customer Retential Challenges
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="businessChallenges"
                      placeholder="Describe your business goals or challenges regarding customer retention"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="complementarySolutions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-foreground"
                    htmlFor="complementarySolutions"
                  >
                    Complementary Solutions
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="complementarySolutions"
                      placeholder="Describe complementary solutions we could offer to bring back customers"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <FormMessage className="text-muted-foreground text-xs">
              This information will be used to create a primary location for
              your business on the platform.
            </FormMessage>

            <div className="mt-6">
              {isLoading ? (
                <ButtonLoading
                  size="lg"
                  width="w-full"
                  content="Completing onboarding ..."
                />
              ) : (
                <Button type="submit" size="lg" className="w-full">
                  Complete Onboarding
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
