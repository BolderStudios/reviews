// "@/app/api/fetch-yelp/route.js"

import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(request) {
  try {
    const { yelpBusinessLink, locationId, clerkId } = await request.json();

    await inngest.send({
      name: "fetch/yelp.reviews",
      data: { yelpBusinessLink, locationId, clerkId },
    });

    return NextResponse.json(
      { message: "Yelp review fetch initiated" },
      { status: 202 }
    );
  } catch (error) {
    console.error(`Error initiating Yelp fetch: ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
