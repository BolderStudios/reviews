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
import { fetchYelpReviews, updateLocationAfterYelpFetch } from "@/app/actions";
import { Button } from "@/components/ui/button";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yelpBusinessLink: yelp_profile_url || "",
    },
  });

  const handleSubmit = async (formData) => {
    console.log("Submitting Yelp fetch request...");
    setIsLoading(true);

    try {
      const result = await fetchYelpReviews(formData);
      console.log("Yelp fetch initiation result:", result);

      if (result.success) {
        toast.success(
          "Yelp reviews fetch initiated. This process may take a few minutes. Please refresh the page later to see updates.",
          { duration: 5000 }
        );

        const locationUpdateResult = await updateLocationAfterYelpFetch(formData);
        if (locationUpdateResult.success) {
          toast.success("Yelp profile URL updated successfully.");
        } else {
          toast.error("Failed to update Yelp profile URL. Please try again.");
        }

        router.refresh();
      } else {
        console.error("Failed to initiate Yelp reviews fetch");
        toast.error(
          result.message ||
            "Failed to initiate Yelp reviews fetch. Please try again.",
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Error in Yelp fetch process:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const buttonContent = () => {
    if (is_yelp_configured) return "Update Yelp Profile";
    return "Connect Yelp Profile";
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
          {is_fetching ? "Yelp Fetch in Progress" : buttonContent()}
        </Button>
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
              disabled={isLoading || is_fetching}
            >
              {isLoading ? "Processing..." : buttonContent()}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
