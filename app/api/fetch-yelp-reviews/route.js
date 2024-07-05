import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const formData = await request.json();
    const result = await fetchYelpReviewsRequest(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching Yelp reviews:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

async function fetchYelpReviewsRequest(formData) {
  console.log("Fetching reviews —> ", formData);
  const alias = formData.yelpBusinessLink.split("/").pop();
  try {
    const initialResponse = await postYelpReviewTask(alias, 10);
    const taskId = initialResponse.data.tasks[0].id;
    const initialResults = await pollYelpResults(taskId);
    const totalReviews = initialResults.totalReviews;

    if (totalReviews > 10) {
      const fullResponse = await postYelpReviewTask(alias, totalReviews);
      const fullTaskId = fullResponse.data.tasks[0].id;
      const allReviews = await pollYelpResults(fullTaskId);
      console.log("More than 10 reviews");
      return {
        success: true,
        reviews: allReviews.reviews,
        totalReviews: allReviews.totalReviews,
      };
    } else {
      console.log("Less or equal to 10 reviews");
      return {
        success: true,
        reviews: initialResults.reviews,
        totalReviews: initialResults.totalReviews,
      };
    }
  } catch (error) {
    console.log(`Yelp fetching error —> `, error);
    return {
      success: false,
      message: "Failed to fetch Yelp reviews",
    };
  }
}

async function postYelpReviewTask(alias, depth) {
  return axios({
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
}

async function pollYelpResults(taskId) {
  const maxAttempts = 10;
  const pollingInterval = 20000;
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
      if (response.data.tasks[0].status_code === 20000) {
        const result = response.data.tasks[0].result[0];
        return {
          success: true,
          reviews: result.items,
          totalReviews: result.reviews_count,
        };
      }
    } catch (error) {
      console.error("Error polling Yelp results:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
  }
  throw new Error("Timeout while fetching Yelp reviews");
}