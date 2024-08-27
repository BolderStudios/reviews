'use client';

import { Button } from "@/components/ui/Buttons/button"
import { ArrowRight } from "lucide-react"


export default function MainPage() {
    return (
        <div className="flex flex-col">
            {/* Hero section */}
            <div className="h-screen w-full relative zoom-in">
                <img src="/hero/hero-image-21.png" alt="hero-image" className="animate-zoom-in absolute left-0 top-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="pt-4">
                        <img src="/logoWhite.png" alt="logo" className="w-[72px] h-auto sm:w-20 md:w-24 lg:w-28 object-contain" />
                    </div>

                    <div className="h-full flex flex-col justify-center items-center">
                        <div className="flex flex-col items-center text-center max-w-4xl">
                            <h1 className="text-stone-50 mb-2 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight tracking-tight max-w-[20ch] mx-auto line-clamp-2">
                                Get up to $5,000 in extra cash this month
                            </h1>
                        </div>

                        <p className="text-stone-300 text-sm sm:text-base md:text-lg pl-[12px] pr-[12px] md:px-24 lg:px-32 text-center leading-tight max-w-xs md:max-w-xl lg:max-w-2xl mx-auto xs:line-clamp-2">
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
            {/* <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <section className="my-8">
                        <h2 className="text-3xl font-bold mb-4">Mission Statement</h2>
                        <p className="text-lg">
                            Our mission is to [Your mission statement here]. We strive to [Additional details about your mission].
                        </p>
                    </section>
                </div>
            </div> */}
        </div>
    )
}