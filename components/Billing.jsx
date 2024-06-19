"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import ButtonCustomerPortal from "./ui/ButtonCustomerPortal";
import { loadStripe } from "@stripe/stripe-js";

// Stripe Plans >> fill in your own priceId & link
export const plans = [
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_9AQg075bO9oB6hWcMU"
        : "https://buy.stripe.com/test_9AQg075bO9oB6hWcMU", // replace with a live link
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PTD7FCUoNGpO7cRyEtsocHP"
        : "price_1PTD7FCUoNGpO7cRyEtsocHP", // replace with a live link
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
        ? "price_1PTFNGCUoNGpO7cR6VahvsYH"
        : "price_1PTFNGCUoNGpO7cR6VahvsYHP", // replace with a live link

    price: 350,
    duration: "/year",
  },
];

// Load your Stripe publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Billing = ({ emailAddress }) => {
  const [plan, setPlan] = useState(plans[0]);

  const handleSubscribe = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: plan.priceId,
            email: emailAddress,
          }),
        }
      );

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

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
                  <Button onClick={handleSubscribe}>Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="p-4 flex justify-end max-w-7xl mx-auto">
        <ButtonCustomerPortal emailAddress={emailAddress} />
      </header>
    </section>
  );
};

export default Billing;
