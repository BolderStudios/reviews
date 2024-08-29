'use client';

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

export default function TextScroll() {
    const size = useWindowSize();
    const screenWidth = size.width;

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end center"]
    });

    const firstParagraph = "Local businesses can't afford cash flow problems or customer churn — we built BrandArmor to help you achieve financial stability and customer retention."
    const secondParagraph = "Our loyalty-driven platform turns customer relationships into immediate revenue, transforming local shops into recession-proof businesses—without loans or debt."

    const firstParagraphArray = firstParagraph.split(" ")
    const secondParagraphArray = secondParagraph.split(" ")

    const renderParagraph = (wordsArray, startOffset = 0) => (
        <motion.div className={`${screenWidth > 400 ? "text-[2rem]" : "text-[1.6rem]"} md:text-[2.4rem] tracking-[-0.02em] leading-[1.15] flex flex-wrap gap-2 px-[1.6rem]`}>
            {wordsArray.map((word, index) => {
                const progress = (startOffset + index) / (firstParagraphArray.length + secondParagraphArray.length);
                const start = Math.max(0, progress - 0.05);
                const end = Math.min(progress + 0.05, 1);

                const wordOpacity = useTransform(
                    scrollYProgress,
                    [start, (start + end) / 2, end],
                    [0.16, 0.16, 1]
                );

                const isLoyaltyDriven = word === "loyalty-driven";
                const gradientClass = isLoyaltyDriven ? "bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fde047] bg-clip-text" : "";

                return (
                    <motion.span
                        className={`inline-block ${isLoyaltyDriven ? "transition-colors duration-300" : ""} ${gradientClass}`}
                        key={`${index}-${word}`}
                        style={{ 
                            opacity: wordOpacity,
                            color: isLoyaltyDriven 
                                ? useTransform(
                                    wordOpacity,
                                    [0.16, 1],
                                    ["rgb(28, 25, 23)", "transparent"]
                                  )
                                : "rgb(28, 25, 23)"
                        }}
                    >
                        {word}
                    </motion.span>
                );
            })}
        </motion.div>
    );

    return (
        <div ref={ref} className="flex flex-col gap-8 text-stone-900 max-w-[675px] ml-auto mr-auto mt-[2rem] mb-[4.8rem]">
            {renderParagraph(firstParagraphArray)}
            {renderParagraph(secondParagraphArray, firstParagraphArray.length)}
        </div>
    )
}