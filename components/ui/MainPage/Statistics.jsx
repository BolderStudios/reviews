'use client';

import { useWindowSize } from "@uidotdev/usehooks";
import { DollarSign, Repeat, PieChart, Shield } from "lucide-react";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Statistics() {
    const size = useWindowSize();
    const screenWidth = size.width;
    const titleRef = useRef(null);
    const cardsRef = useRef(null);
    const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
    const areCardsInView = useInView(cardsRef, { once: true, amount: 0.5 });

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

    const stats = [
        {
            icon: <DollarSign size={24} />,
            title: "$5,000 Potential Cash Boost",
            description: "Use this influx to upgrade equipment, expand inventory, or improve your space without waiting for daily sales."
        },
        {
            icon: <Repeat size={24} />,
            title: "85% Customer Return Rate",
            description: "This high return rate creates a reliable customer base, reducing marketing costs and stabilizing your income."
        },
        {
            icon: <PieChart size={24} />,
            title: "38% Extra Spending",
            description: "Customers with prepaid credits tend to spend more. This additional revenue comes without extra marketing efforts."
        },
        {
            icon: <Shield size={24} />,
            title: "100% Risk-Free",
            description: "Unlike other loyalty programs, we don't take any fees. Instead, we charge a monthly fee only when you make a sale."
        }
    ];

    return (
        <div className="px-[1.6rem] mt-[1.5rem] mb-[4.8rem]">
            <motion.div
                ref={titleRef}
                initial="hidden"
                animate={isTitleInView ? "visible" : "hidden"}
            >
                <motion.h1
                    variants={titleVariants}
                    className={`text-center text-stone-900 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-none tracking-tighter max-w-[20ch] mx-auto`}
                >
                    More opportunities
                </motion.h1>
                <motion.p
                    variants={titleVariants}
                    className="text-center text-stone-500 text-base sm:text-lg max-w-[60ch] mx-auto"
                >
                    Gift cards to corporate events, family gatherings to referral programs - discounted credits make your services <span className="inline-block bg-[#fde7c5] font-medium">more attractive.</span>
                </motion.p>
            </motion.div>

            <motion.div
                ref={cardsRef}
                initial="hidden"
                animate={areCardsInView ? "visible" : "hidden"}
                className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-start gap-2"
                        variants={cardVariants}
                        custom={index}
                    >
                        <div className="text-[var(--button-primary)] mb-2">{stat.icon}</div>
                        <p className="text-xl font-medium tracking-tight leading-normal">{stat.title}</p>
                        <p className="text-sm text-stone-600 tracking-tight leading-normal">{stat.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}