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
import { fetchYelpReviews } from "@/app/actions";
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
  yelpBusinessLink: z.string().url("Please enter a valid Yelp business URL"),
});

export function AddYelpConnection() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yelpBusinessLink: "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    console.log("FormData: ", formData);
    try {
      // Replace with your actual Cloudflare Worker URL
      const workerUrl =
        "https://fetch-yelp-reviews.kuznetsov-dg495.workers.dev/";

      const response = await fetch(workerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        cache: "no-cache",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Yelp reviews fetched successfully!");
        // Handle the fetched reviews here
        console.log("Fetched reviews:", result.reviews);
        console.log("Total reviews:", result.totalReviews);

        // You might want to store the reviews in state or pass them to another function
        // setReviews(result.reviews);
        // updateTotalReviews(result.totalReviews);

        form.reset({
          yelpBusinessLink: "",
        });
      } else {
        toast.error(
          result.message || "Failed to fetch Yelp reviews. Please try again."
        );
      }
    } catch (error) {
      console.error("Error fetching Yelp reviews:", error);
      toast.error("Failed to fetch Yelp reviews. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Add Yelp Connection</Button>
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
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              Object.values(errors).forEach((error) => {
                toast.error(error.message);
              });
            })}
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
                      {" "}
                      Example:
                      https://www.yelp.com/biz/awesome-cafe-san-francisco
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {isLoading ? (
              <ButtonLoading
                size="lg"
                width="w-full"
                content="Connecting to Yelp..."
              />
            ) : (
              <Button type="submit" size="lg" className="w-full">
                Connect Yelp Profile
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
