'use client';

import { useWindowSize } from "@uidotdev/usehooks";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function HowItWorks() {
    const size = useWindowSize();
    const screenWidth = size.width;
    const titleRef = useRef(null);
    const cardsRef = useRef(null);
    const isTitleInView = useInView(titleRef, { once: true, amount: 0.25 });
    const areCardsInView = useInView(cardsRef, { once: true, amount: screenWidth >= 750 ? 0.5 : 0.25 });

    const titleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.5,
            },
        }),
    };

    const cards = [
        {
            step: 1,
            title: "Give us a call.",
            description: "We'll discuss your goals, assess your business, and tailor our services to maximize your revenue."
        },
        {
            step: 2,
            title: "Customize your program.",
            description: "Together, we'll set up prepaid credits discounts, referral and corporate rates that work best for your business."
            // description: "Together, we'll set up prepaid credits discounts, referral rates, and gift cards that work best for your business."
        },
        {
            step: 3,
            title: "Get equipped.",
            description: "Receive free promotional materials. We'll train you on how to use them effectively."
            // description: "Receive free promotional materials and custom gift cards. We'll train you on how to use them effectively."
        },
        {
            step: 4,
            title: "Launch and grow.",
            description: "Your team starts offering these services to customers, they save money, and you get more repeat business. It's a win-win."
            // description: "Your team starts offering these services to customers, they save money, earn rewards, and you get more repeat customers. It's a win-win."
        }
    ];

    return (
        <div className="px-[1.6rem] mb-[4.8rem] max-w-[600px] mx-auto">
            <motion.div
                ref={titleRef}
                initial="hidden"
                animate={isTitleInView ? "visible" : "hidden"}
            >
                <motion.h1
                    variants={titleVariants}
                    className={`text-center text-stone-900 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-none tracking-tighter max-w-[20ch] mx-auto`}
                >
                    How it works
                </motion.h1>
                <motion.p
                    variants={titleVariants}
                    className="text-center text-stone-500 text-base sm:text-lg"
                >
                    It's simple. You offer a prepaid credit to your customers. They use it to make a purchase. <span className="inline-block bg-[#fde7c5] font-medium">You get paid.</span>
                </motion.p>
            </motion.div>

            <motion.div
                ref={cardsRef}
                initial="hidden"
                animate={areCardsInView ? "visible" : "hidden"}
                className="mt-12 flex flex-col gap-6"
            >
                {cards.map((card, index) => (
                    <motion.div
                        key={card.step}
                        variants={cardVariants}
                        custom={index}
                        className="flex items-start gap-3 sm:gap-4"
                    >
                        <div className="flex flex-col items-center gap-4 self-stretch">
                            <div className="flex-shrink-0">
                                <span className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center text-stone-900 font-medium text-xl">{card.step}</span>
                            </div>
                            {index < cards.length - 1 && <div className="flex-grow w-[2px] bg-[#e4e4e7] rounded-[12px]">&nbsp;</div>}
                        </div>

                        <div className="bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg">
                            <h3 className="text-lg font-medium text-[#f15a2b] mb-1">{card.title} <span className="text-stone-900 text-lg tracking-tight leading-tight font-medium">{card.description}</span></h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}