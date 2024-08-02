// "@/app/api/inngest/route.js"
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  helloWorld,
  fetchYelpReviews,
  processYelpReviews,
  processSingleYelpReview,
  fetchGoogleReviews,
  processGoogleReviews,
  processSingleGoogleReview,
} from "@/inngest/functions";

// Enable Edge Runtime
export const runtime = "edge";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    fetchYelpReviews,
    processYelpReviews,
    processSingleYelpReview,
    fetchGoogleReviews,
    processGoogleReviews,
    processSingleGoogleReview,
  ],
  streaming: "allow",
});
