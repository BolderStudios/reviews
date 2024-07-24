import { NextResponse } from "next/server";
import { Webhook } from "svix";
import supabase from "@/utils/supabaseClient";

const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

export async function POST(req) {
  console.log("Received webhook request");
  try {
    const payload = await req.text();
    console.log("Payload:", payload);
    const headers = {
      "svix-id": req.headers.get("svix-id"),
      "svix-timestamp": req.headers.get("svix-timestamp"),
      "svix-signature": req.headers.get("svix-signature"),
    };
    console.log("Headers:", headers);

    if (!webhookSecret) {
      console.error("RESEND_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    // Verify the webhook
    const wh = new Webhook(webhookSecret);
    const event = wh.verify(payload, headers);
    console.log("Verified webhook event:", event);

    const recipient_email = event.data.to[0];

    // Handle different event types
    switch (event.type) {
      case "email.sent":
      case "email.delivered":
      case "email.bounced":
      case "email.opened":
      case "email.clicked":
      case "email.complained":
      case "email.delivery_delayed":
        console.log(`${event.type} event:`, event);
        await updateRequestRow(recipient_email, event.type.split(".")[1]);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Invalid signature or payload" },
      { status: 400 }
    );
  }
}

export async function OPTIONS(req) {
  return NextResponse.json({}, { status: 200 });
}

const updateRequestRow = async (recipient_email, action) => {
  const updateData = { [action]: true };

  const { data: updatedRequest, error: errorUpdatingRequest } = await supabase
    .from("requests")
    .update(updateData)
    .eq("customer_email_address", recipient_email);

  if (errorUpdatingRequest) {
    console.error(
      `Error updating request for ${action}:`,
      errorUpdatingRequest
    );
    throw new Error(`Error updating request for ${action}`);
  }

  console.log(`Successfully updated request for ${action}:`, updatedRequest);
};
