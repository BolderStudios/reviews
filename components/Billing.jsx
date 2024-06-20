// components/Billing.jsx

"use client";

import { Button } from "./ui/button";
import ButtonCustomerPortal from "./ui/ButtonCustomerPortal";
import { loadStripe } from "@stripe/stripe-js";

const monthlyPlans = [
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_8wM4hp1ZC58l9u86oB"
        : "https://buy.stripe.com/test_8wM4hp1ZC58l9u86oB",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PTa23CUoNGpO7cRMVv0L1YO"
        : "price_1PTa23CUoNGpO7cRMVv0L1YO",
    price: 12,
    duration: "/month",
    name: "Hobby",
    description: "All the basics for starting a new business!",
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_8wMeW30Vy1W9ayccMY"
        : "https://buy.stripe.com/test_8wMeW30Vy1W9ayccMY",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PTa36CUoNGpO7cRoMZFsS6t"
        : "price_1PTa36CUoNGpO7cRoMZFsS6t",
    price: 24,
    duration: "/month",
    name: "Freelancer",
    description: "All the basics for starting a new business!",
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_aEU019dIkgR335K4gu"
        : "https://buy.stripe.com/test_aEU019dIkgR335K4gu",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PTa3ICUoNGpO7cRcnGxXc3Q"
        : "price_1PTa3ICUoNGpO7cRcnGxXc3Q",
    price: 32,
    duration: "/month",
    name: "Startup",
    description: "All the basics for starting a new business!",
  },
];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Billing = ({ emailAddress, currentPriceId }) => {
  console.log("currentPriceId", currentPriceId);

  const handleSubscribe = async (priceID) => {
    console.log("priceId inside handleSubscribe", priceID);
    console.log("emailAddress inside handleSubscribe", emailAddress);

    try {
      const response = await fetch(
        "http://localhost:3000/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: priceID,
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
    <div className="px-8 py-4">
      <div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-2xl">Billing</p>
        </div>
      </div>

      <div className="grid grid-cols-3 py-4 gap-8">
        {currentPriceId === null ||
        currentPriceId === "" ||
        currentPriceId === undefined ||
        currentPriceId === "null"
          ? monthlyPlans.map((plan, index) => (
              <div
                key={index}
                className="p-6 bg-stone-50 flex flex-col gap-6 border rounded"
              >
                <div>
                  <p className="font-medium text-xl">{plan.name}</p>
                  <p className="leading-normal mt-1">{plan.description}</p>
                </div>

                <div>
                  <span className="font-bold text-4xl">${plan.price}</span>
                  <span className="font-medium">{plan.duration}</span>
                </div>

                <div>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan.priceId)}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            ))
          : monthlyPlans
              .filter((plan) => plan.priceId === currentPriceId)
              .map((plan, index) => (
                <div
                  key={index}
                  className="p-6 bg-stone-50 flex flex-col gap-6 border rounded"
                >
                  <div>
                    <p className="font-medium text-xl">{plan.name}</p>
                    <p className="leading-normal mt-1">{plan.description}</p>
                  </div>

                  <div>
                    <span className="font-bold text-4xl">${plan.price}</span>
                    <span className="font-medium">{plan.duration}</span>
                  </div>

                  <div>
                    <ButtonCustomerPortal emailAddress={emailAddress} />
                  </div>
                </div>
              ))}
      </div>
    </div>
  );
};

export default Billing;
