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

const formSchema = z.object({
  feedback: z.string().min(6, "Please share at least a few words with us."),
  customerName: z.string().min(1, "We'd love to know your name!"),
  phoneNumber: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, "Please enter a valid phone number."),
});

export function FeedbackSubmitPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
      customerName: "",
      phoneNumber: "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    // Here send the data to your backend
    console.log("Form data:");
    console.log(formData);

    // Simulating an API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Thank you for your feedback!");
      //   router.push("/templates/standard/yelp/thank-you");
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        We Value Your Feedback
      </h1>
      <p className="text-center mb-8">
        Your thoughts help us grow and improve. We're all ears!
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, (errors) => {
            // console.log("Errors:");
            // console.log(errors);
            const errorValues = Object.values(errors);
            // console.log(errorValues);
            errorValues.length >= 3
              ? toast.error("Please fill highlighted fields.")
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
                <FormLabel className="text-primary font-semibold">
                  Share Your Thoughts
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind? We're excited to hear it!"
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
                  <FormLabel className="text-primary font-semibold">
                    What's Your Name?
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your name here" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-semibold">
                    Your Phone Number
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
                        maxLength={12} // 123-456-7890
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-sm mt-2">
                    We might reach out to chat more about your experience. Don't
                    worry, we won't spam you!
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Back
            </Button>

            {isLoading ? (
              <ButtonLoading size="lg" className="w-32" content="Sending..." />
            ) : (
              <Button type="submit" size="lg" className="w-32">
                Let Us Know
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
