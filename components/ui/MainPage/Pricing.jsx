'use client';

import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/Buttons/button"
import { Calendar } from "lucide-react"
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from "next/link";

export default function Pricing() {
    const size = useWindowSize();
    const screenWidth = size.width;
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
    const isContentInView = useInView(contentRef, { once: true, amount: 0.5 });

    const titleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2,
                duration: 0.5,
            }
        },
    };

    return (
        <div className="px-[1.6rem] mt-[1.5rem] mb-[4.8rem]">
            <motion.div
                ref={titleRef}
                initial="hidden"
                animate={isTitleInView ? "visible" : "hidden"}
            >
                <motion.h1
                    variants={titleVariants}
                    className={`text-center text-stone-900 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-tighter tracking-tighter max-w-[17ch] mx-auto`}
                >
                    Pricing that scales with your business
                </motion.h1>
                <motion.p
                    variants={titleVariants}
                    className="mt-6 text-center text-stone-500 text-base sm:text-lg max-w-[45ch] mx-auto"
                >
                    Start for free. No credit card required, no contracts. As your usage grows, you'll automatically get volume pricing.
                </motion.p>
            </motion.div>

            <motion.div
                ref={contentRef}
                initial="hidden"
                animate={isContentInView ? "visible" : "hidden"}
                variants={contentVariants}
                className="mt-6 flex flex-col items-center justify-center gap-4"
            >
                <Button variant="primary" className="flex items-center justify-center bg-[#07a15e] h-[40px] px-4 md:h-[48px] md:px-6" asChild>
                    <Link href="https://calendly.com/prepaidcredits/15min" target="_blank">
                        <Calendar className='mr-2' size={16} />
                        <span>Talk to a human</span>
                    </Link>
                </Button>

                <div className="flex flex-col items-center justify-center">
                    <p className="text-blue-500 text-xs text-center max-w-[31ch] leading-normal">
                        {/* $0 today. 7.9% + 30¢-$1 per transaction. Cap at $49 per month. */}
                        $0 today. 7.9% + 30¢-$1 per transaction. No hidden fees. No contracts.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}