// "/[location_id]/templates/standard/yelp/submit-form/page.jsx"

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/Buttons/button";
import { ButtonLoading } from "@/components/ui/Buttons/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { receiveFeedback } from "@/app/actions";
import { useParams } from "next/navigation";

const formSchema = z.object({
  feedback: z.string().min(6, "Please share at least a few words with us."),
});

export function FeedbackSubmitPageCampaign() {
  const pathname = usePathname();
  const customerId = pathname.split("/")[5];

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const { location_id } = params;
  const splittedLocationId = location_id.split(".");
  let actualLocationId;
  if (splittedLocationId[0] === "www") {
    actualLocationId = splittedLocationId[1];
  } else {
    actualLocationId = splittedLocationId[0];
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    const selectedReasons = localStorage.getItem("selectedReasons_campaign");
    const rating = localStorage.getItem("rating_campaign");
    await receiveFeedback(
      actualLocationId,
      formData,
      rating,
      selectedReasons,
      "campaign",
      customerId
    );

    localStorage.removeItem("selectedReasons_campaign");
    localStorage.removeItem("rating_campaign");

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Thank you for your feedback!");
      router.push(`/templates/standard/yelp/campaign/${customerId}/thank-you`);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-2xl">
        <h2 className="text-sm text-center text-gray-500 mb-2">
          Step 3 of 3 - Grand finale! 🎭
        </h2>
        <h1 className="text-3xl font-bold mb-2 text-center">
          Spill the tea, superstar!
        </h1>
        <p className="text-center mb-8 text-gray-600">
          Your thoughts are our rocket fuel! Help us zoom to new heights of
          awesome!
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              const errorValues = Object.values(errors);
              errorValues.length >= 3
                ? toast.error("Please fill all required fields.")
                : Object.values(errors).forEach((error) => {
                    toast.error(error.message);
                  });
            })}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-700 font-semibold">
                    Paint us a picture with words!
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="We're all ears to learn more about what happened!"
                      {...field}
                      className="h-32"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-8">
              {isLoading ? (
                <ButtonLoading
                  size="lg"
                  className="w-full py-6 text-lg"
                  content="Launching your feedback... 🚀"
                />
              ) : (
                <Button
                  type="submit"
                  className="w-full py-6 text-lg bg-blue-500 hover:bg-blue-600"
                >
                  Let us make this right!
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
