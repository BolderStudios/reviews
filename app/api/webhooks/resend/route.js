import { NextResponse } from "next/server";
import { Webhook } from "svix";

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

    // Handle different event types
    switch (event.type) {
      case "email.sent":
        console.log("Email sent event:", event);
        // Handle email sent event
        break;
      case "email.delivered":
        console.log("Email delivered event:", event);
        // Handle email delivered event
        break;
      case "email.bounced":
        console.log("Email bounced event:", event);
        // Handle email bounced event
        break;
      case "email.opened":
        console.log("Email opened event:", event);
        // Handle email opened event
        break;
      case "email.clicked":
        console.log("Email clicked event:", event);
        // Handle email clicked event
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

// Add OPTIONS method to handle preflight requests
export async function OPTIONS(req) {
  return NextResponse.json({}, { status: 200 });
}
