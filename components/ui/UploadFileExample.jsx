"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "./ButtonLoading";
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
import { uploadFile } from "@/app/actions";

const formSchema = z.object({
  files: z.array(
    z.instanceof(File).refine((file) => file.size <= 5242880, {
      message: "File size should not exceed 5MB",
    })
  ),
});

export function UploadFileExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({ files: [] });

  // Initialize the form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: defaultValues.files,
    },
  });

  // Define the submit handler for the form
  async function onSubmit(values) {
    setIsLoading(true); // Set loading state to true
    const { files } = values;

    // Create a FormData object to handle the file upload
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return uploadFile(formData);
    });

    try {
      const results = await Promise.all(uploadPromises);
      results.forEach((result) => {
        if (result.success) {
          console.log("File uploaded successfully");
        } else {
          console.error(result.message);
        }
      });
    } catch (error) {
      console.error("Error uploading files: ", error);
    } finally {
      form.reset(defaultValues);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Render the file upload field */}
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pictures</FormLabel>
              <FormControl>
                <Input
                  id="pictures"
                  type="file"
                  multiple
                  className="cursor-pointer"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    field.onChange(files);
                  }}
                />
              </FormControl>
              <FormDescription>
                This field will be validated and the files will be uploaded.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading ? <ButtonLoading /> : <Button type="submit">Upload</Button>}
      </form>
    </Form>
  );
}
