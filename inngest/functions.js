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
  {
    id: "process-yelp-reviews",
    retries: 0,
  },
  { event: "process/yelp.reviews" },
  async ({ event, step }) => {
    console.log("Starting processYelpReviews function");
    const { reviews, locationId, clerkId } = event.data;

    // De-duplicate reviews here
    const uniqueReviews = Array.from(
      new Map(reviews.map((review) => [review.review_id, review])).values()
    );
    console.log(
      `Original review count: ${reviews.length}, Unique review count: ${uniqueReviews.length}`
    );

    try {
      console.log(
        "Log from processYelpReviews, unique reviews: ",
        uniqueReviews.length
      );
      const result = await step.run("Process Fetch Reviews", async () => {
        return await processYelpReviewsLogic(
          uniqueReviews,
          locationId,
          clerkId
        );
      });

      return { success: true, ...result };
    } catch (error) {
      console.error(`Error in processYelpReviews function: ${error.message}`);
      await updateFetchErrorMessage(error.message, clerkId);
      return {
        success: false,
        error: error.message,
        processedCount: 0,
        failedCount: uniqueReviews.length,
      };
    }
  }
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processYelpReviewsLogic = async (reviews, locationId, clerkId) => {
  const processedReviews = new Set();
  const failedReviews = [];
  const limit = pLimit(10);
  const delay = 60000 / 60;

  try {
    const { data: locationData } = await getLocationInfo(locationId);
    console.log("Location Data fetched —> ", locationData);
    const { name_of_contact, position_of_contact, organization_name } =
      locationData;
    console.log("Processing reviews, count: ", reviews.length);

    const deleteResult = await deleteReviewsForLocation(locationId);
    if (!deleteResult.success) {
      console.error(`Failed to delete existing reviews: ${deleteResult.error}`);
    } else {
      console.log(
        `Deleted ${deleteResult.deletedCount} existing reviews for location ${locationId}`
      );
    }

    const reviewResults = await Promise.all(
      reviews.map((review, index) =>
        limit(async () => {
          await sleep(index * delay);
          try {
            console.log("Generating insights for review...", review.review_id);
            const insights = await retryRequest(
              () => generateInsights(review.review_text),
              10,
              5000
            );

            if (
              !insights ||
              !insights.content ||
              !Array.isArray(insights.content) ||
              insights.content.length === 0
            ) {
              throw new Error("Invalid insights structure");
            }

            const parsedInsights = JSON.parse(insights.content[0].text);
            console.log("Storing review...", review.review_id);
            await storeReview(review, parsedInsights, locationId, clerkId);

            console.log(`Successfully processed review ${review.review_id}`);
            return { success: true, reviewId: review.review_id };
          } catch (error) {
            console.error(
              `Error processing review ${review.review_id}:`,
              error.message
            );
            return {
              success: false,
              reviewId: review.review_id,
              error: error.message,
              review: review,
            };
          }
        })
      )
    );

    reviewResults.forEach((result) => {
      if (result.success) {
        processedReviews.add(result.reviewId);
      } else {
        failedReviews.push({
          reviewId: result.reviewId,
          error: result.error,
          review: result.review,
        });
      }
    });

    console.log(
      `Processed ${processedReviews.size} reviews successfully, ${failedReviews.length} failed`
    );

    return {
      processedCount: processedReviews.size,
      failedCount: failedReviews.length,
      processedReviews: Array.from(processedReviews),
      failedReviews: failedReviews,
    };
  } catch (error) {
    console.error("Error in processYelpReviewsLogic:", error);
    return {
      processedCount: processedReviews.size,
      failedCount: reviews.length - processedReviews.size,
      processedReviews: Array.from(processedReviews),
      failedReviews: [
        ...failedReviews,
        {
          reviewId: "unknown",
          error: error,
          review: "Error occurred during overall process",
        },
      ],
    };
  }
};

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
  const maxAttempts = 5;
  const pollingInterval = 10000;

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
  functions: [fetchYelpReviews, processYelpReviews],
  streaming: "allow",
});

async function retryRequest(fn, maxRetries = 5, retryDelay = 5000) {
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
