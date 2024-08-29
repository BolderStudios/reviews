'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/Buttons/button"
import { Calendar } from "lucide-react"
import { useWindowSize } from "@uidotdev/usehooks";
import AnimatedLogoCloud from "@/components/ui/MainPage/AnimatedLogoCloud"
import { motion, AnimatePresence } from "framer-motion";
import TextScroll from "@/components/ui/MainPage/TextScroll";
import Statistics from "@/components/ui/MainPage/Statistics";
import HowItWorks from "@/components/ui/MainPage/HowItWorks";
import Comparison from "@/components/ui/MainPage/Comparison";
import Pricing from "@/components/ui/MainPage/Pricing";
import FAQ from "@/components/ui/MainPage/FAQ";
import Footer from "@/components/ui/MainPage/Footer";

export default function MainPage() {
    const size = useWindowSize();
    const screenWidth = size.width;

    const [isLoaded, setIsLoaded] = useState(false);
    const [viewportHeight, setViewportHeight] = useState('100vh');
    const customEasing = [0.215, 0.61, 0.355, 1];

    useEffect(() => {
        setIsLoaded(true);

        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            setViewportHeight(`${window.innerHeight}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);

        return () => {
            window.removeEventListener('resize', setVH);
            window.removeEventListener('orientationchange', setVH);
        };
    }, []);

    return (
        <div className="flex flex-col">
            <style jsx global>{`
                ::selection {
                    background-color: #5fafe5;
                    color: white;
                }
                .use-viewport-height {
                    height: ${viewportHeight};
                    height: calc(var(--vh, 1vh) * 100);
                }
            `}</style>

            {/* Hero section */}
            <div className="w-full relative use-viewport-height overflow-hidden">
                <AnimatePresence>
                    {isLoaded && (
                        <>
                            <motion.img
                                src="/hero/hero-image-40.png"
                                alt="hero-image"
                                className="absolute left-0 top-0 w-full h-full object-cover object-[-200px] sm:object-cover sm:object-[0px]"
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 2, ease: customEasing }}
                            />
                            <div
                                className="absolute inset-0 bg-black bg-opacity-35"
                            />

                            <motion.div
                                className="absolute inset-0 flex flex-col px-4 sm:px-6 lg:px-8 pt-4 pb-8"
                            >
                                <motion.div
                                    className="flex items-center justify-between w-full z-10"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6, ease: customEasing }}
                                >
                                    <img src="/logoWhite.png" alt="logo" className="w-[90px] h-auto sm:w-20 md:w-24 lg:w-28 object-contain" />
                                    <Button variant="customOutline" className="h-[30px] px-2 border border-stone-300">
                                        Get started
                                    </Button>
                                </motion.div>

                                <div className="flex-grow flex flex-col justify-center items-center">
                                    <motion.div
                                        className='flex flex-col justify-center items-center'
                                    >
                                        <motion.div initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1.75, ease: customEasing }}
                                            className="flex flex-col items-center text-center max-w-4xl"
                                        >
                                            <h1 className={`text-stone-50 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-tight tracking-tighter max-w-[20ch] mx-auto xs:line-clamp-2`}>
                                                Get up to $5,000 in extra revenue this month
                                            </h1>
                                        </motion.div>

                                        <motion.p initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1.9, ease: customEasing }} className={`text-stone-300 font-medium ${screenWidth <= 300 ? "text-sm" : "text-base"} md:text-lg pl-[12px] pr-[12px] md:px-24 lg:px-32 text-center leading-normal max-w-xs md:max-w-xl lg:max-w-2xl mx-auto xs:line-clamp-2`}>
                                            Secure loyal customers and increase revenue by offering prepaid credits
                                        </motion.p>

                                        <motion.div initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 2, ease: customEasing }} className="flex flex-col md:flex-row gap-2 md:gap-4 mt-6 md:mt-8">
                                            <Button variant="primary" className="flex items-center justify-center bg-[#07a15e] h-[40px] px-4 md:h-[48px] md:px-6">
                                                <Calendar className='mr-2' size={16} />
                                                <span>Talk to a human</span>
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                </div>

                                <motion.div
                                    className='mt-auto flex flex-col items-center justify-center'
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 1, ease: customEasing }}
                                >
                                    <p className='text-stone-300 font-medium text-xs text-center uppercase'>trusted by the most popular brands</p>
                                    <AnimatedLogoCloud />
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            <div className='bg-gradient-to-b from-[#fff6e2] via-[#eef3fe] to-[#eef3fe]'>
                <TextScroll />
                <Comparison />
                <Statistics />
            </div>

            <div className='bg-gradient-to-b from-[#eef3fe] to-[#E3FDF5]'>
                <HowItWorks />
                <Pricing />
                <FAQ />
                <Footer />
            </div>
        </div>
    )
}