'use client';
import { useWindowSize } from "@uidotdev/usehooks";
import { X, Check } from "lucide-react"

export default function Comparison() {
  const size = useWindowSize();
  const screenWidth = size.width;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 mx-auto gap-8 md:mx-0 md:grid-cols-2 px-[1.6rem] mt-[1.5rem] mb-[4.8rem] max-w-[1250px]">
        <ComparisonCard
          title="The traditional way"
          items={[
            "Pay-as-you-go transactions create unpredictable revenue streams",
            "Customer return rates are uncertain, leading to inconsistent business and higher marketing costs",
            "Lack of upfront capital limits your ability to invest in business improvements",
            // "Cash flow issues can hinder day-to-day operations and growth plans",
            "High transaction fees from prepaid credit software competitors eat into profits and customer balances"
          ]}
          icon={X}
          iconBgColor="bg-red-100"
          iconColor="text-red-500"
          screenWidth={screenWidth}
          className="bg-white shadow-sm rounded-lg p-6 border border-blue-100"
        />
        <ComparisonCard
          title="The new way"
          items={[
            "Guaranteed future visits ensure a stable customer base and allow for better resource planning",
            "Discounts on prepaid credits increase customer loyalty and reduce the likelihood of them trying competitors",
            "No long-term contracts, equipment purchases, or waiting periods - give us a call today and start earning revenue tomorrow",
            "Upfront capital from prepaid credits allows for immediate business improvements and growth opportunities"
          ]}
          icon={Check}
          iconBgColor="bg-green-100"
          iconColor="text-green-500"
          screenWidth={screenWidth}
          className="bg-white shadow-sm rounded-lg p-6 border border-blue-100"
        />
      </div>
    </div>
  )
}

function ComparisonCard({ title, items, icon: Icon, iconBgColor, iconColor, screenWidth, className = "" }) {
  return (
    <div className={`flex flex-col items-start justify-start h-full ${className}`}>
      <h2 className={`text-center mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-2xl" : "text-3xl"} lg:text-4xl xl:text-5xl leading-none tracking-tighter max-w-[20ch] mx-auto ${
        title === "The new way"
          ? "bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fde047] text-transparent bg-clip-text"
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
    </div>
  );
}