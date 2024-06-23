// components/ui/FileUploadExample.jsx
// This is a reusable multi-file upload component

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
    z
      .instanceof(File)
      .refine((file) => file.size <= 5242880, {
        message: "File size should not exceed 5MB",
      })
      .refine(
        (file) =>
          [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ].includes(file.type),
        {
          message: "Only .XLS and .XLSX files are allowed",
        }
      )
  ),
});

export function FileUploadExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({ files: [] });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: defaultValues.files,
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    const { files } = values;

    const uploadPromises = files.map((file, index) => {
      const formData = new FormData();
      formData.append("file", file);

      return uploadFile(
        formData,
        "expense_sheets",
        index,
        "single",
        "expense_sheets"
      );
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
    <div className="px-8 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Expenses Sheet</FormLabel>
                <FormControl>
                  <Input
                    id="excel-file"
                    type="file"
                    accept=".xls, .xlsx"
                    // multiple
                    className="cursor-pointer"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      field.onChange(files);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This field will be validated and the files will be uploaded to
                  Supabase Storage bucket.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">Upload</Button>
          )}
        </form>
      </Form>
    </div>
  );
}
