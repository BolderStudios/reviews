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

export const processYelpReviews = inngest.createFunction(
  { id: "process-yelp-reviews" },
  { event: "process/yelp.reviews" },
  async ({ event, step }) => {
    step.log("Starting processYelpReviews function");
    const { reviews, locationId, clerkId } = event.data;

    try {
      step.log("Log from processYelpReviews, reviews: ", reviews.length);
      const result = await step.run("Process Fetch Reviews", async () => {
        return await processYelpReviewsLogic(reviews, locationId, clerkId);
      });

      return { success: true, ...result };
    } catch (error) {
      step.error(`Error in processYelpReviews function: ${error.message}`);
      await updateFetchErrorMessage(error.message, clerkId);
      return { success: false, error: error.message };
    }
  }
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processYelpReviewsLogic = async (reviews, locationId, clerkId) => {
  const limit = pLimit(1);
  const delay = 60000 / 60;

  try {
    const { data: locationData } = await getLocationInfo(locationId);
    step.log("Location Data fetched —> ", locationData);
    const { name_of_contact, position_of_contact, organization_name } =
      locationData;

    step.log("Processing reviews, count: ", reviews.length);

    const deleteResult = await deleteReviewsForLocation(locationId);
    if (!deleteResult.success) {
      step.error(`Failed to delete existing reviews: ${deleteResult.error}`);
    } else {
      step.log(
        `Deleted ${deleteResult.deletedCount} existing reviews for location ${locationId}`
      );
    }

    const processedReviews = await Promise.all(
      reviews.map((review, index) =>
        limit(async () => {
          await sleep(index * delay);
          try {
            // const response = await retryRequest(
            //   () =>
            //     generateResponse(
            //       organization_name,
            //       name_of_contact,
            //       position_of_contact,
            //       review.rating.value,
            //       review.user_profile.name,
            //       review.review_text
            //     ),
            //   5,
            //   30000
            // );

            step.log("Generating insights for review...", review);

            const insights = await retryRequest(
              () => generateInsights(review.review_text),
              5,
              10000
            );

            if (
              !insights ||
              !insights.content ||
              !Array.isArray(insights.content) ||
              insights.content.length === 0
            ) {
              step.error("Invalid insights structure:", insights);
              throw new Error("Invalid insights structure");
            }

            const parsedInsights = JSON.parse(insights.content[0].text);

            step.log("Storing review...", review);
            const storeResult = await storeReview(
              review,
              parsedInsights,
              locationId,
              clerkId
            );

            step.log(`Successfully processed review ${review.review_id}`);
            return { success: true, reviewId: review.review_id };
          } catch (error) {
            step.log("Review itself: ", review);
            step.error(
              `Error processing review ${review.review_id}:`,
              error
            );
            return {
              success: false,
              reviewId: review.review_id,
              error: error.message,
            };
          }
        })
      )
    );

    const successfulReviews = processedReviews.filter((r) => r.success).length;
    const failedReviews = processedReviews.filter((r) => !r.success).length;

    step.log(
      `Processed ${successfulReviews} reviews successfully, ${failedReviews} failed`
    );

    return { processedCount: successfulReviews, failedCount: failedReviews };
  } catch (error) {
    step.error("Error in processYelpReviewsLogic:", error);
    throw error;
  }
};

export const fetchYelpReviews = inngest.createFunction(
  { id: "fetch-yelp-reviews" },
  { event: "fetch/yelp.reviews" },
  async ({ event, step }) => {
    step.log("Starting fetchYelpReviews function");
    const { yelpBusinessLink, locationId, clerkId } = event.data;
    step.log(
      `Received data: yelpBusinessLink=${yelpBusinessLink}, locationId=${locationId}, clerkId=${clerkId}`
    );

    try {
      step.log("Updating isFetching status to true");
      await updateIsFetching("true", clerkId);
      await updateFetchErrorMessage("", clerkId);

      step.log("Starting Fetch Yelp Reviews logic");
      const result = await step.run("Fetch Yelp Reviews", async () => {
        return await fetchYelpReviewsLogic(
          yelpBusinessLink,
          locationId,
          clerkId
        );
      });

      const { reviews } = result;

      step.log(
        "Sending reviews to process/yelp.reviews function",
        reviews.length
      );

      await inngest.send({
        name: "process/yelp.reviews",
        data: { reviews, locationId, clerkId },
      });

      step.log("Updating selected location");
      await updateSelectedLocation(locationId, yelpBusinessLink);

      step.log("Updating isFetching status to false");
      await updateIsFetching("false", clerkId);

      step.log("Fetch Yelp Reviews completed successfully");
      return { success: true, ...result };
    } catch (error) {
      step.error(`Error in Inngest function: ${error.message}`);
      await updateIsFetching(false, clerkId);
      await updateFetchErrorMessage(error.message, clerkId);
      return { success: false, error: error.message };
    }
  }
);

async function fetchYelpReviewsLogic(yelpBusinessLink, locationId, clerkId) {
  step.log("Starting fetchYelpReviewsLogic");
  const alias = yelpBusinessLink.split("/").pop();
  step.log(`Extracted alias: ${alias}`);

  try {
    step.log("Posting initial Yelp review task");
    const initialResponse = await postYelpReviewTask(alias, 10);

    if (!initialResponse.tasks || initialResponse.tasks.length === 0) {
      step.error("No tasks found in initial response");
      throw new Error("No tasks found in response.");
    }

    const taskId = initialResponse.tasks[0].id;
    step.log(`Initial task ID: ${taskId}`);

    step.log("Polling for initial results");
    const initialResults = await pollYelpResults(taskId);

    if (!initialResults.success) {
      step.error(`Initial polling failed: ${initialResults.message}`);
      throw new Error(initialResults.message);
    }

    const totalReviews = initialResults.totalReviews;
    step.log(`Total reviews found: ${totalReviews}`);

    if (totalReviews > 10) {
      step.log(`Fetching all ${totalReviews} reviews`);
      const fullResponse = await postYelpReviewTask(alias, totalReviews);
      const fullTaskId = fullResponse.tasks[0].id;
      step.log(`Full task ID: ${fullTaskId}`);

      step.log("Polling for all reviews");
      const allReviews = await pollYelpResults(fullTaskId);

      if (!allReviews.success) {
        step.error(`Full polling failed: ${allReviews.message}`);
        throw new Error(allReviews.message);
      }

      step.log(
        `Successfully fetched all ${allReviews.reviews.length} reviews`
      );
      return {
        success: true,
        reviews: allReviews.reviews,
        totalReviews: allReviews.totalReviews,
      };
    }

    step.log(`Returning initial ${initialResults.reviews.length} reviews`);
    step.log("Actual reviews —> ", initialResults.reviews);

    return {
      success: true,
      reviews: initialResults.reviews,
      totalReviews: initialResults.totalReviews,
    };
  } catch (error) {
    step.error(`Yelp fetching error: ${error.message}`);
    await updateIsFetching(false, clerkId);
    await updateFetchErrorMessage(error.message, clerkId);
    return {
      success: false,
      message: `Failed to fetch Yelp reviews: ${error.message}`,
    };
  }
}

async function pollYelpResults(taskId) {
  step.log(`Starting to poll Yelp results for task ID: ${taskId}`);
  const maxAttempts = 999;
  const pollingInterval = 10000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      step.log(`Polling attempt ${attempt + 1}`);
      const response = await axios({
        method: "get",
        url: `https://api.dataforseo.com/v3/business_data/yelp/reviews/task_get/${taskId}`,
        auth: {
          username: "0986881@lbcc.edu",
          password: "4045d2967d70b68e",
        },
        headers: { "content-type": "application/json" },
      });

      step.log(
        `Polling attempt ${attempt + 1}, status code: ${response.status}`
      );

      step.log(
        "Response status code —> ",
        response.data.tasks[0].status_code
      );

      if (response.data.tasks && response.data.tasks[0].status_code === 20000) {
        const result = response.data.tasks[0].result[0];

        if (!result || result.reviews_count === null) {
          step.error("No reviews found in response");
          return { success: false, message: "No reviews found in response" };
        }

        step.log(`Successfully fetched ${result.items.length} reviews`);
        return {
          success: true,
          reviews: result.items,
          totalReviews: result.reviews_count,
        };
      }

      if (attempt === maxAttempts - 1) {
        step.error("Max polling attempts reached");
        return { success: false, message: "Max polling attempts reached" };
      }

      step.log(`Waiting ${pollingInterval}ms before next attempt`);
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    } catch (error) {
      step.error(`Error polling Yelp results: ${error.message}`);
      if (error.response && error.response.status === 500) {
        // Handle specific HTTP errors
        step.error(`Server error: ${error.response.status}`);
      } else {
        step.error(`General error: ${error.message}`);
      }

      return {
        success: false,
        message: `Error polling Yelp results: ${error.message}`,
      };
    }
  }

  step.error("Timeout while fetching Yelp reviews");
  return { success: false, message: "Timeout while fetching Yelp reviews" };
}

async function postYelpReviewTask(alias, depth) {
  step.log(`Posting Yelp review task for alias: ${alias}, depth: ${depth}`);
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

    step.log("Task posted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`HTTP error posting task: ${error.message}`);
    throw new Error(`HTTP error! Status: ${error.status}`);
  }
}

export default serve({
  client: inngest,
  functions: [fetchYelpReviews],
  streaming: "allow",
});

async function retryRequest(fn, maxRetries = 5, retryDelay = 60000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (
        error.status === 429 ||
        (error.error && error.error.type === "rate_limit_error")
      ) {
        console.log(
          `Rate limit hit, waiting ${retryDelay / 1000} seconds before retry ${
            i + 1
          }`
        );
        await sleep(retryDelay);
      } else if (i === maxRetries - 1) {
        throw error;
      } else {
        console.log(
          `Error occurred, retrying in ${retryDelay / 1000} seconds. Attempt ${
            i + 1
          }`
        );
        await sleep(retryDelay);
      }
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}
