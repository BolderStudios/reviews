import { NextResponse } from "next/server";
import { updateIsFetching } from "@/app/actions"; // Adjust the import path as necessary

export async function POST(request) {
  try {
    const formData = await request.json();
    await updateIsFetching(true);

    const workerUrl = "https://fetch-yelp-reviews.kuznetsov-dg495.workers.dev/";
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-cache",
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    await updateIsFetching(false);
  }
}
