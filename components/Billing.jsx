"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

// Stripe Plans >> fill in your own priceId & link
export const plans = [
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_9AQg075bO9oB6hWcMU"
        : "https://buy.stripe.com/test_9AQg075bO9oB6hWcMU", // replace with a live link
    priceId:
      process.env.NODE_ENV === "development"
        ? "prod_QJqox2zsKiFE0h"
        : "prod_QJqox2zsKiFE0h", // replace with a live link
    price: 35,
    duration: "/month",
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_14kdRZdIk30d5dS9AH"
        : "https://buy.stripe.com/test_9AQg075bO9oB6hWcMU", // replace with a live link
    priceId:
      process.env.NODE_ENV === "development"
        ? "prod_QJqpqmw7LKs0xp"
        : "prod_QJqpqmw7LKs0xp", // replace with a live link

    price: 350,
    duration: "/year",
  },
];

const Billing = ({ emailAddress }) => {
  const [plan, setPlan] = useState(plans[0]);
  // console.log(emailAddress);

  return (
    <section id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          <div className=" w-full max-w-lg">
            <div className="flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-xl">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="billing"
                    className="radio"
                    checked={plan.price === plans[0].price}
                    onChange={() => setPlan(plans[0])}
                  />
                  <span>Pay monthly</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="billing"
                    className="radio"
                    checked={plan.price === plans[1].price}
                    onChange={() => setPlan(plans[1])}
                  />
                  <span>Pay yearly (60% OFF 💰)</span>
                </div>
              </div>

              <div className="bg-yellow-100">
                <div className="flex gap-2">
                  <p className={`text-5xl tracking-tight font-extrabold`}>
                    ${plan.price}
                  </p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-sm tracking-wide text-base-content/80 uppercase font-semibold">
                      {plan.duration}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                  {[
                    {
                      name: "NextJS boilerplate",
                    },
                    { name: "User oauth" },
                    { name: "Database" },
                    { name: "Emails" },
                    { name: "1 year of updates" },
                    { name: "24/7 support" },
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-[18px] h-[18px] opacity-80 shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <span>{feature.name} </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <Button asChild>
                    <Link href={plan.link + "?prefilled_email=" + emailAddress}>
                      Subscribe
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Billing;
