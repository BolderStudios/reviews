"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
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
import { uploadFile } from "@/app/actions";

import styles from "./border.module.css";
import {
  CloudArrowUp,
  HandGrabbing,
  MicrosoftExcelLogo,
  X,
} from "@phosphor-icons/react";

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
    console.log("Submitting form");
    console.log(files);
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

  const filesMapped = files.map((file, index) => (
    <div
      key={index}
      className="border border-stone-200 flex justify-between gap-2 px-3 py-3 rounded-lg w-[400px]"
    >
      <div className="flex gap-2">
        {/* File icon */}
        <div className="flex items-center justify-center">
          <MicrosoftExcelLogo
            color="green"
            weight="duotone"
            className="w-9 h-9"
          />
        </div>

        {/* File info */}
        <div className="flex flex-col">
          <p className="font-regular text-sm">{file.name}</p>
          <p className="text-stone-500 text-xs">
            {Math.round(file.size / 1024)} KB
          </p>
        </div>
      </div>

      {/* Remove button */}
      <Button
        onClick={() => {
          setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        }}
        variant="ghost"
        className="h-fit rounded-md p-[1px] hover:bg-stone-100 transition-all cursor-pointer"
      >
        <X className="w-4 h-4 text-stone-500" />
      </Button>
    </div>
  ));

  console.log("files", files);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Multiple File Uploader</FormLabel>
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
                    accept=".xls, .xlsx"
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
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
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

        {isLoading ? <ButtonLoading /> : <Button type="submit">Upload</Button>}
      </form>
    </Form>
  );
}
