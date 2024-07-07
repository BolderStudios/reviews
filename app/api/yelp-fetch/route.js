import { NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import {
  updateIsFetching,
  updateFetchErrorMessage,
  getLocationInfo,
} from "@/utils/actionsHelpers";
import axios from "axios";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});

export async function POST(request) {
  let clerkId;
  try {
    const requestBody = await request.json();
    const {
      yelpBusinessLink,
      locationId,
      clerkId: requestClerkId,
    } = requestBody;
    clerkId = requestClerkId;
    console.log("Received Yelp Business Link:", yelpBusinessLink);
    console.log("Received Location ID:", locationId);

    await updateIsFetching("true", clerkId);
    await updateFetchErrorMessage("", clerkId);
    const response = await fetchYelpReviews(
      yelpBusinessLink,
      locationId,
      clerkId
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    await updateIsFetching("false", clerkId);

    return NextResponse.json(response, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error initiating Yelp fetch: ${error.message}`);
    await updateIsFetching("false", clerkId);
    await updateFetchErrorMessage(error.message, clerkId);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function fetchYelpReviews(yelpBusinessLink, locationId, clerkId) {
  const alias = yelpBusinessLink.split("/").pop();
  try {
    const initialResponse = await postYelpReviewTask(alias, 10);

    if (!initialResponse.tasks || initialResponse.tasks.length === 0) {
      throw new Error("No tasks found in response.");
    }

    const taskId = initialResponse.tasks[0].id;
    const initialResults = await pollYelpResults(taskId);

    if (!initialResults.success) {
      throw new Error(initialResults.message);
    }

    const totalReviews = initialResults.totalReviews;

    if (totalReviews > 10) {
      const fullResponse = await postYelpReviewTask(alias, totalReviews);
      const fullTaskId = fullResponse.tasks[0].id;
      const allReviews = await pollYelpResults(fullTaskId);

      if (!allReviews.success) {
        throw new Error(allReviews.message);
      }

      console.log(`All reviews fetched —> `, allReviews.reviews.length);

      return {
        success: true,
        reviews: allReviews.reviews,
        totalReviews: allReviews.totalReviews,
      };
    }

    // Only working with Initial Reviews for now
    const { data: locationData } = await getLocationInfo(locationId);

    console.log("Location Data fetched —> ", locationData);
    // const { name_of_contact, position_of_contact, organization_name } =
    //   locationData;

    // console.log("Initial reviews fetched before calling AI —> ", initialResults.reviews);

    // const fetchedReviews = initialResults.reviews

    // fetchedReviews.forEach(async (review) => {
    //   const rating = review.rating.value;
    //   const customer_name = review.user_profile.name;
    //   const review_text = review.review_text;

    //   const response = await generateResponses(
    //     organization_name,
    //     name_of_contact,
    //     position_of_contact,
    //     rating,
    //     customer_name,
    //     review_text
    //   );

    //   console.log("Generated Responses —> ", response);
    // });

    return {
      success: true,
      reviews: initialResults.reviews,
      totalReviews: initialResults.totalReviews,
    };
  } catch (error) {
    console.log(`Yelp fetching error —> `, error);
    return {
      success: false,
      message: `Failed to fetch Yelp reviews: ${error.message}`,
    };
  }
}

async function generateResponses(
  organization_name,
  contant_name,
  contact_position,
  rating,
  customer_name,
  review_text
) {
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2502,
    temperature: 0.7,
    system:
      'You are an AI assistant trained to write personalized, empathetic, and varied responses to customer reviews for personal service businesses. Craft responses that sound natural, friendly, and human-like, avoiding robotic or generic language.\n\nLanguage Variety:\n- Use the following phrases sparingly and only when appropriate: "top priority," "aim for," "strive for," "we pride ourselves," "we\'re always," "we always," "I\'m thrilled," "I\'m glad," "it\'s not an excuse," "we\'re deeply troubled," "I\'m thrilled," "we\'re deeply [something]," "doesn\'t align with [something]," "I appreciate you," "We take pride," "I\'d like to make this right. If you\'re willing," "You\'re absolutely right – we should," "I\'m truly sorry," "I sincerely apologize," "I couldn\'t help but chuckle," "dropped the ball," "I\'m deeply concerned."\n- Avoid starting consecutive sentences with similar expressions.\n- Diversify your vocabulary and phrasing to maintain a fresh, genuine tone in each response.\n\nKey Guidelines:\n\nOpenings:\n- IMPORTANT: Do NOT use any generic opening statements. This includes, but is not limited to:\n  * Making personal observations about the reviewer\'s comments\n  * "I\'m thrilled you had such a fantastic time at [Business Name]!"\n  * "Thank you for your review."\n  * Commenting on their experience in a general way\n  * "We appreciate your feedback."\n  * "I\'m [manager\'s name], and I\'m glad you visited us."\n- Instead, start your response by directly addressing a specific point from the review.\n- Your first sentence should reference a detail from the customer\'s experience.\n- Avoid any form of general acknowledgment or thanks at the beginning of the response.\n- Do not give introductions of the business owner or manager. \n\nRemember: The goal is to make the customer feel heard by immediately engaging with the content of their review.\n\n2. Brevity: Aim for concise responses. Longer isn\'t always better; a short, focused response can be more impactful.\n\n3. Natural Flow: Write as if you\'re having a real conversation. Use transitions to connect ideas smoothly.\n\n4. Structure: Vary the order of addressing points. Don\'t always start with an apology or acknowledgment. Mix up the flow to keep responses feeling natural and unique.\n\n5. Style: Use more "I" statements instead of "we" to make responses feel more personal. Incorporate the reviewer\'s language or style when appropriate.\n   - Greet the customer and add a closing signature.\n   - Vary opening and closing statements\n   - Select openings and greetings randomly, so it doesn\'t sound the same every time you write a response. Get straight to the point\n   - Use conversational language, including colloquialisms and contractions\n   - Personalize based on review content\n   - Vary the structure and order of response elements\n   - Incorporate emotion and empathy\n   - Add conditional statements to sound less scripted\n   - Include occasional humor or light-heartedness where appropriate\n   - Vary the level of formality based on the review\'s tone\n   - For negative reviews: vary statements like "dropped the ball" because this expression appears in almost every review. Acknowledge the mistake and don\'t overuse frequently used terms or expressions.\n\n6. Content: Focus more on solutions and future actions rather than explanations of standard practices. Be concise when addressing issues.\n   - Be specific in addressing the reviewer\'s points\n   - Offer concrete solutions or improvements\n   - Include a call-to-action (e.g., invitation to return, contact information)\n   - Mention any relevant policies or procedures\n   - Incorporate industry-specific language where appropriate \n\n7. Tone: Adjust your level of formality and emotion based on the review\'s content and tone. Don\'t overcompensate with excessive apologies or enthusiasm.\n\n8. Authenticity: Write as if you\'re having a real conversation. It\'s okay to be brief if the situation calls for it.\n\n9. Problem-Solving: Offer specific, actionable solutions rather than generic promises to do better.\n\n10. Closing: Vary your call-to-action and closing statements. Not every response needs to invite the customer back or offer a free service.\n- Some closures start with "Rest assured" or "We\'d like to make this right for you. If you\'re willing." I want them to be fluid and be more conversational and cohesive.\n\n11. Sentence Structure and Flow:\n   - Combine related ideas into single, flowing sentences instead of using multiple short, abrupt sentences.\n   - Use transitional phrases to connect ideas and create a smoother narrative.\n   - Vary sentence length to create a more natural rhythm in your writing.\n   - Don\'t be afraid to use longer, more complex sentences when appropriate, especially when connecting related thoughts.\n\n12. Conclusions and Closing Statements:\n   - Avoid overused phrases like "I\'m disheartened," "I\'m disappointed," "I\'m particularly concerned," or "If you\'re open to it."\n   - Craft unique closing statements that reflect the specific situation and tone of the review.\n   - Don\'t always end with an invitation to return or an offer to make things right. Sometimes, a simple acknowledgment or thank you is sufficient.\n   - Use varied language to express regret, appreciation, or hope for future interactions.\n   - Consider ending with a forward-looking statement that doesn\'t necessarily require action from the reviewer.\n\n13. Overall Response Structure:\n    - Avoid falling into a predictable pattern across responses (e.g., always starting with an apology or ending with an invitation).\n    - Mix up the order in which you address points, express empathy, offer solutions, or share business insights.\n    - Tailor the length and complexity of your response to match the review\'s tone and content.\n\nRemember:\n- Prioritize addressing the reviewer\'s main concerns over covering every point.\n- It\'s okay to leave some minor points unaddressed if they don\'t significantly impact the overall response.\n- Aim for a conversational tone that flows naturally, as if you\'re speaking directly to the reviewer.\n- Each response should feel unique and tailored to the specific review.\n\nNow, please write a response to the following review, keeping in mind these refined guidelines and the specific points raised by the reviewer.',
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${contact_position}'s Name: ${contant_name}\nBusiness's Name: ${organization_name}\nRating: ${rating} star\nBackground Information: None\nCustomer's Name: ${customer_name}\nCustomer's Review: ${review_text}`,
          },
        ],
      },
    ],
  });

  return msg;
}

async function pollYelpResults(taskId) {
  const maxAttempts = 10; // Reduced for faster error detection
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

      console.log(
        `Polling attempt ${attempt + 1}, status code: ${response.status}`
      );

      if (response.data.tasks && response.data.tasks[0].status_code === 20000) {
        const result = response.data.tasks[0].result[0];

        if (!result || result.reviews_count === null) {
          return { success: false, message: "No reviews found in response" };
        }

        return {
          success: true,
          reviews: result.items,
          totalReviews: result.reviews_count,
        };
      }

      if (attempt === maxAttempts - 1) {
        return { success: false, message: "Max polling attempts reached" };
      }

      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.error("Error polling Yelp results:", error);
      return {
        success: false,
        message: `Error polling Yelp results: ${error.message}`,
      };
    }
  }

  return { success: false, message: "Timeout while fetching Yelp reviews" };
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
      data: [
        {
          language_name: "English",
          alias: alias,
          depth: depth,
        },
      ],
      headers: { "content-type": "application/json" },
    });

    console.log("Task posted —> ", response.data);
    return response.data;
  } catch (error) {
    console.error(`HTTP error! Status: ${error.response?.status}`);
    throw new Error(`HTTP error! Status: ${error.response?.status}`);
  }
}

// async function storeReviews(locationId, reviews) {
//   for (const review of reviews) {
//     try {
//       const { data, error } = await supabase.from("yelp_reviews").upsert(
//         {
//           location_id: locationId,
//           review_id: review.id,
//           rating: review.rating,
//           text: review.text,
//           time_created: review.time_created,
//           url: review.url,
//           user_name: review.user.name,
//           user_image_url: review.user.image_url,
//         },
//         {
//           onConflict: "review_id",
//         }
//       );

//       if (error) throw error;
//     } catch (error) {
//       console.error(`Error storing review ${review.id}:`, error);
//     }
//   }
// }
