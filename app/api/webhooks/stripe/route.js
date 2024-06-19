import { NextResponse } from "next/server";
import { headers } from "next/headers";
import supabase from "@/utils/supabaseClient";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let data;
  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const session = await stripe.checkout.sessions.retrieve(
          data.object.id,
          {
            expand: ["line_items"],
          }
        );
        const customerId = session?.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const priceId = session?.line_items?.data[0]?.price.id;

        if (customer.email) {
          // Find user by email in supabase in users table
          // Update is_active to true
          const { data: selectedUser, error: userSelectError } = await supabase
            .from("users")
            .update({
              is_active: true,
              customer_id: customerId,
              price_id: priceId,
            })
            .eq("clerk_email", customer.email);
        } else {
          console.error("No user found");
          throw new Error("No user found");
        }

        // Extra: >>>>> send email, redirect to dashboard <<<<

        break;
      }

      case "customer.subscription.deleted": {
        // ❌ Revoke access to the product
        // Sent when a customer’s subscription ends.
        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );

        const { data: user, error: userError } = await supabase
          .from("users")
          .update({
            is_active: false,
          })
          .eq("customer_id", subscription.customer);

        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: " + e.message + " | EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
