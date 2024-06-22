"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "./ButtonLoading"; // Import the ButtonLoading component
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUsername } from "@/app/actions";
import { useRouter } from "next/navigation";

// Define the schema for the form using Zod
const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export function FormExample() {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState({ username: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: defaultValues.username,
    },
  });

  // Define the submit handler for the form
  async function onSubmit(values) {
    setIsLoading(true); // Set loading state to true
    // Extract the username from the form values
    const { username } = values;

    // Simulate a delay for loading state
    setTimeout(async () => {
      // Call the createUsername function and handle the result
      const result = await createUsername(username);

      if (result.success) {
        // Redirect to the dashboard on successful submission
        router.push("/");
      } else {
        // Log any error messages
        console.error(result.message);
      }

      // Reset the form to default values after submission
      form.reset(defaultValues);
      setIsLoading(false);
    }, 2000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Render the username field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormDescription>
                This field will be validated, type-checked, and stored in
                Supabase.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Conditionally render the submit button or loading button */}
        {isLoading ? <ButtonLoading /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}