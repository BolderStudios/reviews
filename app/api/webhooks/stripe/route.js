import { NextResponse } from "next/server";
import { headers } from "next/headers";
import supabase from "@/utils/supabaseClient";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  console.log("Received request body:", body);

  const signature = headers().get("stripe-signature");
  console.log("Received Stripe signature:", signature);

  let data;
  let eventType;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("Stripe event verified:", event);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;
  console.log("Event data:", data);
  console.log("Event type:", eventType);

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        console.log("Handling checkout.session.completed event");

        const session = await stripe.checkout.sessions.retrieve(
          data.object.id,
          {
            expand: ["line_items"],
          }
        );
        console.log("Retrieved Stripe session:", session);

        const customerId = session?.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = customer.email;
        const priceId = session?.line_items?.data[0]?.price.id;
        const clerkUserId = session?.metadata?.clerkUserId;

        console.log("Customer ID: ", customerId);
        console.log("Customer details: ", customer);
        console.log("Price ID: ", priceId);
        console.log("Clerk User ID: ", clerkUserId);

        if (customer.email) {
          // Find a single user by email
          const { data, error } = await supabase
            .from("users")
            .select()
            .eq("clerk_email", customer.email);

          const userData = data[0];

          console.log("User data:", userData);

          //   Create a new entry in subscription table
          const { data: subscription, error: subscriptionError } =
            await supabase.from("subscriptions").insert([
              {
                user_id: userData.id,
                stripe_customer_id: customerId,
                stripe_price_id: priceId,
                clerk_user_id: clerkUserId,
                subscription_status: "active",
              },
            ]);

          if (subscriptionError) {
            console.error(
              "Error add a new subscription in Supabase:",
              subscriptionError.message
            );
          } else {
            console.log("Added a new subscription:", subscription);
          }
        } else {
          console.error("No user found with customer email");
          throw new Error("No user found");
        }

        // Extra: >>>>> send email, redirect to dashboard <<<<

        break;
      }

      case "customer.subscription.deleted": {
        // ❌ Revoke access to the product
        // Sent when a customer’s subscription ends.
        console.log("Handling customer.subscription.deleted event");

        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );
        console.log("Retrieved Stripe subscription:", subscription);

        const { data: user, error: userError } = await supabase
          .from("users")
          .update({
            hasAccess: false,
          })
          .eq("customer_id", subscription.customer);

        if (userError) {
          console.error("Error updating user in Supabase:", userError.message);
        } else {
          console.log("Updated user in Supabase:", user);
        }

        break;
      }

      case "customer.subscription.updated": {
        // ❌ Revoke access to the product
        // Sent when a customer’s subscription ends.
        console.log("Handling customer.subscription.updated event");

        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );
        console.log("Retrieved Stripe subscription:", subscription);

        const { data: user, error: userError } = await supabase
          .from("users")
          .update({
            hasAccess: false,
          })
          .eq("customer_id", subscription.customer);

        if (userError) {
          console.error("Error updating user in Supabase:", userError.message);
        } else {
          console.log("Updated user in Supabase:", user);
        }
      }

      default:
        console.log("Unhandled event type:", eventType);
    }
  } catch (e) {
    console.error("Stripe error: " + e.message + " | EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
