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
    const [viewportHeight, setViewportHeight] = useState('100vh');

    useEffect(() => {
        const updateViewportHeight = () => {
            setViewportHeight(`${window.innerHeight}px`);
        };

        updateViewportHeight();
        window.addEventListener('resize', updateViewportHeight);

        return () => window.removeEventListener('resize', updateViewportHeight);
    }, []);

    return (
        <div className="flex flex-col">
            {/* Hero section */}
            <div className="w-full relative zoom-in" style={{ height: viewportHeight }}>
                <img src="/hero/hero-image-14.png" alt="hero-image" className="animate-zoom-in absolute left-0 top-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="flex items-center justify-between w-full z-10">
                        <img src="/logoWhite.png" alt="logo" className="w-[90px] h-auto sm:w-20 md:w-24 lg:w-28 object-contain" />
                        <Button variant="customOutline" className="h-[30px] px-2 border border-stone-300">
                            Get started
                        </Button>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                        <div className="mb-6 sm:mb-8 flex items-center justify-center gap-4">
                            <div className="flex -space-x-2">
                                <Avatar className="w-8 h-8 sm:w-11 sm:h-11">
                                    <AvatarImage src="/avatars/avatar1.jpg" className="object-cover" alt="Avatar 1" />
                                    <AvatarFallback>A1</AvatarFallback>
                                </Avatar>
                                <Avatar className="w-8 h-8 sm:w-11 sm:h-11">
                                    <AvatarImage src="/avatars/avatar2.jpg" className="object-cover" alt="Avatar 2" />
                                    <AvatarFallback>A2</AvatarFallback>
                                </Avatar>
                                <Avatar className="w-8 h-8 sm:w-11 sm:h-11">
                                    <AvatarImage src="/avatars/avatar3.jpg" className="object-cover" alt="Avatar 3" />
                                    <AvatarFallback>A3</AvatarFallback>
                                </Avatar>
                                <Avatar className="w-8 h-8 sm:w-11 sm:h-11">
                                    <AvatarImage src="/avatars/avatar4.jpg" className="object-cover" alt="Avatar 4" />
                                    <AvatarFallback>A4</AvatarFallback>
                                </Avatar>
                                <Avatar className={`w-8 h-8 sm:w-11 sm:h-11 ${screenWidth >= 400 ? "block" : "hidden"}`}>
                                    <AvatarImage src="/avatars/avatar5.jpg" className="object-cover" alt="Avatar 5" />
                                    <AvatarFallback>A5</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex flex-col items-start justify-center gap-1">
                                <div className="flex items-center justify-center">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                                </div>

                                <p className={`text-stone-300 font-medium ${screenWidth <= 700 ? "text-xs" : "text-sm"}`}>
                                    loved by businesses nationwide
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center max-w-4xl">
                            <h1 className={`text-stone-50 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-none tracking-tighter max-w-[20ch] mx-auto xs:line-clamp-2`}>
                                Get up to $5,000 in extra revenue this month
                            </h1>
                        </div>

                        <p className={`text-stone-300 font-medium ${screenWidth <= 300 ? "text-sm" : "text-base"} md:text-lg pl-[12px] pr-[12px] md:px-24 lg:px-32 text-center leading-normal max-w-xs md:max-w-xl lg:max-w-2xl mx-auto xs:line-clamp-2`}>
                            Secure loyal customers and increase revenue by offering prepaid credits
                        </p>

                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-6 md:mt-8">
                            <Button variant="primary" className="h-[40px] px-4 md:h-[48px] md:px-6">
                                Start today. It's free!
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of the page content */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <section className="my-8">
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