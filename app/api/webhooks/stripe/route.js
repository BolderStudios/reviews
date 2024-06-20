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
        const subscriptionId = session?.subscription;
        
        // Retrieve the subscription to get the start_date and other details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const planAmount = subscription?.plan?.amount;
        const startDate = subscription?.start_date;
        const currentPeriodStart = subscription?.current_period_start;
        const currentPeriodEnd = subscription?.current_period_end;

        console.log("Checkout session: ", session);
        console.log("Customer ID: ", customerId);
        console.log("Customer details: ", customer);
        console.log("Price ID: ", priceId);
        console.log("Clerk User ID: ", clerkUserId);
        console.log("Subscription details: ", subscription);

        if (customerEmail) {
          const { data, error } = await supabase
            .from("users")
            .select()
            .eq("clerk_email", customerEmail);

          const userData = data[0];
          console.log("User data:", userData);

          const { data: subscriptionData, error: subscriptionError } =
            await supabase.from("subscriptions").insert([
              {
                user_id: userData.id,
                stripe_customer_id: customerId,
                stripe_price_id: priceId,
                stripe_subscription_id: subscriptionId,
                clerk_user_id: clerkUserId,
                subscription_status: "active",
                start_date: startDate,
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
                plan_amount: planAmount,
                updated_at: new Date().toISOString(),
              },
            ]);

          if (subscriptionError) {
            console.error(
              "Error adding a new subscription in Supabase:",
              subscriptionError.message
            );
          } else {
            console.log("Added a new subscription:", subscriptionData);
          }
        } else {
          console.error("No user found with customer email");
          throw new Error("No user found");
        }

        break;
      }

      case "customer.subscription.deleted": {
        console.log("Handling customer.subscription.deleted event");

        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );
        console.log("Retrieved Stripe subscription:", subscription);

        const {
          data: updatedSubscriptionData,
          error: updatedSubscriptionError,
        } = await supabase
          .from("subscriptions")
          .update({
            subscription_status: "deleted",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (updatedSubscriptionError) {
          console.error(
            "Error updating subscription in Supabase:",
            updatedSubscriptionError.message
          );
        } else {
          console.log(
            "Updated subscription in Supabase:",
            updatedSubscriptionData
          );
        }

        break;
      }

      case "customer.subscription.updated": {
        console.log("Handling customer.subscription.updated event");

        const subscription = await stripe.subscriptions.retrieve(
          data.object.id,
          { expand: ["plan.product"] }
        );
        console.log("Retrieved Stripe subscription:", subscription);

        const planAmount = subscription.plan.amount;

        const {
          data: updatedSubscriptionData,
          error: updatedSubscriptionError,
        } = await supabase
          .from("subscriptions")
          .update({
            stripe_price_id: subscription.plan.id,
            subscription_status: subscription.cancel_at_period_end
              ? "cancelled"
              : subscription.status,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at,
            cancel_at: subscription.cancel_at,
            start_date: subscription.start_date,
            plan_amount: planAmount,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (updatedSubscriptionError) {
          console.error(
            "Error updating subscription in Supabase:",
            updatedSubscriptionError.message
          );
        } else {
          console.log(
            "Updated subscription in Supabase:",
            updatedSubscriptionData
          );
        }

        break;
      }

      default:
        console.log("Unhandled event type:", eventType);
    }
  } catch (e) {
    console.error("Stripe error: " + e.message + " | EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
