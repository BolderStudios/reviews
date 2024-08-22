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
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/app/actions";
import { uploadLogo } from "@/app/actions";
import { useRouter } from "next/navigation";

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
                        "image/jpeg",
                        "image/png",
                    ].includes(file.type),
                {
                    message: "Only .png and .jpeg files are allowed",
                }
            )
    ),
});

export function UploadLogo({ setLogoUrl, locationId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            files: files,
        },
    });

    async function onSubmit() {
        if (files.length === 0) {
            toast.error("Please your company's logo to upload");
            return;
        }

        setIsLoading(true);

        const logo = files[0];
        const formData = new FormData();
        formData.append("file", logo);

        const result = await uploadLogo(formData, locationId);

        if (result.success) {
            setLogoUrl(result.logo_url);
            router.refresh();

            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

            setFiles([]);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
            toast.success("Logo uploaded successfully");
        } else {
            toast.error(result.message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    ref={fileInputRef}
                                    id="excel-file"
                                    type="file"
                                    accept=".png, .jpeg"
                                    multiple={false}
                                    className="cursor-pointer"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);

                                        files.forEach((file) => {
                                            if (
                                                file.type !== "image/png" &&
                                                file.type !==
                                                "image/jpeg"
                                            ) {
                                                e.target.value = null;
                                                setFiles([]);
                                                toast.error(`Only .png and .jpeg files are allowed`);
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
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isLoading ? (
                    <ButtonLoading />
                ) : (
                    <Button variant="outline" className="w-full" type="submit">
                        Upload Logo
                    </Button>
                )}
            </form>
        </Form>
    );
}
