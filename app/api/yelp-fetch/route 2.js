import { NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import axios from "axios";

export async function POST(request) {
  try {
    // First, we need to extract the JSON body from the request
    const requestBody = await request.text();
    console.log("Request received —> ", requestBody);
    const { yelpBusinessLink } = JSON.parse(requestBody); // Parse the text to JSON
    console.log("Received Yelp Business Link:", yelpBusinessLink);

    // Now you can use yelpBusinessLink to fetch reviews or perform other logic
    const response = await fetchYelpReviews(yelpBusinessLink);

    // Return a JSON response with success status
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Error initiating Yelp fetch: ${error.message}`);
    // Return a JSON response with error details
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

async function fetchYelpReviews(yelpBusinessLink) {
  console.log("Fetching reviews —> ", yelpBusinessLink);
  const alias = yelpBusinessLink.split("/").pop();
  try {
    const initialResponse = await postYelpReviewTask(alias, 10);
    console.log(`Initial response —> `, initialResponse);

    // Check if tasks array is present and has at least one item
    if (!initialResponse.tasks || initialResponse.tasks.length === 0) {
      throw new Error("No tasks found in response.");
    }

    const taskId = initialResponse.tasks[0].id;
    console.log(`Task ID —> `, taskId);

    // Properly handle asynchronous task completion
    const initialResults = await pollYelpResults(taskId);
    console.log(`Initial results —> `, initialResults);

    // Ensure results are properly formatted
    if (!initialResults || initialResults.success === false) {
      throw new Error("Failed to get initial results: " + initialResults.message);
    }

    const totalReviews = initialResults.totalReviews;

    // If more reviews are available than initially fetched
    if (totalReviews > 10) {
      const fullResponse = await postYelpReviewTask(alias, totalReviews);
      const fullTaskId = fullResponse.tasks[0].id;
      const allReviews = await pollYelpResults(fullTaskId);
      
      console.log(`All reviews fetched —> `, allReviews.reviews.length);
      console.log(`Total reviews fetched —> `, allReviews);
      return {
        success: true,
        reviews: allReviews.reviews,
        totalReviews: allReviews.totalReviews,
      };
    }

    return {
      success: true,
      reviews: initialResults.reviews,
      totalReviews: initialResults.totalReviews,
    };
  } catch (error) {
    console.log(`Yelp fetching error —> `, error);
    return {
      success: false,
      message: "Failed to fetch Yelp reviews: " + error.message,
    };
  }
}


async function postYelpReviewTask(alias, depth) {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.dataforseo.com/v3/business_data/yelp/reviews/task_post",
      auth: {
        username: "0986881@lbcc.edu",
        password: "4045d2967d70b68e",
      },
      data: [{
        language_name: "English",
        alias: alias,
        depth: depth,
      }],
      headers: { "content-type": "application/json" },
    });

    console.log("Task posted —> ", response.data);
    return response.data; 
  } catch (error) {
    // Axios throws on non-200 status, handle that here
    console.error(`HTTP error! Status: ${error.response.status}`);
    throw new Error(`HTTP error! Status: ${error.response.status}`);
  }
}

async function pollYelpResults(taskId) {
  const maxAttempts = 999;
  const pollingInterval = 60000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios({
        method: "get",
        url: `https://api.dataforseo.com/v3/business_data/yelp/reviews/task_get/${taskId}`,
        auth: {
          username: "0986881@lbcc.edu",
          password: "4045d2967d70b68e",
        },
        headers: { "content-type": "application/json" },
      });

      // Log the current attempt and status code
      console.log(`Polling attempt ${attempt + 1}, status code: ${response.status}`);

      // Check the response data structure and status codes
      if (response.data.tasks && response.data.tasks[0].status_code === 20000) {
        const result = response.data.tasks[0].result[0];
        return {
          success: true,
          reviews: result.items,
          totalReviews: result.reviews_count,
        };
      }

      // Wait before the next polling attempt
      await new Promise(resolve => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.error("Error polling Yelp results:", error);
      if (attempt === maxAttempts - 1) throw error; // Re-throw if last attempt
    }
  }

  return { success: false, message: "Timeout while fetching Yelp reviews" };
}

