"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Buttons/button";
import { initiateYelpFetch, getFetchStatus } from "@/app/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  yelpBusinessLink: z.string().url("Please enter a valid Yelp business URL"),
});

export function AddYelpConnection({
  is_fetching,
  is_yelp_configured,
  yelp_profile_url,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(is_fetching || false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasShownFetchingToast = useRef(false);
  const lastErrorMessageRef = useRef("");
  const hasShownErrorToastRef = useRef(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yelpBusinessLink: yelp_profile_url || "",
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

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    const { success } = await initiateYelpFetch(formData);

    if (success) {
      toast.info(
        "Yelp review fetch initiated. This process will take up to 10 minutes. You can close this dialog and check back later."
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
    if (isLoading) return "Fetching Yelp Reviews...";
    if (is_yelp_configured) return "Update Yelp Profile";
    return "Connect Yelp Profile";
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
          <DialogTitle>Yelp Connection</DialogTitle>
          <DialogDescription>
            Connect your Yelp business profile to monitor and manage your
            reviews. This process will fetch your latest Yelp reviews and may
            take up to 10 minutes.
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
                    find this by visiting your business page on Yelp.
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Fetching..."
                : is_yelp_configured
                ? "Update and Fetch Reviews"
                : "Connect and Fetch Reviews"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
