import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId, email } = await req.json();
    const { userId } = getAuth(req);

    console.log("User ID:", userId);
    console.log("Price ID:", priceId);

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.SUCCESS_URL}`,
      metadata: {
        // Clerk user ID is stored in the metadata
        clerkUserId: userId,
      },
    });

    // console.log("Checkout session created:", session.id);

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
