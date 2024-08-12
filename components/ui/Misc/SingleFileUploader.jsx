// components/ui/FileUploadExample.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Buttons/button";
import { ButtonLoading } from "@/components/ui/Buttons/ButtonLoading";
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

export function SingleFileUploader({
  title,
  description,
  buttonText,
  handleCustomerUpload,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: files,
    },
  });

  async function onSubmit() {
    if (files.length === 0) {
      toast.error("Please add a file to upload");
      return;
    }

    setIsLoading(true);

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

      const toastPromises = results.map((result, index) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (result.success) {
              toast.success(`${result.file_name} uploaded successfully`);
              console.log("File uploaded successfully");
            } else {
              toast.error(result.message);
              console.error(result.message);
            }

            resolve();
          });
        }, 1000 * (index + 1));
      });

      await Promise.all(toastPromises);
    } catch (error) {
      console.error("Error uploading files: ", error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      setFiles([]);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Single File Uploader</FormLabel>
              <FormControl>
                <Input
                  ref={fileInputRef}
                  id="excel-file"
                  type="file"
                  accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  multiple={false}
                  className="cursor-pointer"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);

                    files.forEach((file) => {
                      if (
                        file.type !== "application/vnd.ms-excel" &&
                        file.type !==
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      ) {
                        e.target.value = null;
                        setFiles([]);
                        toast.error(`Only .XLS and .XLSX files are allowed`);
                      } else if (file.size > 5242880) {
                        e.target.value = null;
                        setFiles([]);
                        toast.error(`${file.name} exceeds the 5MB limit`);
                      } else {
                        toast.message(`${file.name} is added to the list`);
                        setFiles((prevFiles) => [...prevFiles, file]);
                      }
                    });
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
          <Button className="w-full" type="submit">
            Upload
          </Button>
        )}
      </form>
    </Form>
  );
}
