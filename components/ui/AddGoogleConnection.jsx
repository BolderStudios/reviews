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
import { addLocationFunc } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  googlePlaceId: z.string().min(1, "Place ID is required"),
  googlePlaceCoordinates: z.string().min(1, "Coordinates are required"),
});

export function AddGoogleConnection() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      googlePlaceId: "",
      googlePlaceCoordinates: "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await addLocationFunc(formData);
      if (response.success === true) {
        toast.success("Google Business Profile connected successfully!");
        form.reset();
      } else {
        toast.error(
          "Failed to connect Google Business Profile. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Add Google Connection</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Connect Google Business Profile</DialogTitle>
          <DialogDescription>
            Link your Google Business Profile to monitor and manage your
            reviews.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              Object.values(errors).forEach((error) => {
                toast.error(error.message);
              });
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="googlePlaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="googlePlaceId">Google Place ID</FormLabel>
                  <FormControl>
                    <Input
                      id="googlePlaceId"
                      placeholder="ChIJ2eUgeAK6j4ARbn5u_wAGqWA"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your Google Place ID. You can find this by:
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>
                        Go to the{" "}
                        <a
                          href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Place ID Finder
                        </a>
                      </li>
                      <li>Search for your business name</li>
                      <li>Copy the Place ID shown in the results</li>
                    </ol>
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="googlePlaceCoordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="googlePlaceCoordinates">
                    Google Place Coordinates
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="googlePlaceCoordinates"
                      placeholder="37.7749,-122.4194"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the latitude and longitude of your business location,
                    separated by a comma. You can find these coordinates by:
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to Google Maps</li>
                      <li>Right-click on your business location</li>
                      <li>Copy the coordinates shown at the top</li>
                    </ol>
                  </FormDescription>
                </FormItem>
              )}
            />

            {isLoading ? (
              <ButtonLoading
                size="lg"
                width="w-full"
                content="Connecting to Google..."
              />
            ) : (
              <Button type="submit" size="lg" className="w-full">
                Connect Google Business Profile
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
