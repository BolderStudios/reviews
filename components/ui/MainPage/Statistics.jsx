'use client';
import { useWindowSize } from "@uidotdev/usehooks";
import { DollarSign, Repeat, PieChart, Shield } from "lucide-react";

export default function Statistics() {
    const size = useWindowSize();
    const screenWidth = size.width;

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
        <div className="px-4 px-[1.6rem] mt-[1.5rem] mb-[4.8rem]">
            <h1 className={`text-center text-stone-900 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-none tracking-tighter max-w-[20ch] mx-auto`}>
                More opportunities
            </h1>
            <p className="text-center text-stone-500 text-base sm:text-lg max-w-[60ch] mx-auto">
                Gift cards to corporate events, family gatherings to referral programs - discounted credits make your services <span className="inline-block bg-[#fde7c5] font-medium">more attractive.</span>
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-start gap-2">
                        <div className="text-[var(--button-primary)] mb-2">{stat.icon}</div>
                        <p className="text-xl font-medium tracking-tight leading-normal">{stat.title}</p>
                        <p className="text-sm text-stone-600 tracking-tight leading-normal">{stat.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}