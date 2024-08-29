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
        <div className="px-[1.6rem] mb-[4.8rem]">
            <h1 className={`text-center text-stone-900 mb-4 sm:mb-6 ${screenWidth <= 300 ? "text-3xl" : "text-4xl"} lg:text-5xl xl:text-6xl leading-tight tracking-tighter mx-auto`}>
                Frequently Asked Questions
            </h1>

            <div className="max-w-[600px] mt-6 mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How does the prepaid credit system work?</AccordionTrigger>
                        <AccordionContent>
                            Customers purchase credits in advance at a discounted rate. These credits can be redeemed for your products or services over time, providing you with upfront cash and ensuring repeat business.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is it suitable for all types of local businesses?</AccordionTrigger>
                        <AccordionContent>
                            While many local businesses can benefit from this model, it's particularly well-suited for services with repeat customers, such as cafes, salons, gyms, and retail shops.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>How do I set prices for prepaid credits?</AccordionTrigger>
                        <AccordionContent>
                            You can offer tiered packages with increasing discounts for larger credit purchases. For example, $100 worth of credits for $90, or $500 worth for $425. This incentivizes larger upfront purchases.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>What if a customer wants a refund?</AccordionTrigger>
                        <AccordionContent>
                            You can set your own refund policy, but we recommend offering partial refunds or credit transfers to maintain customer satisfaction while protecting your cash flow.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}