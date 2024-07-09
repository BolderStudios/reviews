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

const limit = pLimit(2);
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

      const { data: locationData } = await getLocationInfo(locationId);
      console.log("Location Data fetched —> ", locationData);
      const { name_of_contact, position_of_contact, organization_name } =
        locationData;

      const fetchedAllReviews = allReviews.reviews;
      console.log("Fetched all reviews length —> ", fetchedAllReviews.length);

      const deleteResult = await deleteReviewsForLocation(locationId);
      if (!deleteResult.success) {
        console.error(
          `Failed to delete existing reviews: ${deleteResult.error}`
        );
        // Decide whether you want to continue or throw an error here
        // throw new Error(`Failed to delete existing reviews: ${deleteResult.error}`);
      } else {
        if (deleteResult.deletedCount === 0) {
          console.log(
            "No existing reviews found for this location ID —> ",
            locationId
          );
        } else {
          console.log(
            "Deleted existing reviews -> ",
            deleteResult.deletedCount
          );
        }
      }

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const processReviews = fetchedAllReviews.map((review) =>
        limit(async () => {
          await delay(1250);

          const rating = review.rating.value;
          const customer_name = review.user_profile.name;
          const review_text = review.review_text;

          try {
            const response = await retryRequest(() =>
              generateResponse(
                organization_name,
                name_of_contact,
                position_of_contact,
                rating,
                customer_name,
                review_text
              )
            );

            const insights = await retryRequest(() =>
              generateInsights(
                organization_name,
                name_of_contact,
                position_of_contact,
                rating,
                customer_name,
                review_text
              )
            );

            console.log("Generated Response —> ", response);
            console.log("Generated Insights —> ", insights);

            const parsedInsights = JSON.parse(insights.content[0].text);

            console.log("Parsed insights -> ", parsedInsights);

            // Store the review in the database
            try {
              const storeResult = await storeReview(
                review,
                response,
                parsedInsights,
                locationId,
                clerkId
              );
              console.log("Review stored successfully:", storeResult);
            } catch (storeError) {
              console.error("Error storing review:", storeError);
              // I might want to implement some retry logic here or log the error for manual review
            }

            return { response, insights };
          } catch (error) {
            console.error("Error processing review:", error);
            return { error: error.message };
          }
        })
      );
      await Promise.all(processReviews);

      console.log(
        `Successfully fetched all ${allReviews.reviews.length} reviews`
      );
      return {
        success: true,
        reviews: allReviews.reviews,
        totalReviews: allReviews.totalReviews,
      };
    }

    console.log(`Returning initial ${initialResults.reviews.length} reviews`);
    console.log("Actual reviews —> ", initialResults.reviews);

    const { data: locationData } = await getLocationInfo(locationId);
    console.log("Location Data fetched —> ", locationData);
    const { name_of_contact, position_of_contact, organization_name } =
      locationData;

    const fetchedAllReviews = initialResults.reviews;
    console.log("Fetched all reviews length —> ", fetchedAllReviews.length);
    const deleteResult = await deleteReviewsForLocation(locationId);
    if (!deleteResult.success) {
      console.error(`Failed to delete existing reviews: ${deleteResult.error}`);
      // Decide whether you want to continue or throw an error here
      // throw new Error(`Failed to delete existing reviews: ${deleteResult.error}`);
    } else {
      if (deleteResult.deletedCount === 0) {
        console.log(
          "No existing reviews found for this location ID —> ",
          locationId
        );
      } else {
        console.log("Deleted existing reviews -> ", deleteResult.deletedCount);
      }
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const processReviews = fetchedAllReviews.map((review) =>
      limit(async () => {
        await delay(1250);

        const rating = review.rating.value;
        const customer_name = review.user_profile.name;
        const review_text = review.review_text;

        try {
          const response = await retryRequest(() =>
            generateResponse(
              organization_name,
              name_of_contact,
              position_of_contact,
              rating,
              customer_name,
              review_text
            )
          );

          const insights = await retryRequest(() =>
            generateInsights(review_text)
          );

          console.log("Generated Response —> ", response);
          console.log("Generated Insights —> ", insights);

          const parsedInsights = JSON.parse(insights.content[0].text);

          console.log("Parsed insights -> ", parsedInsights);

          // Store the review in the database
          try {
            const storeResult = await storeReview(
              review,
              response,
              parsedInsights,
              locationId,
              clerkId
            );
            console.log("Review stored successfully:", storeResult);
          } catch (storeError) {
            console.error("Error storing review:", storeError);
            // I might want to implement some retry logic here or log the error for manual review
          }

          return { response, insights };
        } catch (error) {
          console.error("Error processing review:", error);
          return { error: error.message };
        }
      })
    );
    await Promise.all(processReviews);

    return {
      success: true,
      reviews: initialResults.reviews,
      totalReviews: initialResults.totalReviews,
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
  const maxAttempts = 999;
  const pollingInterval = 30000;

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
    throw new Error(`HTTP error! Status: ${error.response?.status}`);
  }
}

export default serve({
  client: inngest,
  functions: [fetchYelpReviews],
  streaming: "allow",
});

async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    console.log("Retry attempt", i + 1);

    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
