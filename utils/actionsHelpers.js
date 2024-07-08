import supabase from "@/utils/supabaseClient";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});

export async function updateIsFetching(booleanState, clerkId) {
  console.log("Updating fetch state to:", booleanState);
  console.log("User ID: ", clerkId);

  const { data: updatedUser, error: updatedUserError } = await supabase
    .from("users")
    .update({ is_fetching: booleanState })
    .eq("clerk_id", clerkId);

  if (updatedUserError) {
    console.error("Error updating user fetch state:", updatedUserError);
    return { success: false };
  }

  return { success: true };
}

export async function updateFetchErrorMessage(errorMessage, clerkId) {
  console.log("Updating fetch error message to:", errorMessage);
  console.log("User ID: ", clerkId);

  const { error } = await supabase
    .from("users")
    .update({ fetch_error_message: errorMessage })
    .eq("clerk_id", clerkId);

  if (error) {
    console.error("Error updating fetch error message:", error);
    return { success: false };
  }

  return { success: true };
}

export async function updateSelectedLocation(locationId, yelpProfileUrl) {
  const { data, error } = await supabase
    .from("locations")
    .update({
      is_yelp_configured: true,
      yelp_profile_url: yelpProfileUrl,
    })
    .eq("id", locationId);

  if (error) {
    console.error("Error updating selected location:", error);
    return { success: false };
  }

  return { success: true };
}

export async function getLocationInfo(locationId) {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", locationId)
    .single();

  if (error) {
    console.error("Error fetching location info:", error);
    return { success: false };
  }

  return { success: true, data };
}

export async function generateResponse(
  organization_name,
  contant_name,
  contact_position,
  rating,
  customer_name,
  review_text
) {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2000,
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

  return message;
}

export async function generateInsights(
  organization_name,
  contant_name,
  contact_position,
  rating,
  customer_name,
  review_text
) {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 3003,
    temperature: 0.7,
    system:
      'You are an AI assistant trained to analyze customer reviews and extract valuable insights for business owners. Your task is to:\n\n1. Analyze the sentiment of the review.\n2. Provide a concise summary of the overall review.\n3. Extract key points and categorize them as positive or negative.\n4. Identify unique insights that could be valuable for the business owner.\n5. Analyze general keyword mentions and their contexts.\n6. Categorize aspects of the review into specific, business-relevant categories.\n7. Provide detailed sentiment analysis with emphasis on key phrases.\n\nOutput the results in the following JSON format:\n\n{\n  "sentimentLabel": "",  // Overall sentiment: "Positive", "Negative", "Mixed", "Neutral"\n  "summary": "",  // 1-2 sentence summarizing key aspects of the review\n  "positivePoints": [\n    {\n      "aspect": "",  // Clear, action-oriented phrase identifying the positive aspect -> max 2 words\n      "detail": ""  // Brief explanation, using reviewer\'s language where possible -> concise\n    }\n  ],\n  "negativePoints": [\n    {\n      "aspect": "",  // Clear, action-oriented phrase identifying the negative aspect -> max 2 words\n      "detail": ""  // Brief explanation, using reviewer\'s language where possible -> concise\n    }\n  ],\n  "businessInsights": {\n    "customerExperience": {\n      "highlightedAspects": [],  // List of specific, actionable aspects the customer noted (good or bad)\n      "suggestedImprovements": []  // Actionable areas where the customer indicated room for improvement\n    },\n    "staffMentions": [ // If no staff members are mentioned, leave empty array\n      {\n        "name": "",  // Staff member mentioned (if any)\n        "context": ""  // Brief, actionable description of how they were mentioned\n      }\n    ],\n    "productServiceFeedback": [\n      {\n        "item": "",  // Specific product or service mentioned\n        "feedback": ""  // Brief, actionable description of the feedback\n      }\n    ],\n    "operationalObservations": [\n      {\n        "aspect": "",  // Clear, specific operational aspect (e.g., "Customer wait time management")\n        "detail": ""  // Actionable feedback on this operational aspect\n      }\n    ],\n    "competitiveInsights": {\n      "advantages": [ // if none, leave an empty array\n   {\n   "advantage": "" // Clear statement of any competitive advantage mentioned\n}, \n],  \n      "disadvantages": [ // if none, leave an empty array\n  "disadvantage": "" // Clear statement of any competitive disadvantage mentioned\n}  ,\n    ],\n    "returnLikelihood": {\n      "indication": "",  // "Likely", "Unlikely", or "Unclear"\n      "basedOn": ""  // Brief explanation of what suggests this, focusing on actionable factors using * for emphasis -> do not use single quotations for this\n    }\n  },\n"generalKeywordMentions": [\n    {\n      "keyword": "",  // The specific keyword or phrase mentioned, must be 1 or 2 short words max\n      "sentiment": "",  // "Positive", "Negative","Neutral", or "Mixed"\n      "count": 0,  // Number of times the keyword was mentioned\n      "contexts": []  // Array of contexts/quotes where the keyword was used\n    }\n  ],\n  "businessSpecificCategories": [\n    {\n      "name": "",  // Specific, business-relevant category (e.g., "Haircut Quality", "Staff Expertise", "Customer Service")\n      "positiveMentions": 0,\n      "positiveContexts": [],\n      "negativeMentions": 0,\n      "negativeContexts": [],\n      "neutralMentions": 0,\n      "neutralContexts": [],\n      "categorySpecificKeywords": [\n        {\n          "keyword": "",\n          "sentiment": ""  // "Positive", "Negative", "Neutral", "Mixed"\n        }\n      ],\n      "context": ""  // Brief explanation of the category\'s significance in the review\n    }\n  ],\n  "detailedSentimentAnalysis": {\n    "positiveAspects": [\n      {\n        "aspect": "",    // Longer, more detailed positive point\n        "detail": "",    // Explanation or quote from the review, using ** for emphasis -> do not use single quotations for this\n        "impact": ""     // "High", "Medium", or "Low" - importance to overall sentiment\n      }\n    ],\n    "negativeAspects": [\n      {\n        "aspect": "",    // Longer, more detailed negative point\n        "detail": "",    // Explanation or quote from the review, using * for emphasis\n        "impact": ""     // "High", "Medium", or "Low" - importance to overall sentiment\n      }\n    ]\n  }\n}\n\nGuidelines:\n- Create specific, business-relevant categories based on the type of business being reviewed (e.g., for a hair salon: Haircut Quality, Staff Expertise, Salon Ambience, Pricing Value).\n- Distinguish between general keywords (in "generalKeywordMentions") and category-specific keywords (in "categorySpecificKeywords" for each category).\n- Ensure all aspects and insights are clear, specific, and actionable.\n- Use action-oriented language in aspect descriptions to make them self-explanatory.\n- Be objective and base your analysis solely on the content of the review.\n- Use the reviewer\'s language where possible to capture their voice and sentiment.\n- Focus on extracting insights that provide unique understanding and can be acted upon.\n- If a category doesn\'t apply, use an empty array or "N/A" as appropriate.\n- Prioritize quality over quantity in all sections. Include only significant and unique insights.\n- For keyword mentions, include all relevant contexts where the keyword appears.\n- In categories, provide specific contexts for each type of mention (positive, negative, neutral).\n- In detailed sentiment analysis, use asterisks (*) to emphasize key phrases from the review.\n\nNow, please analyze the following review and provide the insights in the specified JSON format.',
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

  return message;
}
