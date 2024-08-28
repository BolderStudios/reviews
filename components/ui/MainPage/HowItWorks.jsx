'use client';

import { useWindowSize } from "@uidotdev/usehooks";

export default function HowItWorks() {
    const size = useWindowSize();
    const screenWidth = size.width;

    return (
        <div className="px-[1.6rem] mt-[1.5rem] mb-[4.8rem] max-w-[600px] mx-auto">
            <h1 className={`text-center text-stone-900 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-none tracking-tighter max-w-[20ch] mx-auto`}>How it works</h1>
            <p className="text-center text-stone-500 text-base sm:text-lg">It's simple. You offer a prepaid credit to your customers. They use it to make a purchase. <span className="inline-block bg-[#fde7c5] font-medium">You get paid.</span></p>

            <div className="mt-12 flex flex-col gap-6">
                {/* Card */}
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex flex-col items-center gap-4 self-stretch">
                        <div className="flex-shrink-0">
                            <span className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center text-stone-900 font-medium text-xl">1</span>
                        </div>
                        <div className="flex-grow w-[2px] bg-[#e4e4e7] rounded-[12px]">&nbsp;</div>
                    </div>

                    <div className="bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg">
                        <h3 className="text-lg font-medium text-[#f15a2b] mb-2">Connect your calendar.</h3>
                        <p className="text-stone-700 text-base tracking-tight">You can also add Circleback to a meeting with a link, hit record on your phone or laptop, or import a recording.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex flex-col items-center gap-4 self-stretch">
                        <div className="flex-shrink-0">
                            <span className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center text-stone-900 font-medium text-xl">2</span>
                        </div>
                        <div className="flex-grow w-[2px] bg-[#e4e4e7] rounded-[12px]">&nbsp;</div>
                    </div>

                    <div className="bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg">
                        <h3 className="text-lg font-medium text-[#f15a2b] mb-2">Connect your calendar.</h3>
                        <p className="text-stone-700 text-base tracking-tight">You can also add Circleback to a meeting with a link, hit record on your phone or laptop, or import a recording.</p>
                    </div>
                </div>

                {/* Card */}
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex flex-col items-center gap-4 self-stretch">
                        <div className="flex-shrink-0">
                            <span className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center text-stone-900 font-medium text-xl">3</span>
                        </div>
                        <div className="flex-grow w-[2px] bg-[#e4e4e7] rounded-[12px]">&nbsp;</div>
                    </div>

                    <div className="bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg">
                        <h3 className="text-lg font-medium text-[#f15a2b] mb-2">Connect your calendar.</h3>
                        <p className="text-stone-700 text-base tracking-tight">You can also add Circleback to a meeting with a link, hit record on your phone or laptop, or import a recording.</p>
                    </div>
                </div>

                {/* Card */}
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex flex-col items-center gap-4 self-stretch">
                        <div className="flex-shrink-0">
                            <span className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center text-stone-900 font-medium text-xl">4</span>
                        </div>
                    </div>

                    <div className="bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg">
                        <h3 className="text-lg font-medium text-[#f15a2b] mb-2">Connect your calendar.</h3>
                        <p className="text-stone-700 text-base tracking-tight">You can also add Circleback to a meeting with a link, hit record on your phone or laptop, or import a recording.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}