'use client';

import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/Buttons/button"
import { ArrowRight, Calendar } from "lucide-react"

export default function Pricing() {
    const size = useWindowSize();
    const screenWidth = size.width;

    return (
        <div className="px-[1.6rem] mt-[1.5rem] mb-[4.8rem]">
            <h1 className={`text-center text-stone-900 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-tighter tracking-tighter max-w-[17ch] mx-auto`}>
                Pricing that scales with your business
            </h1>
            <p className="mt-6 text-center text-stone-500 text-base sm:text-lg max-w-[45ch] mx-auto">
                Start for free. No credit card required, no contracts. As your usage grows, you'll automatically get volume pricing.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-4">
                <Button variant="primary" className="flex items-center justify-center bg-[#07a15e] h-[40px] px-4 md:h-[48px] md:px-6">
                    {/* Start today. It's free! */}
                    <Calendar className='mr-2' size={16} />
                    <span>Talk to a human</span>
                    {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
                </Button>

                <div className="flex flex-col items-center justify-center">
                    <p className="text-blue-500 text-xs text-center max-w-[30ch] leading-normal">
                        $0 today. 5% + 80¢ per transaction. Cap at $49 per month.
                    </p>
                </div>
            </div>
        </div>
    )
}