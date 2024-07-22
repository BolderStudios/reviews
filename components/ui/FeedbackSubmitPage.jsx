// "/[location_id]/templates/standard/yelp/submit-form/page.jsx"

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmailRequest } from "@/app/actions";
import { useParams } from "next/navigation";

const formSchema = z.object({
  feedback: z.string().min(6, "Please share at least a few words with us."),
  customerName: z.string().min(1, "We'd love to know your name!"),
  customerPhoneNumber: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, "Please enter a valid phone number."),
});

export function FeedbackSubmitPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const { location_id } = params;
  const actualLocationId = location_id.split(".")[1];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
      customerName: "",
      customerPhoneNumber: "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    const selectedReasons = localStorage.getItem("selectedReasons");
    const rating = localStorage.getItem("rating");
    await sendEmailRequest(actualLocationId, formData, rating, selectedReasons);

    localStorage.removeItem("selectedReasons");
    localStorage.removeItem("rating");

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Thank you for your feedback!");
      router.push("/templates/standard/yelp/thank-you");
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

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md text-gray-700 font-semibold">
                      Who's your name?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your name here" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md text-gray-700 font-semibold">
                      What's your phone number?
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                          +1
                        </span>
                        <Input
                          type="tel"
                          placeholder="123-456-7890"
                          className="rounded-l-none"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, "");
                            let formattedValue = "";
                            if (value.length > 0) {
                              formattedValue += value.slice(0, 3);
                              if (value.length > 3) {
                                formattedValue += `-${value.slice(3, 6)}`;
                              }
                              if (value.length > 6) {
                                formattedValue += `-${value.slice(6, 10)}`;
                              }
                            }
                            field.onChange(formattedValue);
                          }}
                          maxLength={12}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm mt-2 text-gray-500">
                      We might reach out to chat more about your experience.
                      Don't worry, we won't spam you!
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

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
