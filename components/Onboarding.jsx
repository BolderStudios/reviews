// components/Onboarding.jsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ArrowLeft, Check, ChevronsUpDown, CircleX } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/Buttons/button";
import GooglePlacesAPI from "@/components/ui/Connections/GooglePlacesAPI";
import { ButtonLoading } from "@/components/ui/Buttons/ButtonLoading";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command.jsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import { completeOnboarding } from "@/app/onboarding/_actions";
import { cn } from "@/lib/utils";
import Logo from "@/public/logoBlack.png";

const categories = [
  { value: "auto-dealer", label: "Auto Dealer" },
  { value: "retail", label: "Retail" },
  { value: "auto-services", label: "Auto Services" },
  { value: "home-services", label: "Home Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "professional-services", label: "Professional Services" },
  { value: "hospitality", label: "Hospitality" },
  { value: "fitness", label: "Fitness" },
  { value: "beauty", label: "Beauty" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "other", label: "Other" },
];

const businessTypes = {
  "auto-dealer": [
    "New Car Dealership",
    "Used Car Dealership",
    "Motorcycle Dealership",
    "RV Dealership",
  ],
  retail: [
    "Clothing Store",
    "Electronics Store",
    "Furniture Store",
    "Bookstore",
    "Grocery Store",
  ],
  "auto-services": [
    "Auto Repair Shop",
    "Car Wash",
    "Auto Body Shop",
    "Tire Shop",
    "Oil Change Service",
  ],
  "home-services": [
    "General Contractor",
    "Plumber",
    "Electrician",
    "Landscaper",
    "House Cleaning Service",
  ],
  healthcare: [
    "Medical Clinic",
    "Dental Office",
    "Chiropractic Office",
    "Physical Therapy",
    "Mental Health Practice",
  ],
  "professional-services": [
    "Law Firm",
    "Accounting Firm",
    "Consulting Firm",
    "Marketing Agency",
    "Real Estate Agency",
  ],
  hospitality: [
    "Hotel",
    "Bed and Breakfast",
    "Vacation Rental",
    "Resort",
    "Hostel",
  ],
  fitness: [
    "Gym",
    "Yoga Studio",
    "Pilates Studio",
    "CrossFit Box",
    "Personal Training",
  ],
  beauty: ["Hair Salon", "Nail Salon", "Spa", "Barbershop", "Cosmetic Surgery"],
  "food-beverage": ["Restaurant", "Café", "Bar", "Bakery", "Food Truck"],
  education: [
    "Tutoring Service",
    "Language School",
    "Music School",
    "Art School",
    "Vocational Training",
  ],
  technology: [
    "Software Development",
    "IT Services",
    "Web Design",
    "App Development",
    "Cybersecurity",
  ],
  finance: [
    "Financial Planning",
    "Tax Preparation",
    "Investment Firm",
    "Insurance Agency",
    "Mortgage Broker",
  ],
  other: ["Custom Business Type"],
};

const positions = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "assistant-manager", label: "Assistant Manager" },
  { value: "director", label: "Director" },
  { value: "supervisor", label: "Supervisor" },
  { value: "other", label: "Other" },
];

const formSchema = z.object({
  businessCategory: z.string().min(1, "Please select a business category"),
  businessType: z.string().min(1, "Please select a business type"),
  nameOfContact: z.string().min(1, "Contact name is required"),
  positionOfContact: z.string().min(1, "Contact position is required"),
  testimonialProcess: z
    .string()
    .min(
      10,
      "Provide a brief description of your current process (minimum 10 characters)"
    )
    .max(500, "Please keep your description under 500 characters"),
});

export default function OnboardingComponent() {
  const user = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [openCategory, setOpenCategories] = useState(false);
  const [openTypes, setOpenTypes] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [onboardingForm, setOnboardingForm] = useLocalStorage(
    "onboarding_updated_form",
    {
      businessCategory: "",
      businessType: "",
      testimonialProcess: "",
      nameOfContact: "",
      positionOfContact: "",
    }
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: onboardingForm,
  });

  const formValues = form.watch();

  useEffect(() => {
    setOnboardingForm(formValues);
  }, [formValues, setOnboardingForm, user]);

  const handleSubmit = async (formData) => {
    if (selectedPlace === null) {
      toast.error("Please find your business location");
      return;
    }

    setIsLoading(true);

    formData.businessLocation = selectedPlace;

    try {
      await completeOnboarding(formData);

      toast.success("Onboarding complete! Welcome aboard 🎉");
      localStorage.setItem("is_onboarding_complete", true);

      router.push("/dashboard");
      form.reset({
        businessCategory: "",
        businessType: "",
        testimonialProcess: "",
        nameOfContact: "",
        positionOfContact: "",
      });
    } catch (error) {
      localStorage.setItem("is_onboarding_complete", false);
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative flex items-center justify-center">
      {/* Sign out button */}
      <div className="absolute top-4 left-4">
        <SignOutButton redirectUrl="/sign-in">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-[6px]"
          >
            <ArrowLeft size={14} className="mt-[1px]" />
            <p className="leading-7">Sign Out</p>
          </Button>
        </SignOutButton>
      </div>

      {/* Back to "/" button */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          className="flex items-center justify-center p-2 cursor-pointer text-stone-500 hover:text-stone-800 transition-all"
          asChild
        >
          <Link href="/">
            <CircleX size={24} />
          </Link>
        </Button>
      </div>

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

        <div className="flex flex-col text-center gap-2 mb-10">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-stone-900">
            Let's Get to Know Your Business
          </h4>
          <p className="leading-5 text-stone-700 px-12">
            Please provide some information to help us tailor our service to
            your needs.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              Object.values(errors).forEach((error) => {
                toast.error(error.message);
              });
            })}
            className="space-y-4"
          >
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="businessCategory"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="businessCategory"
                    >
                      Business Category
                    </FormLabel>
                    <Popover
                      open={openCategory}
                      onOpenChange={setOpenCategories}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCategory}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? categories.find(
                                  (category) => category.value === field.value
                                )?.label
                              : "Select your business category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-0">
                        <Command className="w-full">
                          <CommandGroup className="w-full">
                            <CommandList className="w-full">
                              {categories?.map((category) => (
                                <CommandItem
                                  key={`category-${category.value}`}
                                  value={category.value}
                                  className="w-full"
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    setOpenCategories(false);
                                    // Reset business type when category changes
                                    form.setValue("businessType", "");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage className="text-xs" />
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
                      Business Type
                    </FormLabel>
                    <Popover open={openTypes} onOpenChange={setOpenTypes}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTypes}
                            className="w-full justify-between"
                            disabled={!form.watch("businessCategory")}
                          >
                            {field.value
                              ? field.value
                              : "Select your business type"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-0">
                        <Command className="w-full">
                          <CommandGroup className="w-full">
                            <CommandList className="w-full">
                              {businessTypes[
                                form.watch("businessCategory")
                              ]?.map((type) => (
                                <CommandItem
                                  key={`type-${type}`}
                                  value={type}
                                  className="w-full"
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    setOpenTypes(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === type
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {type}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="nameOfContact"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel
                      className="text-foreground"
                      htmlFor="nameOfContact"
                    >
                      Managing Person's Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="nameOfContact"
                        placeholder="Enter first name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-xs" />
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
                      Managing Person's Position
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
                              : "Select their position"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-0">
                        <Command className="w-full">
                          <CommandEmpty className="w-full">
                            No position found.
                          </CommandEmpty>
                          <CommandGroup className="w-full">
                            <CommandList className="w-full">
                              {positions.map((position) => (
                                <CommandItem
                                  key={`position-${position.value}`}
                                  value={position.value}
                                  className="w-full"
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    setOpenPosition(false);
                                  }}
                                >
                                  <div className="flex items-center w-full">
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4 flex-shrink-0",
                                        field.value === position.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <span className="flex-grow">
                                      {position.label}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <p className="text-sm pb-2 font-medium">Business Location</p>
              <GooglePlacesAPI setSelectedPlace={setSelectedPlace} />
            </div>

            <FormField
              control={form.control}
              name="testimonialProcess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-foreground"
                    htmlFor="testimonialProcess"
                  >
                    Current Testimonial Request Process
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="testimonialProcess"
                      placeholder="Describe how you currently ask customers for testimonials (e.g., email, in person, automated system)"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("testimonialProcess");
                      }}
                    />
                  </FormControl>

                  <div className="flex justify-between items-center mt-1">
                    <FormMessage className="text-xs" />
                    <p className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/500 characters
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormMessage className="text-muted-foreground text-xs">
              By completing this form, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </FormMessage>

            <div>
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
