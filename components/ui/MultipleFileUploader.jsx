"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { toast } from "sonner";
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
  const ref = useRef(null);
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
    <div
      key={index}
      ref={ref}
      className={`border border-stone-200 flex justify-between px-3 py-3 rounded-lg w-[400px] animate-file-add-up`}
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
      <div
        onClick={() => {
          toast.message("File removed from the list");
          // Add animation classes separately
          ref.current.classList.add("-translate-y-1");
          ref.current.classList.add("opacity-0");
          ref.current.classList.add("ease-out");
          ref.current.classList.add("duration-300");
          setTimeout(() => {
            setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
          }, 300);
          console.log("Ref element: ", ref.current);
        }}
        variant="ghost"
        className={`h-fit rounded-md p-[1px] hover:bg-stone-100 transition-all  ${
          isLoading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <X className="w-4 h-4 text-stone-500" />
      </div>
    </div>
  ));

  console.log("files: ", files);

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
