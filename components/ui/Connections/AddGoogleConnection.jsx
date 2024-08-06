"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Buttons/button";
import GooglePlacesAPI from "@/components/ui/Connections/GooglePlacesAPI";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { initiateGoogleFetch, getFetchStatus } from "@/app/actions";

const formSchema = z.object({
  googlePlaceId: z.string().min(1, "Place ID is required"),
  googlePlaceCoordinates: z.string().min(1, "Coordinates are required"),
});

export function AddGoogleConnection({
  is_fetching,
  google_place_id,
  is_google_configured,
  google_place_coordinates,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(is_fetching || false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasShownFetchingToast = useRef(false);
  const lastErrorMessageRef = useRef("");
  const hasShownErrorToastRef = useRef(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      googlePlaceId: google_place_id || "",
      googlePlaceCoordinates: google_place_coordinates || "",
    },
  });

  useEffect(() => {
    let intervalId;

    const checkFetchStatus = async () => {
      const { success, data } = await getFetchStatus();

      if (success) {
        if (data.is_fetching) {
          setIsLoading(true);

          if (!hasShownFetchingToast.current) {
            toast.info(
              "Yelp review fetch is in progress. This may take up to 10 minutes."
            );

            hasShownFetchingToast.current = true;
          }
        } else {
          setIsLoading(false);

          if (
            data.fetch_error_message &&
            data.fetch_error_message !== lastErrorMessageRef.current
          ) {
            lastErrorMessageRef.current = data.fetch_error_message;

            if (!hasShownErrorToastRef.current) {
              toast.error(`Fetch error: ${data.fetch_error_message}`);
              hasShownErrorToastRef.current = true;
            }
          } else if (hasShownFetchingToast.current) {
            hasShownFetchingToast.current = false;
            hasShownErrorToastRef.current = false;

            if (!data.fetch_error_message) {
              toast.success("Yelp reviews fetched successfully!");
              router.push("/dashboard");
            }
          }
        }
      }
    };

    // Initial check
    checkFetchStatus();

    // Set up interval
    intervalId = setInterval(checkFetchStatus, 30000);

    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [router]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const { success } = await initiateGoogleFetch(selectedPlace);

    if (success) {
      toast.info(
        "Google review fetch initiated. This process will take up to 10 minutes. You can close this dialog and check back later."
      );
      setIsDialogOpen(false);
      router.refresh();
    } else {
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
      router.refresh();
    }
  };

  const buttonContent = () => {
    if (isLoading) return "Review Fetching In Progress...";
    if (is_google_configured) return "Update Google Profile";
    return "Connect Google Profile";
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isLoading}
          className="w-full"
          onClick={() => setIsDialogOpen(true)}
        >
          {buttonContent()}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Connect Google Business Profile</DialogTitle>
          <DialogDescription>
            Link your Google Business Profile to monitor and manage your
            reviews.
          </DialogDescription>
        </DialogHeader>

        <GooglePlacesAPI setSelectedPlace={setSelectedPlace} />
        
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !selectedPlace}
          className="w-full"
        >
          {isLoading
            ? "Fetching..."
            : is_google_configured
            ? "Update and Fetch Reviews"
            : "Connect and Fetch Reviews"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

{
  /* <Form {...form}>
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
                  <div className="text-sm text-muted-foreground">
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
                  </div>
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
                  <div className="text-sm text-muted-foreground">
                    Enter the latitude and longitude of your business location,
                    separated by a comma. You can find these coordinates by:
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to Google Maps</li>
                      <li>Right-click on your business location</li>
                      <li>Copy the coordinates shown at the top</li>
                    </ol>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full">
              {isLoading
                ? "Fetching..."
                : is_google_configured
                ? "Update and Fetch Reviews"
                : "Connect and Fetch Reviews"}
            </Button>
          </form>
        </Form> */
}
