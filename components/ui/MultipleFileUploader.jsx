"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "./ButtonLoading";
import { FileCard } from "./fileCard";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uploadFile } from "@/app/actions";

import styles from "./border.module.css";
import { CloudArrowUp, HandGrabbing } from "@phosphor-icons/react";

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

export function MultipleFileUploader() {
  const [files, setFiles] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({ files: [] });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: defaultValues.files,
    },
  });

  async function onSubmit() {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    if (files.length > 5) {
      toast.error("You can only upload up to 5 files at a time");
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
        "multiple",
        "expense_sheets"
      );
    });

    try {
      const results = await Promise.all(uploadPromises);
      results.forEach((result) => {
        if (result.success) {
          toast.success(`${result.file_name} uploaded successfully`);
          console.log("File uploaded successfully");
        } else {
          toast.error(result.message);
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

  const filesMapped = files.map((file, index) => (
    <FileCard
      key={file.lastModified}
      file={file}
      index={index}
      setFiles={setFiles}
      isLoading={isLoading}
    />
  ));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={`${styles.borderSVG} ${
                    isDragActive ? "bg-stone-50" : ""
                  } flex items-center justify-center cursor-pointer h-56 w-[400px]`}
                >
                  <input
                    {...getInputProps()}
                    id="excel-file"
                    type="file"
                    // accept=".xls, .xlsx"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFiles((prevFiles) => [...prevFiles, ...files]);
                    }}
                  />

                  {isDragActive ? (
                    <div className="flex flex-col gap-4 items-center">
                      {/* Upload icon */}
                      <HandGrabbing className="w-6 h-6 text-stone-500" />

                      {/* Description for allowed files */}
                      <div className="flex flex-col gap-1 items-center">
                        <p className="font-medium">
                          Drop the files here to upload.
                        </p>
                        <p className="text-stone-500 text-sm">
                          Once you drop the files, click on the upload button.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 items-center">
                      {/* Upload icon */}
                      <CloudArrowUp className="w-6 h-6 text-stone-500" />

                      {/* Description for allowed files */}
                      <div className="flex flex-col gap-1 items-center">
                        <p className="font-medium">
                          Choose a file or drag & drop it here.
                        </p>
                        <p className="text-stone-500 text-sm">
                          JPEG, PNG, PDF, and MP4 formats, up to 5 MB.
                        </p>
                      </div>

                      {/* Fake upload button */}
                      <div className="mt-2 text-sm font-medium text-stone-600 rounded-md border border-stone-200 px-3 py-1 hover:bg-stone-50 hover:text-stone-700 transition-all">
                        Browse Files
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="w-[400px]">
                This field will be validated and the files will be uploaded to
                Supabase Storage bucket.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {filesMapped.length > 0 ? (
          <div className="flex flex-col gap-2">{filesMapped}</div>
        ) : null}

        {isLoading ? (
          <ButtonLoading />
        ) : (
          <Button className="w-[400px]" type="submit">
            Upload Files
          </Button>
        )}
      </form>
    </Form>
  );
}
