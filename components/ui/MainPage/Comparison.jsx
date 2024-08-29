'use client';

import { useWindowSize } from "@uidotdev/usehooks";
import { X, Check } from "lucide-react"
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Comparison() {
  const size = useWindowSize();
  const screenWidth = size.width;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 }
    }
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

  return (
    <motion.div 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex flex-col items-center justify-center"
    >
      <div className="grid grid-cols-1 mx-auto gap-8 md:mx-0 md:grid-cols-2 px-[1.6rem] mt-[1.5rem] mb-[4.8rem] max-w-[1250px]">
        <ComparisonCard
          title="The traditional way"
          items={[
            "Unpredictable revenue from pay-as-you-go transactions",
            "Uncertain customer returns lead to inconsistent business",
            "Limited ability to invest due to lack of upfront capital",
            "High fees from prepaid credit software competitors reduce profits"
          ]}
          icon={X}
          iconBgColor="bg-red-100"
          iconColor="text-red-500"
          screenWidth={screenWidth}
          className="bg-white shadow-sm rounded-lg p-6 border border-blue-100"
          variants={cardVariants}
          index={0}
          isInView={isInView}
        />
        <ComparisonCard
          title="The new way"
          items={[
            "Guaranteed future visits ensure stable customer base",
            "Discounted prepaid credits increase customer loyalty",
            "No contracts or equipment needed - start earning revenue tomorrow",
            "Prepaid credits enable new ways to market your business like bundles and memberships"
          ]}
          icon={Check}
          iconBgColor="bg-green-100"
          iconColor="text-green-500"
          screenWidth={screenWidth}
          className="bg-white shadow-sm rounded-lg p-6 border border-blue-100"
          variants={cardVariants}
          index={1}
          isInView={isInView}
        />
      </div>
    </motion.div>
  )
}

function ComparisonCard({ title, items, icon: Icon, iconBgColor, iconColor, screenWidth, className = "", variants, index, isInView }) {
  return (
    <motion.div 
      className={`flex flex-col items-start justify-start h-full ${className}`}
      variants={variants}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <h2 className={`text-center mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-2xl" : "text-3xl"} lg:text-4xl xl:text-5xl leading-none tracking-tighter max-w-[20ch] mx-auto ${
        title === "The new way"
          ? "bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fde047] text-transparent bg-clip-text pb-[3px]"
          : "text-stone-900"
      }`}>
        {title}
      </h2>
      <div className="mt-2 flex flex-col gap-4 flex-grow">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className={`mt-1 inline-block rounded-full ${iconBgColor} p-[6px] flex items-center justify-center`}>
              <Icon size={14} strokeWidth={3} className={iconColor} />
            </span>
            <p className="text-gray-600 text-sm leading-normal">{item}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}