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
import { PlusIcon } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function AddWebForm() {
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
                    <div className="w-1/2 p-6 overflow-y-auto"></div>

                    {/* Preview Section */}
                    <div className="w-1/2 bg-gray-100 p-6 flex flex-col justify-between">
                        <h3 className="text-lg font-semibold mb-4">Preview</h3>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}