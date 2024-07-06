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
import { useLocalStorage } from "@uidotdev/usehooks";
// import {
//   fetchYelpReviews,
//   updateIsFetching,
//   updateLocationAfterYelpFetch,
// } from "../../utils/server-helpers"
// import {
//   fetchYelpReviews,
//   updateIsFetching,
//   updateLocationAfterYelpFetch,
//   fetchYelpReviewsRequest,
// } from "@/app/actions";

import {
  fetchYelpReviewsRequest,
  updateIsFetching,
  updateLocationAfterYelpFetch,
  checkYelpFetchStatus,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  yelpBusinessLink: z.string().url("Please enter a valid Yelp business URL"),
});

export function AddYelpConnection({
  is_fetching,
  is_yelp_configured,
  yelp_profile_url,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(is_fetching);
  const [fetchStarted, setFetchStarted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [yelpFetchTaskId, setYelpFetchTaskId] = useLocalStorage(
    "yelpFetchTaskId",
    ""
  );

  const toastShown = useRef(false);
  const effectRan = useRef(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yelpBusinessLink: yelp_profile_url || "",
    },
  });

  useEffect(() => {
    if (is_fetching && !toastShown.current) {
      toast.info(
        "Yelp reviews are being fetched. Please wait or refresh the page later to see updates."
      );
      toastShown.current = true;
    }
  }, [is_fetching]);

  useEffect(() => {
    let intervalId;

    console.log("storedTaskId:", yelpFetchTaskId);
    if (yelpFetchTaskId !== "") {
      setIsLoading(true);
      setFetchStarted(true);

      intervalId = setInterval(async () => {
        console.log("Checking Yelp fetch status...");

        try {
          const status = await checkYelpFetchStatus(yelpFetchTaskId);
          console.log("Yelp fetch status:", status);

          if (status.success) {
            if (status.status === "completed") {
              toast.success("Yelp reviews fetch completed!");
              setIsLoading(false);
              setFetchStarted(false);
              await updateIsFetching(false);
              setYelpFetchTaskId("");
              router.refresh();
              clearInterval(intervalId);
            } else if (status.status === "failed") {
              toast.error("Yelp reviews fetch failed. Please try again.");
              setIsLoading(false);
              setFetchStarted(false);
              await updateIsFetching(false);
              setYelpFetchTaskId("");
              clearInterval(intervalId);
            }
          } else if (status.status === "no_task_id") {
            console.log("No task ID found, clearing interval");
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Error checking Yelp fetch status:", error);
          toast.error(
            "An error occurred while checking Yelp fetch status. Please try again."
          );
          setIsLoading(false);
          setFetchStarted(false);
          await updateIsFetching(false);
          setYelpFetchTaskId("");
          clearInterval(intervalId);
        }
      }, 5000);
    }

    return () => clearInterval(intervalId);
  }, [yelpFetchTaskId, router, setYelpFetchTaskId]);

  const handleSubmit = async (formData) => {
    console.log("Submitting Yelp fetch request...");
    // Get location id 
    console.log("formData:", formData);

    try {
      setIsLoading(true);
      setFetchStarted(true);
      await updateIsFetching(true);

      const result = await fetchYelpReviewsRequest(formData);
      console.log("Yelp fetch request result:", result);

      if (result.success) {
        toast.success(
          "Yelp reviews fetch initiated. We'll update you when it's complete."
        );
        setYelpFetchTaskId(result.taskId);
        const locationUpdateResult = await updateLocationAfterYelpFetch(
          formData
        );

        if (locationUpdateResult.success) {
          console.log("Location updated successfully");
        } else {
          console.error("Failed to update location");
          toast.error(
            "Failed to update location with Yelp profile. Please try again."
          );
        }
      } else {
        console.error("Failed to initiate Yelp reviews fetch");
        toast.error(
          result.message ||
            "Failed to initiate Yelp reviews fetch. Please try again."
        );
        setIsLoading(false);
        setFetchStarted(false);
        await updateIsFetching(false);
      }
    } catch (error) {
      console.error("Error in Yelp fetch process:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
      setFetchStarted(false);
      await updateIsFetching(false);
    }
  };

  const buttonContent = () => {
    if (is_yelp_configured) return "Yelp Profile Connected";
    if (fetchStarted) return "Fetch Initiated - Refresh Later";
    return "Add Yelp Connection";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isLoading ? (
          <ButtonLoading
            width="w-full"
            content="Processing..."
            onClick={() => setIsDialogOpen(true)}
          />
        ) : (
          <Button
            className="w-full"
            disabled={fetchStarted}
            onClick={() => setIsDialogOpen(true)}
          >
            {buttonContent()}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Yelp Connection</DialogTitle>
          <DialogDescription>
            Connect your Yelp business profile to monitor and manage your
            reviews.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="yelpBusinessLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="yelpBusinessLink">
                    Yelp Business Profile URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="yelpBusinessLink"
                      placeholder="https://www.yelp.com/biz/your-business-name"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    Enter the full URL of your Yelp business profile. You can
                    find this by:
                    <ol className="list-decimal list-inside mt-2 space-y-1 leading-5">
                      <li>Going to your business page on Yelp</li>
                      <li>
                        Copying the entire URL from your browser's address bar
                      </li>
                      <li>Pasting it into the field above</li>
                    </ol>
                    <p className="leading-5 mt-2">
                      Example:
                      https://www.yelp.com/biz/awesome-cafe-san-francisco
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || fetchStarted}
            >
              {is_yelp_configured
                ? "Update Yelp Profile"
                : "Connect Yelp Profile"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
