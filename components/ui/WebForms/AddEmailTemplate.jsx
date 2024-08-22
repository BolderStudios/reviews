'use client';

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/Buttons/button"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowRight, PlusIcon } from "lucide-react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const templates = [
    {
        id: 1,
        name: "Default",
        subject: "Share a testimonial with us {{ first_name }}!",
        message: `Hey {{ first_name }} 👋

Got a quick minute? We'd love to hear your thoughts! Your feedback helps us make sure we're delivering the best experience possible.

Click the link below to share a testimonial with us!

Thanks,
Daniel`
    },
    {
        id: 2,
        name: "Short",
        subject: "Share a testimonial with us {{ first_name }}!",
        message: `Hi {{ first_name }},

Mind shooting us a one-liner about your experience with us? We'd love to feature you on our website!

Thanks,
Daniel`,
    },
    {
        id: 3,
        name: "Friendly",
        subject: "Give us a shoutout {{ first_name }}!",
        message: `Hi {{ first_name }},

Thank you so much for working with us!

We're a small team and would love to hear about your experience with us. Would you mind sharing a testimonial? It'll only take a minute 🙏

Thanks,
Daniel`,
    },
    {
        id: 4,
        name: "Formal",
        subject: "Request for a testimonial",
        message: `Dear {{ first_name }},

I hope this message finds you in good health and spirits.

I am writing to you to kindly request your support in providing a testimonial regarding your experiences with our service. As someone whose opinion I deeply respect and value, your insights would be an immense asset in helping to communicate the value of our product to others.

Warm regards,
Daniel`
    },
]

export function AddEmailTemplate() {
    const [currentStep, setCurrentStep] = useState(1)
    const [currentTemplate, setCurrentTemplate] = useState(templates[0])
    const [subject, setSubject] = useState(templates[0].subject)
    const [message, setMessage] = useState(templates[0].message)

    const handleTemplateChange = (template_num) => {
        setCurrentTemplate(templates[template_num])
        setSubject(templates[template_num].subject)
        setMessage(templates[template_num].message)
    }

    useEffect(() => {
        // If subject or message don't match any template, set currentTemplate to null
        const template = templates.find(template => template.subject === subject && template.message === message)

        if (!template) {
            setCurrentTemplate(null)
        } else {
            setCurrentTemplate(template)
        }
    }, [subject, message])

    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* <Button variant="outline">Add Email Template</Button> */}
                <Card className="flex items-center justify-center w-full h-full cursor-pointer">
                    <div className="flex items-center gap-2 border border-stone-200 rounded-2xl p-2">
                        <PlusIcon className="w-4 h-4" />
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent removeOverlay={true} className="w-screen h-screen max-w-full p-0 sm:rounded-none">
                <div className="flex h-full">
                    <div className="w-1/2 p-6 overflow-y-auto">
                        <Breadcrumb className="mb-8">
                            <BreadcrumbList className="flex items-center">
                                <BreadcrumbItem onClick={() => setCurrentStep(1)} className={`${currentStep === 1 ? "text-blue-500" : ""} cursor-pointer`}>
                                    <span>Message</span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem onClick={() => setCurrentStep(2)} className={`${currentStep === 2 ? "text-blue-500" : ""} cursor-pointer`}>
                                    <span>Logo</span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem onClick={() => setCurrentStep(3)} className={`${currentStep === 3 ? "text-blue-500" : ""} cursor-pointer`}>
                                    <span>Advanced</span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem onClick={() => setCurrentStep(4)} className={`${currentStep === 4 ? "text-blue-500" : ""} cursor-pointer`}>
                                    <span>Done</span>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div>
                            {/* Step 1 */}
                            <div>
                                <div className="flex flex-col gap-6 mt-4">
                                    <DialogTitle className="text-xl font-semibold">Pick a template or write a message</DialogTitle>

                                    {/* Select Templates */}
                                    <div>
                                        <p className="text-sm text-stone-600 font-medium">Select a template</p>

                                        {/* List of tempaltes */}
                                        <div className="flex items-center gap-3 mt-2 text-stone-500 text-sm group">
                                            <div onClick={() => handleTemplateChange(0)} className={`px-4 py-2 cursor-pointer rounded-md border border-stone-200 font-medium ${currentTemplate?.name === "Default" ? "bg-stone-100 text-blue-500" : ""}`}>
                                                <span>Default</span >
                                            </div>
                                            <div onClick={() => handleTemplateChange(1)} className={`px-4 py-2 cursor-pointer rounded-md border border-stone-200 font-medium ${currentTemplate?.name === "Short" ? "bg-stone-100 text-blue-500" : ""}`}>
                                                <span>Short</span>
                                            </div>
                                            <div onClick={() => handleTemplateChange(2)} className={`px-4 py-2 cursor-pointer rounded-md border border-stone-200 font-medium ${currentTemplate?.name === "Friendly" ? "bg-stone-100 text-blue-500" : ""}`}>
                                                <span>Friendly</span>
                                            </div>
                                            <div onClick={() => handleTemplateChange(3)} className={`px-4 py-2 cursor-pointer rounded-md border border-stone-200 font-medium ${currentTemplate?.name === "Formal" ? "bg-stone-100 text-blue-500" : ""}`}>
                                                <span>Formal</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form to Add Subject and Body Message */}
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" type="text" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea className="min-h-[200px]" id="message" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Supported variables */}
                                <div className="mt-1">
                                    <span className="text-sm text-stone-600 font-medium">
                                        Supported variables: <span className="text-blue-500 font-medium">name</span>, <span className="text-blue-500 font-medium">first_name</span>.
                                    </span>
                                </div>
                            </div>


                            {/* Move Forward Button */}
                            <DialogFooter className="mt-6">
                                <Button disabled={currentStep === 4} onClick={() => { setCurrentStep(currentStep + 1); }} className="w-full" type="submit"><span className="flex items-center gap-2 text-sm flex item-center justify-center font-medium">{currentStep === 4 ? "Congrats" : <>Next <ArrowRight className="h-4 w-4 text-white" /></>}</span></Button>
                            </DialogFooter>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="w-1/2 bg-gray-100 p-6 flex flex-col justify-between">
                        <h3 className="text-lg font-semibold mb-4">Preview</h3>

                        {/* Preview content will go here */}
                        <div className="bg-white rounded shadow flex flex-col h-full rounded-b-lg">
                            {/* Apple-like header with close buttons similar to the one in the email preview */}
                            <div className="flex items-center border-b border-stone-200">
                                <div className="flex items-center gap-2 py-3 px-4">
                                    <span className="w-3 h-3 rounded-full bg-red-500">&nbsp;</span>
                                    <span className="w-3 h-3 rounded-full bg-yellow-500">&nbsp;</span>
                                    <span className="w-3 h-3 rounded-full bg-green-500">&nbsp;</span>
                                </div>

                                <div className="flex items-center justify-center w-full">
                                    <p className="text-xs text-stone-600 font-semibold">New message</p>
                                </div>
                            </div>

                            {/* From and To */}
                            <div className="flex flex-col gap-2 py-2 px-4 border-b border-stone-200">
                                <p className="text-sm text-stone-600 font-medium">From: noreply@getbrandarmor.com</p>
                                <p className="text-sm text-stone-600 font-medium">To: example@example.com</p>
                            </div>

                            {/* Subject */}
                            <div className="flex flex-col py-2 px-4 border-b border-stone-200">
                                <p className="text-sm text-stone-900 font-medium">{subject}</p>
                            </div>

                            {/* Email body */}
                            <div className="bg-stone-50 px-12 py-16 h-full rounded-b-lg">
                                <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-white">
                                    {/* Message must have indentation */}
                                    <p className="text-sm text-stone-950 font-sm whitespace-pre-wrap font-medium" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                        {message.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </p>

                                    <div className="mt-8 w-full">
                                        <Button className="w-full">Leave a testimonial</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}