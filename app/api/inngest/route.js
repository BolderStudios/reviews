// "@/app/api/inngest/route.js"
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  helloWorld,
  fetchYelpReviews,
  processYelpReviews,
} from "@/inngest/functions";

// Enable Edge Runtime
export const runtime = "edge";

// Create an API that serves your functions with streaming enabled
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, fetchYelpReviews, processYelpReviews],
  streaming: "allow",
});
