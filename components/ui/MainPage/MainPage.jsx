'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/Buttons/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { ArrowRight, Star } from "lucide-react"
import { useWindowSize } from "@uidotdev/usehooks";

export default function MainPage() {
    const size = useWindowSize();
    const screenWidth = size.width;

    return (
        <div className="flex flex-col">
            {/* Hero section */}
            <div className="w-full relative zoom-in min-h-[100dvh] h-[100svh]">
                <img src="/hero/hero-image-14.png" alt="hero-image" className="animate-zoom-in absolute left-0 top-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 pt-4">
                    {/* ... rest of the hero section content ... */}
                </div>
            </div>

            {/* Rest of the page content */}
            <div className="bg-white">
                <div className="container mx-auto px-4">
                    <section>
                        <h2 className="text-3xl font-bold mb-4">Mission Statement</h2>
                        <p className="text-lg">
                            Our mission is to [Your mission statement here]. We strive to [Additional details about your mission].
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}