// components/ui/MultipleFileUploader.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Buttons/button";
import { ButtonLoading } from "@/components/ui/Buttons/ButtonLoading";
import { FileCard } from "@/components/ui/fileCard";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
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
    console.log("Files dropped: ", acceptedFiles);
    // setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDropRejected: (rejectedFiles) => {
      toast.error("Only .XLS and .XLSX files are allowed");
    },
    onDropAccepted: (acceptedFiles) => {
      console.log("Each accepted file:");
      acceptedFiles.forEach((file) => {
        if (file.size > 5242880) {
          toast.error(`${file.name} exceeds the 5MB limit`);
        } else {
          setFiles((prevFiles) => [...prevFiles, file]);
        }
      });
    },
  });

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

    if (files.length > 3) {
      toast.error("You can only upload up to 3 files at a time");
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

      // Create a promise for each toast to resolve after the timeout
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
          }, 1000 * (index + 1));
        });
      });

      await Promise.all(toastPromises);
    } catch (error) {
      console.error("Error uploading files: ", error);
    } finally {
      form.reset(defaultValues);
      setFiles([]);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }

  const filesMapped = files.map((file, index) => (
    <FileCard
      // Important to keep unique key for each file
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
                    isDragActive ? "bg-stone-100" : ""
                  } flex items-center justify-center cursor-pointer h-56 w-full`}
                >
                  <input
                    {...getInputProps()}
                    id="excel-file"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const inputFiles = Array.from(e.target.files);

                      // Check total files already added and new files selected
                      if (inputFiles.length + files.length > 3) {
                        toast.error(
                          "You can only upload up to 3 files at a time"
                        );
                        return;
                      }

                      const newFiles = [];

                      inputFiles.forEach((file) => {
                        if (file.size > 5242880) {
                          toast.error(`${file.name} exceeds the 5MB limit`);
                        } else {
                          const doesExist = files.some(
                            (existingFile) =>
                              existingFile.name === file.name &&
                              existingFile.lastModified === file.lastModified
                          );

                          if (doesExist) {
                            toast.error(`${file.name} is already in the list`);
                          } else {
                            newFiles.push(file);
                            toast.message(`${file.name} is added to the list`);
                          }
                        }
                      });

                      // Set the files if new valid files were added
                      if (newFiles.length > 0) {
                        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                      }
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
              <FormDescription className="w-full">
                This field will be validated and uploaded to Supabase Storage
                bucket.
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
          <Button className="w-full" type="submit">
            Upload Files
          </Button>
        )}
      </form>
    </Form>
  );
}
