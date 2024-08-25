'use client';

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/Buttons/button"
import { PlusIcon, PaintBucket, Hand, PenLine } from "lucide-react"
import { Card } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import ReactMarkdown from 'react-markdown'
import { UploadLogo } from "@/components/ui/WebForms/UploadLogo"
import Image from "next/image"
import { useRouter } from "next/navigation"
import defaultLogo from "@/public/logoBlack.png";

const form_details = {
    title: "Share a testimonial!",
    intro: "Do you love using our product? We'd love to hear about it!\n\n" +
        "- Share your experience with a quick video or testimonial\n" +
        "- Recording a video? Don't forget to smile 😊",
    logoUrl: process.env.NEXT_PUBLIC_REDIRECT_URL.startsWith("localhost") ? "http://127.0.0.1:54321/storage/v1/object/public/logos/public/default/default_logo.png?t=2024-08-22T02%3A53%3A54.780Z"
        : "https://pextrfkqkyzhumavhpqd.supabase.co/storage/v1/object/public/logos/public/default/logo.png?t=2024-08-22T05%3A59%3A29.786Z"
}

export function AddWebForm({ selectedLocation }) {
    const router = useRouter();
    const [welcomePageTitle, setWelcomePageTitle] = useState(form_details.title)
    const [welcomePageIntro, setWelcomePageIntro] = useState(form_details.intro)
    const [logoUrl, setLogoUrl] = useState(selectedLocation?.stored_logo_url === null || selectedLocation?.stored_logo_url === undefined ? defaultLogo : selectedLocation?.stored_logo_url)
    const [whatToShow, setWhatToShow] = useState("welcome_page")

    useEffect(() => {
        router.refresh();
    }, [logoUrl])



    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* <Button variant="outline">Add Email Template</Button> */}
                <Card className="flex items-center justify-center w-full h-full cursor-pointer mt-6">
                    <div className="flex items-center gap-2 border border-stone-200 rounded-2xl p-2">
                        <PlusIcon className="w-4 h-4" />
                    </div>
                </Card>
            </DialogTrigger>

            <DialogContent removeOverlay={true} className="w-screen h-screen max-w-full p-0 sm:rounded-none">
                <div className="flex h-full">
                    <div className="w-1/2 p-6">
                        <DialogTitle>Testimonial Form</DialogTitle>

                        {/* Form creation fields */}
                        <div className="mt-6">
                            <Accordion type="single" collapsible className="w-full">
                                {/* Design */}
                                <AccordionItem value="design">
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4">
                                            <PaintBucket className="w-4 h-4" />
                                            <span>Design</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 p-1">
                                        {/* Upload logo */}
                                        <div className="flex flex-col gap-2 pb-3">
                                            <Label className="text-sm font-medium text-stone-600">Logo</Label>
                                            <UploadLogo setLogoUrl={setLogoUrl} locationId={selectedLocation.id} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Welcome Page */}
                                <AccordionItem value="welcome_page" onClick={() => setWhatToShow("welcome_page")}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4">
                                            <Hand className="w-4 h-4" />
                                            <span>Welcome Page</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 px-1">
                                        {/* Title input */}
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium text-stone-600">Welcome Page Title</Label>
                                            <Input type="text" placeholder="Enter title" value={welcomePageTitle} onChange={(e) => setWelcomePageTitle(e.target.value)} />
                                        </div>

                                        {/* Intro input */}
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-sm font-medium text-stone-600">Introductory Message</Label>
                                            <Textarea placeholder="Enter intro" value={welcomePageIntro} onChange={(e) => setWelcomePageIntro(e.target.value)} className="min-h-[200px]" />
                                            <span className="text-xs text-stone-600 font-medium">Markdown supported</span>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Response Page */}
                                <AccordionItem value="response_page" onClick={() => setWhatToShow("response_page")}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4">
                                            <PaintBucket className="w-4 h-4" />
                                            <span>Response Page</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Yes. It&apos;s animated by default, but you can disable it if you
                                        prefer.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>

                    {/* Preview Section */}
                    {whatToShow === "response_page" && <h1>Response Page</h1>}
                    {whatToShow === "welcome_page" && (<div className="w-1/2 bg-gray-100 flex items-center justify-center h-full p-6">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-md">
                            <div className="flex items-center justify-start mb-4">
                                {selectedLocation?.stored_logo_url === null || selectedLocation?.stored_logo_url === undefined ? <Image src={logoUrl} alt="Company Logo" width={99}
                                    height={10}
                                    priority /> : <img src={selectedLocation?.stored_logo_url} alt="Company Logo" className="w-14 h-full object-cover" />}
                            </div>

                            <h3 className="text-xl font-semibold mb-4">{welcomePageTitle}</h3>

                            <ReactMarkdown
                                className="prose prose-sm max-w-none text-stone-600 break-words text-[14px]"
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-4 last:mb-0 whitespace-pre-wrap" {...props} />,
                                    h1: ({ node, ...props }) => <h1 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-md font-semibold mt-3 mb-2" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                    a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                                }}
                            >
                                {welcomePageIntro}
                            </ReactMarkdown>

                            <Button className="flex items-center gap-2 mt-6 w-full justify-center">
                                <PenLine className="w-4 h-4" />
                                <span>Write a testimonial</span>
                            </Button>
                        </div>
                    </div>)}
                </div>
            </DialogContent>
        </Dialog>
    );
}