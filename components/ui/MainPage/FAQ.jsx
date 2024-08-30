'use client';

import { useWindowSize } from "@uidotdev/usehooks";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
    const size = useWindowSize();
    const screenWidth = size.width;

    return (
        <div className="px-[1.6rem] mb-[3.8rem]">
            <h1 className={`text-center text-stone-900 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-tight tracking-tighter mx-auto`}>
                Frequently Asked Questions
            </h1>

            <div className="max-w-[600px] sm:max-w-[700px] mt-6 mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How does the prepaid credit system work?</AccordionTrigger>
                        <AccordionContent>
                            Customers purchase credits in advance at a discounted rate. These credits can be redeemed for your products or services over time, providing you with upfront revenue and ensuring repeat business.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                        <AccordionTrigger>What makes you better than alternatives or competitors?</AccordionTrigger>
                        <AccordionContent>
                            We focus on sustainable growth for your business. Unlike platforms that push steep discounts, we offer flexible credit systems with lower fees and customer retention tools that keep clients coming back. It's all about building long-term relationships, not just one-time deals.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-10">
                        <AccordionTrigger>How will customers redeem their credits?</AccordionTrigger>
                        <AccordionContent>
                            Customers can redeem their credits easily through our user-friendly website. The process is seamless, making it easy for them to come back and spend their credits, which means more revenue for you.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>How do I set prices for prepaid credits?</AccordionTrigger>
                        <AccordionContent>
                            You can offer tiered packages with increasing discounts for larger credit purchases. For example, $125 worth of credits for $100, or $500 worth for $425. This incentivizes larger upfront purchases.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>What if a customer wants a refund?</AccordionTrigger>
                        <AccordionContent>
                            You can set your own refund policy, but we recommend offering partial refunds or credit transfers to maintain customer satisfaction while protecting your cash flow.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>How much do you charge?</AccordionTrigger>
                        <AccordionContent>
                            We charge nothing upfront. Our fee is a straightforward 7.9% plus 30¢ to $1 per transaction, depending on the amount. There are no hidden fees, and no long-term contracts. It's a pay-as-you-go model that keeps things simple.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger>How soon can I start?</AccordionTrigger>
                        <AccordionContent>
                            You can get started within just a few days. We have a quick setup process, and our team will provide training to ensure you're up and running, offering prepaid credits to your customers in no time.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-9">
                        <AccordionTrigger>Is it similar to Groupon?</AccordionTrigger>
                        <AccordionContent>
                            While we also attract customers with great offers, our approach is different. We emphasize long-term retention through prepaid credits, which maintain the value of your services and ensure repeat visits. It's about building loyalty rather than one-time discounts.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is it suitable for all types of local businesses?</AccordionTrigger>
                        <AccordionContent>
                            While many local businesses can benefit from this model, it's particularly well-suited for services with repeat customers, such as beauty industries, cafes, restaurants, bars, coffee shops, and more.
                        </AccordionContent>
                    </AccordionItem>


                    <AccordionItem value="item-11">
                        <AccordionTrigger>What if I don't want to offer steep discounts?</AccordionTrigger>
                        <AccordionContent>
                            No problem at all. You set modest discounts that strike the right balance between attracting customers and maintaining profitability. The idea is to incentivize prepaid purchases without undermining your pricing.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-12">
                        <AccordionTrigger>How do I know customers will actually come back?</AccordionTrigger>
                        <AccordionContent>
                            Prepaid credits create a strong financial incentive for customers to return. Our data shows that businesses using our platform see significantly higher repeat visit rates. Essentially, once customers have prepaid credits, they're more likely to come back to use them.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-13">
                        <AccordionTrigger>Won't this devalue my products or services?</AccordionTrigger>
                        <AccordionContent>
                            Unlike deep discount platforms, our system is designed to preserve the value of your services. Customers are paying upfront for future visits, often at a slight discount, which keeps your pricing integrity intact.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-14">
                        <AccordionTrigger>How complicated is it to set up and manage?</AccordionTrigger>
                        <AccordionContent>
                            Our system is incredibly user-friendly. We provide full training, and our support team is always available to help with any questions. Managing the platform is straightforward, so you can focus on running your business.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-15">
                        <AccordionTrigger>What if I want to stop using the system?</AccordionTrigger>
                        <AccordionContent>
                            You're free to discontinue anytime. If you decide to stop, we'll help manage any outstanding credits to ensure a smooth transition for both you and your customers.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-19">
                        <AccordionTrigger>How do I train my staff to use this system?</AccordionTrigger>
                        <AccordionContent>
                            We provide comprehensive training materials and sessions tailored to your business. Most staff members pick it up quickly, and our team is here to support you every step of the way.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-21">
                        <AccordionTrigger>How does this affect my tax reporting?</AccordionTrigger>
                        <AccordionContent>
                            We provide detailed transaction reports that make accounting easier. While we recommend consulting with your tax professional for specific advice, our system is designed to simplify the process.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-22">
                        <AccordionTrigger>Can I limit the number of prepaid credits sold?</AccordionTrigger>
                        <AccordionContent>
                            Absolutely. You have full control over the number of credits sold, allowing you to manage inventory and service capacity effectively.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-23">
                        <AccordionTrigger>What happens if my business closes or changes ownership?</AccordionTrigger>
                        <AccordionContent>
                            We have protocols in place to handle such situations smoothly. Whether you're closing or transferring ownership, we'll help manage any outstanding credits to ensure customer satisfaction.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-24">
                        <AccordionTrigger>How do you prevent fraud or misuse of credits?</AccordionTrigger>
                        <AccordionContent>
                            Our system includes robust security features that prevent unauthorized use or duplication of credits. We've designed it to be both secure and user-friendly, so you can focus on running your business.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}