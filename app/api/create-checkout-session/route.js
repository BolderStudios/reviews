// app/api/create-checkout-session.js/route.js

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(req) {
  try {
    const { priceId, email } = await req.json();
    const { userId } = getAuth(req);

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
        trial_period_days: 14,
      },
      mode: "subscription",
      success_url: `${siteUrl + process.env.SUCCESS_URL}`,
      cancel_url: `${siteUrl + process.env.CANCEL_URL}`,
      metadata: {
        clerkUserId: userId,
      },
    });

    console.log("Checkout session created:", session.id);

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
