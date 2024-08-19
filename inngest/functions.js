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

      const { data: locationData } = await getLocationInfo(locationId);

      console.log("Location Data fetched —> ", locationData);
      const { name_of_contact, position_of_contact, organization_name } =
        locationData;

      const customer_name = review.user_profile.name;
      const rating = review.rating.value;
      const review_text = review.review_text;

      const generatedResponse = await generateResponse(
        organization_name,
        name_of_contact,
        position_of_contact,
        rating,
        customer_name,
        review_text
      );

      if (
        !generatedResponse ||
        !generatedResponse.content ||
        !insights ||
        !insights.content ||
        !Array.isArray(insights.content) ||
        insights.content.length === 0
      ) {
        throw new Error("Invalid insights structure");
      }

      const response_text = generatedResponse.content[0].text;
      const parsedInsights = JSON.parse(insights.content[0].text);

      await storeReview(
        review,
        parsedInsights,
        locationId,
        clerkId,
        response_text,
        "yelp"
      );

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
    const deleteResult = await deleteReviewsForLocation(locationId, "yelp");
    console.log(`Delete result: ${JSON.stringify(deleteResult)}`);
    const uniqueReviews = Array.from(
      new Map(reviews.map((review) => [review.review_id, review])).values()
    );
    console.log(`Unique review count: ${uniqueReviews.length}`);

    const limit = pLimit(5);
    const baseDelay = 20000;

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
      await updateSelectedLocation(locationId, yelpBusinessLink, "", "");

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

  const initialDepth = 50;
  // const initialDepth = 10;

  try {
    console.log("Posting initial Yelp review task");
    const initialResponse = await postYelpReviewTask(alias, initialDepth);

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

    // Commenting out to avoid fetching all reviews: limiter is set to 50
    // if (totalReviews > initialDepth) {
    //   console.log(`Fetching all ${totalReviews} reviews`);
    //   const fullResponse = await postYelpReviewTask(alias, totalReviews);
    //   const fullTaskId = fullResponse.tasks[0].id;
    //   console.log(`Full task ID: ${fullTaskId}`);

    //   console.log("Polling for all reviews");
    //   const allReviews = await pollYelpResults(fullTaskId);

    //   if (!allReviews.success) {
    //     console.error(`Full polling failed: ${allReviews.message}`);
    //     throw new Error(allReviews.message);
    //   }

    //   // De-duplicate reviews here
    //   const uniqueReviews = Array.from(
    //     new Map(
    //       allReviews.reviews.map((review) => [review.review_id, review])
    //     ).values()
    //   );

    //   console.log(
    //     `Successfully fetched ${allReviews.reviews.length} reviews, Unique reviews: ${uniqueReviews.length}`
    //   );
    //   return {
    //     success: true,
    //     reviews: uniqueReviews,
    //     totalReviews: uniqueReviews.length,
    //   };
    // }

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

export const fetchGoogleReviews = inngest.createFunction(
  { id: "fetch-google-reviews" },
  { event: "fetch/google.reviews" },
  async ({ event, step }) => {
    console.log("Starting fetchGoogleReviews function");
    const { googlePlaceId, locationId, clerkId, coordinates } = event.data;
    console.log(
      `Received data: googlePlaceId=${googlePlaceId}, coordinates=${coordinates}, locationId=${locationId}, clerkId=${clerkId}`
    );

    try {
      console.log("Updating isFetching status to true");
      await updateIsFetching("true", clerkId);
      await updateFetchErrorMessage("", clerkId);

      console.log("Starting Fetch Google Reviews logic");
      const result = await step.run("Fetch Google Reviews", async () => {
        return await fetchGoogleReviewsLogic(
          googlePlaceId,
          coordinates,
          locationId,
          clerkId
        );
      });

      const { reviews, totalReviews } = result;

      console.log(
        "Sending reviews to process/google.reviews function",
        reviews.length
      );

      await inngest.send({
        name: "process/google.reviews",
        data: { reviews, totalReviews, locationId, clerkId },
      });

      console.log("Updating selected location");
      await updateSelectedLocation(locationId, "", googlePlaceId, coordinates);

      console.log("Updating isFetching status to false");
      await updateIsFetching("false", clerkId);

      console.log("Fetch Google Reviews completed successfully");
      return { success: true, ...result };
    } catch (error) {
      console.error(`Error in Inngest function: ${error.message}`);
      await updateIsFetching("false", clerkId);
      await updateFetchErrorMessage(error.message, clerkId);
      return { success: false, error: error.message };
    }
  }
);

export const processGoogleReviews = inngest.createFunction(
  {
    id: "process-google-reviews",
    retries: 0,
  },
  { event: "process/google.reviews" },
  async ({ event, step }) => {
    console.log("Starting processGoogleReviews function");
    const { reviews, totalReviews, locationId, clerkId } = event.data;

    try {
      const deleteResult = await deleteReviewsForLocation(locationId, "google");
      console.log(`Delete result: ${JSON.stringify(deleteResult)}`);

      const uniqueReviews = Array.from(
        new Map(reviews.map((review) => [review.review_id, review])).values()
      );
      console.log(`Unique review count: ${uniqueReviews.length}`);

      const limit = pLimit(5); // Limit concurrency to 5
      const baseDelay = 20000; // 20 seconds delay between reviews

      const sendJob = async (review, index) => {
        await new Promise((resolve) => setTimeout(resolve, baseDelay));
        return inngest.send({
          name: "process/single.google.review",
          data: {
            review,
            locationId,
            clerkId,
            index,
            total: uniqueReviews.length,
          },
        });
      };

      // Create a job for each review with concurrency limit
      const jobPromises = uniqueReviews.map((review, index) =>
        limit(() => sendJob(review, index))
      );

      await Promise.all(jobPromises);

      console.log(
        `Created ${uniqueReviews.length} individual review processing jobs`
      );
      return { success: true, reviewCount: uniqueReviews.length, totalReviews };
    } catch (error) {
      console.error(`Error in processGoogleReviews function: ${error.message}`);
      await updateFetchErrorMessage(error.message, clerkId);
      return { success: false, error: error.message };
    }
  }
);

export const processSingleGoogleReview = inngest.createFunction(
  { id: "process-single-google-review" },
  { event: "process/single.google.review" },
  async ({ event, step }) => {
    const { review, locationId, clerkId, index, total } = event.data;

    console.log(`Processing review ${index + 1}/${total}: ${review.review_id}`);

    try {
      console.log("Generating insights...");
      let insights = null;
      let parsedInsights = null;

      if (review.review_text) {
        insights = await generateInsights(review.review_text);
        console.log("Raw insights response:", insights);

        try {
          parsedInsights = JSON.parse(insights.content[0].text);
        } catch (parseError) {
          console.error("Error parsing insights JSON:", parseError);
          console.error("Insights content:", insights.content[0].text);
          // Instead of throwing, we'll set parsedInsights to null
          parsedInsights = null;
        }
      } else {
        console.log("Review has no text, skipping insight generation.");
      }

      console.log("Fetching location data...");
      const { data: locationData } = await getLocationInfo(locationId);

      console.log("Location Data fetched —> ", locationData);
      const { name_of_contact, position_of_contact, organization_name } =
        locationData;

      const customer_name = review.profile_name;
      const rating = review.rating.value;
      const review_text = review.review_text;

      console.log("Generating response...");
      let generatedResponse = null;

      if (review_text) {
        generatedResponse = await generateResponse(
          organization_name,
          name_of_contact,
          position_of_contact,
          rating,
          customer_name,
          review_text
        );
        console.log("Raw generated response:", generatedResponse);
      } else {
        console.log("Review has no text, skipping response generation.");
      }

      const response_text = generatedResponse
        ? generatedResponse.content[0].text
        : null;

      console.log("Storing review...");
      await storeReview(
        review,
        parsedInsights,
        locationId,
        clerkId,
        response_text,
        "google"
      );

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

async function fetchGoogleReviewsLogic(
  googlePlaceId,
  coordinates,
  locationId,
  clerkId
) {
  console.log("Starting fetchGoogleReviewsLogic");
  const initialDepth = 50;
  // const initialDepth = 10;

  try {
    console.log("Posting initial Google review task");
    const initialTaskId = await postGoogleReviewTask(
      googlePlaceId,
      coordinates,
      initialDepth
    );
    console.log(`Initial task ID: ${initialTaskId}`);

    console.log("Polling for initial results");
    const initialResults = await pollGoogleResults(initialTaskId);

    if (!initialResults.success) {
      console.error(`Initial polling failed: ${initialResults.message}`);
      throw new Error(initialResults.message);
    }

    console.log("Initial results:", JSON.stringify(initialResults, null, 2));

    if (!initialResults.reviews || !Array.isArray(initialResults.reviews)) {
      console.error("Initial results do not contain a valid reviews array");
      throw new Error("Invalid reviews data structure in initial results");
    }

    const totalReviews =
      initialResults.totalReviews || initialResults.reviews.length;
    console.log(`Total reviews found: ${totalReviews}`);

    // Commenting out to avoid fetching all reviews: limiter is set to 50
    // if (totalReviews > initialDepth) {
    //   console.log(`Fetching all ${totalReviews} reviews`);

    //   const fullTaskId = await postGoogleReviewTask(
    //     googlePlaceId,
    //     coordinates,
    //     totalReviews
    //   );

    //   console.log(`Full task ID: ${fullTaskId}`);

    //   console.log("Polling for all reviews");
    //   const allReviews = await pollGoogleResults(fullTaskId);

    //   if (!allReviews.success) {
    //     console.error(`Full polling failed: ${allReviews.message}`);
    //     throw new Error(allReviews.message);
    //   }

    //   console.log("All reviews results:", JSON.stringify(allReviews, null, 2));

    //   if (!allReviews.reviews || !Array.isArray(allReviews.reviews)) {
    //     console.error(
    //       "All reviews results do not contain a valid reviews array"
    //     );
    //     throw new Error(
    //       "Invalid reviews data structure in all reviews results"
    //     );
    //   }

    //   // De-duplicate reviews here
    //   const uniqueReviews = Array.from(
    //     new Map(
    //       allReviews.reviews.map((review) => [review.review_id, review])
    //     ).values()
    //   );

    //   console.log(
    //     `Successfully fetched ${allReviews.reviews.length} reviews, Unique reviews: ${uniqueReviews.length}`
    //   );
    //   return {
    //     success: true,
    //     reviews: uniqueReviews,
    //     totalReviews: uniqueReviews.length,
    //   };
    // }

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
    console.error(`Google fetching error: ${error.message}`);
    await updateIsFetching("false", clerkId);
    await updateFetchErrorMessage(error.message, clerkId);
    return {
      success: false,
      message: `Failed to fetch Google reviews: ${error.message}`,
    };
  }
}

async function postGoogleReviewTask(googlePlaceId, coordinates, depth) {
  console.log(
    `Posting Google review task for place ID: ${googlePlaceId}, depth: ${depth}`
  );

  try {
    const response = await axios({
      method: "post",
      url: "https://api.dataforseo.com/v3/business_data/google/reviews/task_post",
      auth: {
        username: "0986881@lbcc.edu",
        password: "4045d2967d70b68e",
      },
      data: [
        {
          language_name: "English",
          place_id: googlePlaceId,
          location_coordinate: coordinates,
          depth: depth,
        },
      ],
      headers: { "content-type": "application/json" },
    });

    if (response.data.tasks && response.data.tasks.length > 0) {
      return response.data.tasks[0].id;
    } else {
      throw new Error("No task ID returned from API");
    }
  } catch (error) {
    console.error(`HTTP error posting task: ${error.message}`);
    throw new Error(`HTTP error! Status: ${error.status}`);
  }
}

async function pollGoogleResults(taskId) {
  console.log(`Starting to poll Google results for task ID: ${taskId}`);
  const maxAttempts = 10;
  const pollingInterval = 60000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`Polling attempt ${attempt + 1}`);
      const response = await axios({
        method: "get",
        url: `https://api.dataforseo.com/v3/business_data/google/reviews/task_get/${taskId}`,
        auth: {
          username: "0986881@lbcc.edu",
          password: "4045d2967d70b68e",
        },
        headers: { "content-type": "application/json" },
      });

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
      console.error(`Error polling Google results: ${error.message}`);
      return {
        success: false,
        message: `Error polling Google results: ${error.message}`,
      };
    }
  }

  console.error("Timeout while fetching Google reviews");
  return { success: false, message: "Timeout while fetching Google reviews" };
}

export default serve({
  client: inngest,
  functions: [
    fetchYelpReviews,
    processYelpReviews,
    processSingleYelpReview,
    fetchGoogleReviews,
    processGoogleReviews,
    processSingleGoogleReview,
  ],
  streaming: "allow",
});
