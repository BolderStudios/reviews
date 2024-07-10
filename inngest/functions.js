// "@/inngest/functions.js"

import { inngest } from "./client";
import { serve } from "inngest/next";
import {
  updateIsFetching,
  updateFetchErrorMessage,
  getLocationInfo,
  generateResponse,
  generateInsights,
  updateSelectedLocation,
  storeReview,
  deleteReviewsForLocation,
} from "@/utils/actionsHelpers";
import axios from "axios";
import pLimit from "p-limit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  }
);

export const processSingleYelpReview = inngest.createFunction(
  { id: "process-single-yelp-review" },
  { event: "process/single.yelp.review" },
  async ({ event, step }) => {
    const { review, locationId, clerkId, index, total } = event.data;

    console.log(`Processing review ${index + 1}/${total}: ${review.review_id}`);

    try {
      const insights = await generateInsights(review.review_text);

      if (
        !insights ||
        !insights.content ||
        !Array.isArray(insights.content) ||
        insights.content.length === 0
      ) {
        throw new Error("Invalid insights structure");
      }

      const parsedInsights = JSON.parse(insights.content[0].text);

      await storeReview(review, parsedInsights, locationId, clerkId);

      console.log(`Successfully processed review ${review.review_id}`);
      return { success: true, reviewId: review.review_id };
    } catch (error) {
      console.error(`Error processing review ${review.review_id}:`, error);
      return {
        success: false,
        reviewId: review.review_id,
        error: error.message,
      };
    }
  }
);

export const processYelpReviews = inngest.createFunction(
  {
    id: "process-yelp-reviews",
    retries: 0,
  },
  { event: "process/yelp.reviews" },
  async ({ event, step }) => {
    console.log("Starting processYelpReviews function");
    const { reviews, locationId, clerkId } = event.data;
    const deleteResult = await deleteReviewsForLocation(locationId);
    console.log(`Delete result: ${JSON.stringify(deleteResult)}`);
    const uniqueReviews = Array.from(
      new Map(reviews.map((review) => [review.review_id, review])).values()
    );
    console.log(`Unique review count: ${uniqueReviews.length}`);

    const limit = pLimit(10);
    const baseDelay = 10000;

    const sendJob = async (review, index) => {
      await new Promise((resolve) => setTimeout(resolve, baseDelay));
      return inngest.send({
        name: "process/single.yelp.review",
        data: {
          review,
          locationId,
          clerkId,
          index,
          total: uniqueReviews.length,
        },
      });
    };

    try {
      // Create a job for each review with concurrency limit
      const jobPromises = uniqueReviews.map((review, index) =>
        limit(() => sendJob(review, index))
      );

      await Promise.all(jobPromises);

      console.log(
        `Created ${uniqueReviews.length} individual review processing jobs`
      );
      return { success: true, reviewCount: uniqueReviews.length };
    } catch (error) {
      console.error(`Error in processYelpReviews function: ${error.message}`);
      await updateFetchErrorMessage(error.message, clerkId);
      return { success: false, error: error.message };
    }
  }
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const processYelpReviewsLogic = async (reviews, locationId, clerkId) => {
//   const processedReviews = new Set();
//   const failedReviews = [];
//   const limit = pLimit(25);
//   const delay = 1000;

//   console.log(
//     `Starting to process ${
//       reviews.length
//     } reviews at ${new Date().toISOString()}`
//   );

//   try {
//     const { data: locationData } = await getLocationInfo(locationId);
//     console.log("Location Data fetched —> ", locationData);

//     const deleteResult = await deleteReviewsForLocation(locationId);
//     console.log(`Delete result: ${JSON.stringify(deleteResult)}`);

//     for (let index = 0; index < reviews.length; index++) {
//       const review = reviews[index];
//       console.log(
//         `Processing review ${index + 1}/${reviews.length}: ${review.review_id}`
//       );

//       try {
//         await limit(async () => {
//           await sleep(delay);

//           console.log(`Generating insights for review ${review.review_id}`);
//           const insights = await generateInsights(review.review_text);
//           console.log(`Insights generated for review ${review.review_id}`);

//           if (
//             !insights ||
//             !insights.content ||
//             !Array.isArray(insights.content) ||
//             insights.content.length === 0
//           ) {
//             throw new Error("Invalid insights structure");
//           }

//           const parsedInsights = JSON.parse(insights.content[0].text);

//           console.log(`Storing review ${review.review_id}`);
//           await storeReview(review, parsedInsights, locationId, clerkId);
//           console.log(`Review ${review.review_id} stored successfully`);

//           processedReviews.add(review.review_id);
//           console.log(`Successfully processed review ${review.review_id}`);
//         });
//       } catch (error) {
//         console.error(`Error processing review ${review.review_id}:`, error);
//         failedReviews.push({
//           reviewId: review.review_id,
//           error: error.message,
//           review: review,
//         });
//       }

//       // Log progress every 10 reviews
//       if ((index + 1) % 10 === 0) {
//         console.log(
//           `Progress: ${index + 1}/${reviews.length} reviews processed`
//         );
//       }
//     }

//     console.log(`Finished processing reviews at ${new Date().toISOString()}`);
//     console.log(
//       `Processed ${processedReviews.size} reviews successfully, ${failedReviews.length} failed`
//     );

//     return {
//       processedCount: processedReviews.size,
//       failedCount: failedReviews.length,
//       processedReviews: Array.from(processedReviews),
//       failedReviews: failedReviews,
//     };
//   } catch (error) {
//     console.error("Error in processYelpReviewsLogic:", error);
//     return {
//       processedCount: processedReviews.size,
//       failedCount: reviews.length - processedReviews.size,
//       processedReviews: Array.from(processedReviews),
//       failedReviews: [
//         ...failedReviews,
//         {
//           reviewId: "unknown",
//           error: error.message,
//           review: "Error occurred during overall process",
//         },
//       ],
//     };
//   }
// };

export const fetchYelpReviews = inngest.createFunction(
  { id: "fetch-yelp-reviews" },
  { event: "fetch/yelp.reviews" },
  async ({ event, step }) => {
    console.log("Starting fetchYelpReviews function");
    const { yelpBusinessLink, locationId, clerkId } = event.data;
    console.log(
      `Received data: yelpBusinessLink=${yelpBusinessLink}, locationId=${locationId}, clerkId=${clerkId}`
    );

    try {
      console.log("Updating isFetching status to true");
      await updateIsFetching("true", clerkId);
      await updateFetchErrorMessage("", clerkId);

      console.log("Starting Fetch Yelp Reviews logic");
      const result = await step.run("Fetch Yelp Reviews", async () => {
        return await fetchYelpReviewsLogic(
          yelpBusinessLink,
          locationId,
          clerkId
        );
      });

      const { reviews } = result;

      console.log(
        "Sending reviews to process/yelp.reviews function",
        reviews.length
      );

      await inngest.send({
        name: "process/yelp.reviews",
        data: { reviews, locationId, clerkId },
      });

      console.log("Updating selected location");
      await updateSelectedLocation(locationId, yelpBusinessLink);

      console.log("Updating isFetching status to false");
      await updateIsFetching("false", clerkId);

      console.log("Fetch Yelp Reviews completed successfully");
      return { success: true, ...result };
    } catch (error) {
      console.error(`Error in Inngest function: ${error.message}`);
      await updateIsFetching(false, clerkId);
      await updateFetchErrorMessage(error.message, clerkId);
      return { success: false, error: error.message };
    }
  }
);

async function fetchYelpReviewsLogic(yelpBusinessLink, locationId, clerkId) {
  console.log("Starting fetchYelpReviewsLogic");
  const alias = yelpBusinessLink.split("/").pop();
  console.log(`Extracted alias: ${alias}`);

  try {
    console.log("Posting initial Yelp review task");
    const initialResponse = await postYelpReviewTask(alias, 10);

    if (!initialResponse.tasks || initialResponse.tasks.length === 0) {
      console.error("No tasks found in initial response");
      throw new Error("No tasks found in response.");
    }

    const taskId = initialResponse.tasks[0].id;
    console.log(`Initial task ID: ${taskId}`);

    console.log("Polling for initial results");
    const initialResults = await pollYelpResults(taskId);

    if (!initialResults.success) {
      console.error(`Initial polling failed: ${initialResults.message}`);
      throw new Error(initialResults.message);
    }

    const totalReviews = initialResults.totalReviews;
    console.log(`Total reviews found: ${totalReviews}`);

    if (totalReviews > 10) {
      console.log(`Fetching all ${totalReviews} reviews`);
      const fullResponse = await postYelpReviewTask(alias, totalReviews);
      const fullTaskId = fullResponse.tasks[0].id;
      console.log(`Full task ID: ${fullTaskId}`);

      console.log("Polling for all reviews");
      const allReviews = await pollYelpResults(fullTaskId);

      if (!allReviews.success) {
        console.error(`Full polling failed: ${allReviews.message}`);
        throw new Error(allReviews.message);
      }

      // De-duplicate reviews here
      const uniqueReviews = Array.from(
        new Map(
          allReviews.reviews.map((review) => [review.review_id, review])
        ).values()
      );

      console.log(
        `Successfully fetched ${allReviews.reviews.length} reviews, Unique reviews: ${uniqueReviews.length}`
      );
      return {
        success: true,
        reviews: uniqueReviews,
        totalReviews: uniqueReviews.length,
      };
    }

    console.log(`Returning initial ${initialResults.reviews.length} reviews`);
    // De-duplicate initial reviews as well
    const uniqueInitialReviews = Array.from(
      new Map(
        initialResults.reviews.map((review) => [review.review_id, review])
      ).values()
    );
    console.log(
      `Initial reviews: ${initialResults.reviews.length}, Unique initial reviews: ${uniqueInitialReviews.length}`
    );

    return {
      success: true,
      reviews: uniqueInitialReviews,
      totalReviews: uniqueInitialReviews.length,
    };
  } catch (error) {
    console.error(`Yelp fetching error: ${error.message}`);
    await updateIsFetching(false, clerkId);
    await updateFetchErrorMessage(error.message, clerkId);
    return {
      success: false,
      message: `Failed to fetch Yelp reviews: ${error.message}`,
    };
  }
}

async function pollYelpResults(taskId) {
  console.log(`Starting to poll Yelp results for task ID: ${taskId}`);
  const maxAttempts = 10;
  const pollingInterval = 60000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`Polling attempt ${attempt + 1}`);
      const response = await axios({
        method: "get",
        url: `https://api.dataforseo.com/v3/business_data/yelp/reviews/task_get/${taskId}`,
        auth: {
          username: "0986881@lbcc.edu",
          password: "4045d2967d70b68e",
        },
        headers: { "content-type": "application/json" },
      });

      console.log(
        `Polling attempt ${attempt + 1}, status code: ${response.status}`
      );

      console.log(
        "Response status code —> ",
        response.data.tasks[0].status_code
      );

      if (response.data.tasks && response.data.tasks[0].status_code === 20000) {
        const result = response.data.tasks[0].result[0];

        if (!result || result.reviews_count === null) {
          console.error("No reviews found in response");
          return { success: false, message: "No reviews found in response" };
        }

        console.log(`Successfully fetched ${result.items.length} reviews`);
        return {
          success: true,
          reviews: result.items,
          totalReviews: result.reviews_count,
        };
      }

      if (attempt === maxAttempts - 1) {
        console.error("Max polling attempts reached");
        return { success: false, message: "Max polling attempts reached" };
      }

      console.log(`Waiting ${pollingInterval}ms before next attempt`);
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.error(`Error polling Yelp results: ${error.message}`);
      if (error.response && error.response.status === 500) {
        // Handle specific HTTP errors
        console.error(`Server error: ${error.response.status}`);
      } else {
        console.error(`General error: ${error.message}`);
      }

      return {
        success: false,
        message: `Error polling Yelp results: ${error.message}`,
      };
    }
  }

  console.error("Timeout while fetching Yelp reviews");
  return { success: false, message: "Timeout while fetching Yelp reviews" };
}

async function postYelpReviewTask(alias, depth) {
  console.log(`Posting Yelp review task for alias: ${alias}, depth: ${depth}`);
  try {
    const response = await axios({
      method: "post",
      url: "https://api.dataforseo.com/v3/business_data/yelp/reviews/task_post",
      auth: {
        username: "0986881@lbcc.edu",
        password: "4045d2967d70b68e",
      },
      data: [
        {
          language_name: "English",
          alias: alias,
          depth: depth,
        },
      ],
      headers: { "content-type": "application/json" },
    });

    console.log("Task posted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`HTTP error posting task: ${error.message}`);
    throw new Error(`HTTP error! Status: ${error.status}`);
  }
}

export default serve({
  client: inngest,
  functions: [fetchYelpReviews, processYelpReviews, processSingleYelpReview],
  streaming: "allow",
});
