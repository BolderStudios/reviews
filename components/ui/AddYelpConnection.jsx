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
// import {
//   fetchYelpReviews,
//   updateIsFetching,
//   updateLocationAfterYelpFetch,
// } from "../../utils/server-helpers"
import {
  fetchYelpReviews,
  updateIsFetching,
  updateLocationAfterYelpFetch,
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
  const toastShown = useRef(false);

  useEffect(() => {
    if (is_fetching && !toastShown.current) {
      toast.info(
        "Yelp reviews are being fetched. Please wait or refresh the page later to see updates."
      );
      toastShown.current = true;
    }
  }, [is_fetching]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yelpBusinessLink: yelp_profile_url || "",
    },
  });

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setFetchStarted(true);
      const result = await fetchYelpReviews(formData);

      if (result.success) {
        toast.success(
          "Yelp reviews fetch initiated. Please refresh the page in a few minutes to see updates."
        );
        const locationUpdateResult = await updateLocationAfterYelpFetch(
          formData
        );

        if (locationUpdateResult.success) {
          router.refresh();
        } else {
          toast.error("Failed to update location. Please try again.");
        }
      } else {
        toast.error(
          result.message ||
            "Failed to initiate Yelp reviews fetch. Please try again."
        );
      }
    } catch (error) {
      console.error("Error initiating Yelp reviews fetch:", error);

      toast.error("Failed to initiate Yelp reviews fetch. Please try again.");
      await updateIsFetching(false);
    } finally {
      setIsLoading(false);
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

            {isLoading ? (
              <ButtonLoading width="w-full" content="Connecting to Yelp..." />
            ) : (
              <Button type="submit" className="w-full" disabled={fetchStarted}>
                {is_yelp_configured
                  ? "Update Yelp Profile"
                  : "Connect Yelp Profile"}
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
