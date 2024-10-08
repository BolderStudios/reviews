import supabase from "@/utils/supabaseClient";
import Anthropic from "@anthropic-ai/sdk";

// Anthropic SDK
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});

// Update fetching status of reviews from DataForSEO
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

// Update fetch error message during reviews fetching from DataForSEO
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

// When Yelp connection is configured, update the selected location with Yelp profile URL
export async function updateSelectedLocation(
  locationId,
  yelpProfileUrl = "",
  googlePlaceId = "",
  coordinates
) {
  if (yelpProfileUrl !== "") {
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
  }

  if (googlePlaceId !== "" && coordinates !== "") {
    const { data, error } = await supabase
      .from("locations")
      .update({
        is_google_configured: true,
        google_place_id: googlePlaceId,
        google_place_coordinates: coordinates,
      })
      .eq("id", locationId);

    if (error) {
      console.error("Error updating selected location:", error);
      return { success: false };
    }
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

// Generates review response using Anthropic API
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
      'TONE: <tone>charismatic and friendly, less formal, less corporate, more personal</tone>\nCRITICAL: Never use these phrases under any circumstances\n<phrases_not_to_use>"top priority"\n"If you decide to visit us again, don\'t hesitate to..."\nAny phrase suggesting the customer should remind the business about past issues\n"aim for"\n"what we aim for"\n"strive for"\n"We always aim to..."\n"We always strive to..."\nAny phrase starting with "We always..."\n"If you visit us again, feel free to..."\nAny phrase suggesting customers should make special requests for standard service\n"I hear you on [something]"\n"Your feedback helps us improve."\n"It\'s clear we fell short"\n"we pride ourselves"\n"really shines through"\n"wow"\n"Wow"\n"we\'re always"\n"we always"\n"I\'m thrilled"\n"I\'m glad"\n"it\'s not an excuse"\n"we\'re deeply troubled"\n"we\'re deeply [something]"\n"doesn\'t align with [something]"\n"I appreciate you"\n"We take pride"\n"I\'d like to make this right. If you\'re willing"\n"You\'re absolutely right – we should"\n"I\'m truly sorry"\n"I sincerely apologize"\n"I couldn\'t help but chuckle"\n"we dropped the ball"\n"I\'m deeply concerned"\n"usually pride ourselves"\n"That\'s not how we like to operate"\n"you\'re right"\n"We\'re so glad"\n"It\'s great to hear"\n"We\'re thrilled"\n" deeply concerning"\n"concerned"\n"[something] really shines through!"\n"[someone] will be thrilled to"\n"[someone\'s] knack for [something]"</phrases_not_to_use>\n\nAVOID MENTIONING ANY NAMES OF EMPLOYEES \n\nPositive responses length: 3-5 sentences.\nNegative responses length: 3-8 sentences.\n\nYou are an AI assistant trained to write personalized, empathetic, and varied responses to customer reviews for personal service businesses. Craft responses that sound natural, friendly, and human-like, avoiding robotic or generic language. \n\nKey Guidelines:\n\nAvoid generic expressions of happiness or satisfaction like "We\'re so glad," "It\'s great to hear," or "We\'re thrilled."\n\nInstead of general expressions of happiness, relate the customer\'s experience to a single specific aspect of the business or services.\n\nAvoid suggesting that customers need to take extra steps or make special requests to receive good service\nDon\'t imply that customers need to remind staff about standard practices or preferences\n\nOpenings:\n- IMPORTANT: Do NOT use any generic opening statements. This includes:\n  * Making personal observations about the reviewer\'s comments\n  * "I\'m thrilled you had such a fantastic time at [Business Name]!"\n  * "Thank you for your review."\n  * Commenting on their experience in a general way\n  * "We appreciate your feedback."\n  * "I\'m [manager\'s name], and I\'m glad you visited us."\n  * "Your experience at M & N Automotive is exactly what we aim for with every customer."\n  * "Your experience at M & N Automotive is music to our ears."\n  * "I\'m deeply concerned about your experience with our Mercedes repair service."\n  * "It\'s clear we fell short of providing"\n- Open with Hi, Customer name\n- Get straight to the point.\n- Avoid any form of general acknowledgment or thanks at the beginning of the response.\n- Do not give introductions of the business owner or manager. \n- Use extremely minimal humor where necessary but don\'t sound cliche.\n\nWhen responding to negative reviews, use a variety of openings that acknowledge the issue without being generic. Here are some examples to alternate between:\n\n"I\'m sorry to hear about the difficulties you encountered during your visit."\n"Thank you for bringing these issues to our attention."\n"We take your feedback seriously and appreciate you sharing your experience."\n"I can understand your frustration with the service you received."\n"Your description of what happened during your appointment is troubling to us."\n"We value your honest feedback about your recent experience."\n"I regret that your visit didn\'t meet the standards we set for ourselves."\n"Your dissatisfaction with our service is a matter of great concern to us."\n"We\'re disappointed to learn about the problems you faced during your appointment."\n"Your experience is not representative of the service we aim to provide."\n\nRemember to tailor these openings to the specific situation described in the review. Avoid using the same opening repeatedly across different responses.\n\nResponse suggestions:\n\n- "IMPORTANT: Never mention specific employee names or titles in responses. Always refer to staff collectively (e.g., "our team," "our staff"). This rule applies even if the reviewer mentions an employee by name."\n- Focus on natural and conversational flow as if you are talking to someone in real life. Use transitions to connect ideas smoothly.\n- Focus only on one key point from the review rather than trying to address everything.\n\nCritical Thinking:\n- When addressing negative feedback, don\'t resort to generic claims about business practices. Focus on the specific situation and how it can be improved.\n- Don\'t automatically assume all claims in negative reviews are true.\n- Consider possible alternative explanations for the customer\'s experience.\n- If a review makes serious or any type of allegations, respond carefully without admitting fault.\n- Avoid directly contradicting the customer, but don\'t admit to actions that seem unlikely or go against standard business practices.\n\nFor positive reviews, don\'t just list all mentioned good things, address only one. No need to talk about every single positive mention.Do not mention specific employees by name or title. Refer to staff collectively\n\nAim for responses between 3-5 sentences.\nResponses to extremely positive reviews could be left short.\n\nVary the order of addressing points. Don\'t always start with an apology or acknowledgment. Mix up the flow to keep responses feeling natural and tailored to a review.\n\nIncorporate the reviewer\'s language or style when appropriate.\n   - Greet the customer and add a closing signature.\n   - Use conversational language, including colloquialisms and contractions\n   - Personalize based on review content\n   - Vary the structure and order of response elements\n   - Incorporate emotion and empathy\n   - Add conditional statements to sound less scripted\n   - Limit saying it\'s to maximum of 2\n   - Never say "We take pride" or "wow" or "You\'re right"\n   - Never start one sentence after another with "It\'s" then "I\'m" then "We" then "We\'re". Use transition words to flow.\n   - Avoid blanket statements about what the business "always" does, especially in response to criticism\n   - Instead of defending with "always" statements, focus on addressing the specific instance mentioned in the review\n\n\nContent:\n   - Be specific in addressing the reviewer\'s point — address only one main point\n   - Include a call-to-action (e.g., invitation to return, contact information)\n   - Incorporate industry-specific language where appropriate \n\nClosing: Vary your call-to-action and closing statements. \n\nConclusions and Closing Statements:\n   - Avoid overused phrases like "I\'m disheartened," "I\'m disappointed," "I\'m particularly concerned," or "If you\'re open to it."\n   - Craft unique closing statements that reflect the specific situation and tone of the review.\n   - Don\'t always end with an invitation to return or an offer to make things right. Sometimes, a simple acknowledgment or thank you is sufficient.\n   - Use varied language to express regret, appreciation, or hope for future interactions.\n   - Consider ending with a forward-looking statement that doesn\'t necessarily require action from the reviewer.\n\nOverall Response Structure:\n    - Avoid falling into a predictable pattern across responses (e.g., always starting with an apology or ending with an invitation).\n    - Mix up the order in which you address points, express empathy, offer solutions, or share business insights.\n    - Avoid structures where you apologize first, then thank the customer or structures where you apologize first, then insert a filler sentence, and then thank the customer. You\'ve got to pick one, either apologize and lead response in that direction, or thank the customer. Or mixing acknowledging bad and good things without proper sentence connection.\n    - Moreover, avoid starting sentences with It\'s great or I\'m glad repeatedly. \n    - Stop saying: "[something] shines through!", instead find another approach of saying the same thing\n    - Stop saying: "[someone] will be thrilled to ", instead find another approach of saying the same thing\n    - Stop saying: "[someone\'s] knack for [something] ", instead find another approach of saying the same thing\n\nEmpathy in Responses:\n\nAlways acknowledge the customer\'s feelings and experience, especially for negative reviews.\nUse phrases that show understanding, such as \'I understand how frustrating/disappointing/upsetting that must have been.\'\nReflect the tone and emotion of the review in your response.\n\nHandling Serious Allegations:\n\nRespond with concern, but don\'t admit fault for serious claims without investigation.\nExpress a desire to look into the matter thoroughly.\nInvite the customer to discuss the issue privately for more details.\nMention relevant general policies or safety measures without directly contradicting the customer.\nIf appropriate, note that the described situation is unusual or contrary to standard practices.\n\nRemember:\n- I may include background information that you\'d have to rely on\n- Responses should imply that good service is standard, not something customers need to specially request\n- Offer some simple and not expensive complementary service wherever necessary\n- Vary statements about a possible return by a client\n- Avoid choppy sentence structure. \n- Avoid suggesting customers should remind you about past issues and instead say that we will improve on future visits or Any phrase suggesting the customer should remind the business about past issues:\n- Each response should feel unique and tailored\n- Prioritize a natural, conversational tone\n- It\'s okay to leave some points unaddressed\n- Avoid overused phrases and generic language\n- Double-check your response to ensure it doesn\'t contain any phrases from the "Phrases not to use" list\n- Before submitting your response, carefully review it to ensure you haven\'t used any phrases from the "Phrases not to use" list. If you find any, rephrase those parts of the response.\n- Balance addressing customer concerns with protecting the business\'s reputation.\n- For serious allegations, prioritize gathering information over immediate solutions.\n\nDouble-check your response to ensure you haven\'t mentioned any staff names or specific titles. Replace any names with collective terms.\n\nBefore submitting your response:\n\n - Check for phrases from the "Do not use" list\n - After writing your response, review it for overall flow and coherence. Ensure it reads like a natural, fluid conversation rather than a series of disjointed statements.\n - Ensure no staff names or specific titles are mentioned\n - Review for overall flow and coherence\n\nNow, write a response to the following review, keeping these guidelines in mind.',
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${contact_position}'s Name: ${contant_name}\nBusiness's Name: ${organization_name}\nRating: ${rating} star \nCustomer's Name: ${customer_name}\nCustomer's Review: ${review_text}`,
          },
        ],
      },
    ],
  });

  return message;
}

// Generates insights from a review text using the Anthropics API
export async function generateInsights(review_text) {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 3003,
    temperature: 0.7,
    system:
      'You are an AI assistant trained to analyze customer reviews and extract valuable insights for business owners. Your task is to:\n\n1. Analyze the sentiment of the review.\n2. Provide a concise summary of the overall review.\n3. Extract key points and categorize them as positive or negative.\n4. Identify unique insights that could be valuable for the business owner.\n5. Analyze general keyword mentions and their contexts.\n6. Categorize aspects of the review into specific, business-relevant categories.\n7. Provide detailed sentiment analysis with emphasis on key phrases.\n\nSummary must be concise and straight to the point. Quality over quantity matters more. Each keyword must be self-explanatory, so when a user looks at it, they would know what it meant. All outputs must be concise. If a keyword says something like "strong" or "pristine", this is bad because I don\'t know what was strong. positive, negative, mixed mentions can stay as descriptive because I use them to highlight text in a review.\n\nPositive, negative, mixed contexts in mentions must be kept the same as they are taken from the review itself and will be used to highlight each one with an associated color inside a review card.\n\nFor business specific categories, only use the following predefined list. Do not create or use any categories outside of this list:\n\n- Property\n- Staff\n- Location\n- Rooms\n- Food & Beverage (F&B)\n- Public Areas & Atmosphere\n- Housekeeping\n- Value for Money\n- Parking\n- Front Office\n- Service Quality\n- Customer Service\n- Product Quality\n- Pricing\n- Timeliness & Efficiency\n- Cleanliness & Hygiene\n- Booking\n- Results\n- Communication\n- Staff Conduct\n- Menu\n- Food\n- Drinks\n- Accessibility\n- Decor\n\nWhen categorizing aspects of the review:\n- Map all specific mentions to these broad categories.\n- Do not create new categories or subcategories.\n- If an aspect doesn\'t clearly fit into one of these categories, choose the most relevant one.\n- Include detailed insights within each category rather than creating new ones.\n\nEnsure that all insights, no matter how specific, are assigned to one of these eight categories. This approach will maintain consistency and prevent category proliferation.\n\nHere are some examples of how to improve some of the keywords:\n\nInstead of:\n- Mouthwatering\n- Flavorless\n- Amazing\n- Hard\n- Bland\n\nUse:\n- Mouthwatering pizza\n- Flavorless meatballs\n- Amazing flavor combinations\n- Hard, overcooked pasta\n- Bland, under-seasoned fish\n\nFor dishes like "Caesar salad," we could improve it to:\nFresh, crisp Caesar salad\nOverdressed Caesar salad\nUnique Caesar salad twist\n\nMore examples of improved, actionable keywords:\nPerfectly crispy pizza crust\nInnovative ingredient pairings\nTender, well-seasoned octopus\nOvercooked, dry swordfish\nBalanced spice levels in dishes\nGenerous, shareable portions\nInconsistent food temperature\nCreative vegetarian options\nAuthentic Italian flavors\nExpertly grilled meats\nInnovative dessert presentation\nFresh, high-quality ingredients\nPerfectly al dente pasta\nOverly salty dishes\nUnique wood-fired pizza taste\n\nThese improved keywords provide more context and actionable information for the business owner. They describe specific aspects of the food that can be maintained if positive or improved if negative.\n\nAlways pair descriptive words with the item they\'re describing.\nFocus on specific, actionable qualities of the food.\nUse compound phrases to provide full context.\nEnsure each keyword gives clear, actionable feedback about the food quality.\n\n\nOutput the results in the following JSON format:\n\n{\n  "sentimentLabel": "",  // Overall sentiment: "Positive", "Negative", "Mixed",\n  "summary": "",  // 1-2 sentence summarizing key aspects of the review, omit "the customer" —> get straight to the point —> use simple language\n  "peopleLove": [\n    // List aspects or features that customers consistently praise or express strong positive feelings about.\n    // Use specific, enthusiastic language reflecting actual customer sentiments.\n    ""\n  ],\n  "peopleHate": [\n    // List aspects or features that customers strongly dislike or express intense negative feelings towards.\n    // Focus on major issues that significantly impact customer satisfaction.\n    ""\n  ],\n  "peopleDontLike": [\n    // List aspects or features that customers have mild to moderate negative feelings about, not as intense as "hate".\n    // Include minor annoyances or disappointments that detract from the overall experience.\n    ""\n  ],\n  "peoplesPains": [\n    // List specific problems, inconveniences, or frustrations that customers frequently experience or mention.\n    // Focus on recurring issues that affect multiple customers.\n    ""\n  ],\n  "reviewTopics": [\n    {\n      "topic": "", // Single word representing a key theme from reviews\n      "count": 0 // Number of times this topic appears in reviews\n    }\n    // List most frequent topics mentioned in reviews, sorted by count in descending order\n  ],\n  "highlightedWords": [\n    {\n   "name": "",  // Single words or 1-2 words\n   "sentiment": "" // "Positive", "Negative", "Mixed"\n  },\n    // List most associated words or phrases from reviews\n  ],\n "needsImprovement": [\n  {\n    "name": "", // Concise title for the issue (1-5 words)\n    "summary": "", // Concise summary of the issue in a tone similar to \'Long waiting time during check-in\' highlighting the issue and not offering a solution\n    "excerpt": "", // Excerpt from a customer review\n    "suggestion": "", // Offer a concise solution\n  }\n],\n  "businessInsights": {\n      "strengths": [],  // List of specific, actionable strengths the customer noted -> 1-3 words max\n      "weaknesses:" : [], // List of specific, actionable weaknesses the customer noted -> 1-3 words max\n    "staffMentions": [ // If no staff members are mentioned, leave empty array\n      {\n        "name": "",  // Staff member mentioned (if any), if mentioned and unnamed, say "Staff"\n        "context": "",  // Brief, actionable description of how they were mentioned -> be extremely concise, don\'t use filler words\n        "sentiment": ""  // "Positive", "Negative", "Mixed"\n      }\n    ],\n    "productServiceFeedback": [\n      {\n        "item": "",  // Specific product or service mentioned -> 1-2 words max, must be careful here —> for example, \'Powder manicure\', \'Manicure gel\', and \'Powder nails\' are the same service which is \'Manicure\'\n        "feedback": "",  // Brief, actionable description of the feedback\n        "sentiment": ""  // "Positive", "Negative", "Mixed"\n      }\n    ],\n    "competitiveInsights": {\n      "advantages": [ // if none, leave an empty array\n   {\n   "advantage": "", // Clear statement of any competitive advantage mentioned -> 3 words max\n   "context": "", // Excerpt from the review itself\n}, \n],  \n      "disadvantages": [ // if none, leave an empty array\n  "disadvantage": "", // Clear statement of any competitive disadvantage mentioned -> 3 words max\n  "context": "", // Excerpt from the review itself\n}  ,\n    ],\n    "returnLikelihood": {\n      "indication": "",  // "Likely", "Unlikely", or "Unclear"\n      "basedOn": ""  // Brief explanation of what suggests this, focusing on actionable factors using * for emphasis -> do not use single quotations for this -> 7 words max\n    }\n  },\n  "businessSpecificCategories": [\n    {\n      "name": "",  // Specific, business-relevant category (e.g., "Haircut Quality", "Staff Expertise", "Customer Service") -> 2 words max\n      "positiveMentions": 0,\n      "positiveContexts": [],\n      "negativeMentions": 0,\n      "negativeContexts": [],\n      "mixedMentions": 0,\n      "mixedContexts": [],\n      "categorySpecificKeywords": [\n        {\n          "keyword": "", // -> must be easy to understand what each keyword refers to, if thin, then what was thin, and so on -> Use compound phrases instead of single words when necessary to provide context. Include the item or aspect being described in the keyword. Focus on actionable qualities that can be improved or maintained.\n          "sentiment": ""  // "Positive", "Negative"\n        }\n      ],\n      "context": ""  // Brief explanation of the category\'s significance in the review\n    }\n  ],\n  "detailedSentimentAnalysis": { -> these positive and negative aspects must be related to the customer\'s experience with the business\n    "positiveAspects": [\n      {\n        "aspect": "",    // Longer, more detailed positive point -> 2-3 words max\n        "detail": "",    // Explanation or quote from the review, using ** for emphasis -> do not use single quotations for this -> make it super concise\n        "impact": ""     // "High", "Medium", or "Low" - importance to overall sentiment\n      }\n    ],\n    "negativeAspects": [\n      {\n        "aspect": "",    // Longer, more detailed negative point -> 2-3 words max\n        "detail": "",    // Explanation or quote from the review, using * for emphasis -> make it super concise\n        "impact": ""     // "High", "Medium", or "Low" - importance to overall sentiment\n      }\n    ]\n  },\n}\n\nGuidelines:\n- Create specific, business-relevant categories based on the type of business being reviewed (e.g., for a hair salon: Haircut Quality, Staff Expertise, Salon Ambience, Pricing Value).\n- Distinguish between general keywords (in "generalKeywordMentions") and category-specific keywords (in "categorySpecificKeywords" for each category).\n- Ensure all aspects and insights are clear, specific, and actionable.\n- Use action-oriented language in aspect descriptions to make them self-explanatory.\n- Be objective and base your analysis solely on the content of the review.\n- Use the reviewer\'s language where possible to capture their voice and sentiment.\n- Focus on extracting insights that provide unique understanding and can be acted upon.\n- If a category doesn\'t apply, use an empty array or "N/A" as appropriate.\n- Prioritize quality over quantity in all sections. Include only significant and unique insights.\n- For keyword mentions, include all relevant contexts where the keyword appears.\n- In categories, provide specific contexts for each type of mention (positive, negative, neutral).\n- In detailed sentiment analysis, use asterisks (*) to emphasize key phrases from the review.\n\nNow, please analyze the following review and provide the insights in the specified JSON format.',
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Customer's Review: ${review_text}`,
          },
        ],
      },
    ],
  });

  return message;
}

// Update to work for google as well
export async function storeReview(
  review,
  insights,
  locationId,
  clerkId,
  generated_response,
  source
) {
  try {
    console.log("Storing review -> ", review);

    const { data: inserted_review, error: inserted_review_error } =
      await supabase
        .from("reviews")
        .insert([
          {
            location_id: locationId,
            source_review_id: review.review_id,
            timestamp:
              source === "yelp"
                ? review.timestamp.split("T")[0]
                : review.timestamp.split(" ")[0],
            rating: review.rating.value,
            review_text: review.review_text,
            customer_name:
              source === "yelp"
                ? review.user_profile.name
                : review.profile_name,
            customer_profile_url:
              source === "yelp" ? review.user_profile.url : review.profile_url,
            customer_image_url:
              source === "yelp"
                ? review.user_profile.image_url
                : review.profile_image_url,
            review_url: source === "yelp" ? null : review.review_url,
            has_responded_to:
              source === "yelp"
                ? review.responses === null
                  ? false
                  : true
                : review.owner_answer === null
                ? false
                : true,
            source: source,
            sentiment: insights === null ? null : insights.sentimentLabel,
            summary: insights === null ? null : insights.summary,
            generated_response:
              generated_response === null ? null : generated_response,
            return_likelihood:
              insights === null
                ? null
                : insights.businessInsights?.returnLikelihood?.indication ||
                  null,
            response_text:
              source === "yelp"
                ? review.responses === null
                  ? null
                  : review.responses[0].text
                : review.owner_answer === null
                ? null
                : review.owner_answer,
            response_timestamp:
              source === "yelp"
                ? review.responses === null
                  ? null
                  : review.responses[0].timestamp.split(" ")[0]
                : review.owner_timestamp === null
                ? null
                : review.owner_timestamp,
          },
        ])
        .select("*");

    if (inserted_review_error) {
      console.log("Error inserting review -> ", inserted_review_error);
      throw inserted_review_error;
    } else {
      console.log("Inserted Review -> ", inserted_review);
    }

    if (source === "yelp") {
      const reviewImages = review?.review_images;

      if (reviewImages && reviewImages.length > 0) {
        for (const image of reviewImages) {
          const { data: inserted_image, error: inserted_image_error } =
            await supabase
              .from("review_images")
              .insert([
                {
                  review_id: inserted_review[0].id,
                  single_image_url: image,
                  alt_text: null,
                  all_images_url: null,
                },
              ])
              .select("*");

          if (inserted_image_error) throw inserted_image_error;

          console.log("Inserted Image -> ", inserted_image);
        }
      }
    } else {
      const reviewImages = review?.images;

      if (reviewImages && reviewImages.length > 0) {
        for (const image of reviewImages) {
          const { data: inserted_image, error: inserted_image_error } =
            await supabase
              .from("review_images")
              .insert([
                {
                  review_id: inserted_review[0].id,
                  single_image_url: image.image_url,
                  alt_text: image.alt,
                  all_images_url: image.url,
                },
              ])
              .select("*");

          if (inserted_image_error) throw inserted_image_error;

          console.log("Inserted Image -> ", inserted_image);
        }
      }
    }

    // Process businessSpecificCategories
    if (
      insights.businessSpecificCategories &&
      insights.businessSpecificCategories.length > 0
    ) {
      for (const category of insights.businessSpecificCategories) {
        const { data: inserted_category, error: inserted_category_error } =
          await supabase
            .from("business_categories")
            .insert([
              {
                review_id: inserted_review[0].id,
                location_id: locationId,
                name: category.name,
                context: category.context,
                positive_mentions: category.positiveMentions,
                negative_mentions: category.negativeMentions,
                mixed_mentions: category.mixedMentions,
              },
            ])
            .select("*");

        if (inserted_category_error) throw inserted_category_error;

        console.log("Inserted Category -> ", inserted_category);

        // Process contexts (into business_category_mentions table)
        await Promise.all([
          ...(category.positiveContexts || []).map((context) =>
            insertContext(
              inserted_review[0].id,
              inserted_category[0].id,
              context,
              "positive"
            )
          ),
          ...(category.negativeContexts || []).map((context) =>
            insertContext(
              inserted_review[0].id,
              inserted_category[0].id,
              context,
              "negative"
            )
          ),
          ...(category.mixedContexts || []).map((context) =>
            insertContext(
              inserted_review[0].id,
              inserted_category[0].id,
              context,
              "mixed"
            )
          ),

          // Process keywords (into keywords table)
          ...(category.categorySpecificKeywords || []).map((keyword) =>
            insertKeyword(
              inserted_review[0].id,
              inserted_category[0].id,
              keyword,
              locationId
            )
          ),
        ]);
      }
    }

    // Process detailed sentiment analysis
    if (insights.detailedSentimentAnalysis) {
      await Promise.all([
        ...(insights.detailedSentimentAnalysis.positiveAspects || []).map(
          (aspect) =>
            insertDetailedAspect(
              inserted_review[0].id,
              aspect,
              "positive",
              locationId
            )
        ),
        ...(insights.detailedSentimentAnalysis.negativeAspects || []).map(
          (aspect) =>
            insertDetailedAspect(
              inserted_review[0].id,
              aspect,
              "negative",
              locationId
            )
        ),
      ]);
    }

    console.log("Insights: ", insights);

    // Process strengths
    if (insights.businessInsights.strengths.length > 0) {
      await Promise.all(
        insights.businessInsights.strengths.map((strength) =>
          insertStrength(inserted_review[0].id, locationId, strength)
        )
      );
    }

    // Process weaknesses
    if (insights.businessInsights.weaknesses.length > 0) {
      await Promise.all(
        insights.businessInsights.weaknesses.map((weakness) =>
          insertWeakness(inserted_review[0].id, locationId, weakness)
        )
      );
    }

    // Process what people love (into people_love table)
    if (insights.peopleLove) {
      await Promise.all(
        insights.peopleLove.map((love) =>
          insertPeopleLove(inserted_review[0].id, locationId, love)
        )
      );
    }

    // Process what people hate (into people_hate table)
    if (insights.peopleHate) {
      await Promise.all(
        insights.peopleHate.map((hate) =>
          insertPeopleHate(inserted_review[0].id, locationId, hate)
        )
      );
    }

    // Process what people don't like (into people_dont_like table)
    if (insights.peopleDontLike) {
      await Promise.all(
        insights.peopleDontLike.map((dontLike) =>
          insertPeopleDontLike(inserted_review[0].id, locationId, dontLike)
        )
      );
    }

    // Process what people's pains are (into peoples_pains table)
    if (insights.peoplesPains) {
      await Promise.all(
        insights.peoplesPains.map((pain) =>
          insertPeoplesPain(inserted_review[0].id, locationId, pain)
        )
      );
    }

    // Process review topics (into review_topics table)
    if (insights.reviewTopics) {
      await Promise.all(
        insights.reviewTopics.map((topic) =>
          insertReviewTopic(inserted_review[0].id, topic)
        )
      );
    }

    // Process highlighted words (into highlighted_words table)
    if (insights.highlightedWords) {
      await Promise.all(
        insights.highlightedWords.map((word) =>
          insertHighlightedWord(inserted_review[0].id, locationId, word)
        )
      );
    }

    // Process what needs improvement (into needs_improvement table)
    if (insights.needsImprovement) {
      await Promise.all(
        insights.needsImprovement.map((improvement) =>
          insertNeedsImprovement(inserted_review[0].id, locationId, improvement)
        )
      );
    }

    // Process staff mentions
    if (insights.businessInsights && insights.businessInsights.staffMentions) {
      await Promise.all(
        insights.businessInsights.staffMentions
          .filter(
            (mention) => mention.name && mention.name.toLowerCase() !== "n/a"
          )
          .map((mention) =>
            insertStaffMention(inserted_review[0].id, locationId, mention)
          )
      );
    }

    // Process product/service feedback
    if (
      insights.businessInsights &&
      insights.businessInsights.productServiceFeedback
    ) {
      await Promise.all(
        insights.businessInsights.productServiceFeedback.map((feedback) =>
          insertProductServiceFeedback(
            inserted_review[0].id,
            locationId,
            feedback
          )
        )
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error in storeReview:", error);
    return { success: false, error: error.message };
  }
}

// Insert what needs improvement into needs_improvement table
async function insertNeedsImprovement(reviewId, locationId, improvement) {
  try {
    const { data, error } = await supabase
      .from("needs_improvement")
      .insert([
        {
          review_id: reviewId,
          location_id: locationId,
          label: improvement.name,
          summary: improvement.summary,
          review_excerpt: improvement.excerpt,
          suggestion: improvement.suggestion,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted Needs Improvement -> ", data);
  } catch (error) {
    console.error("Error inserting needs improvement -> ", error);
  }
}

// Insert highlighted words into highlighted_words table
async function insertHighlightedWord(reviewId, locationId, word) {
  try {
    const { data, error } = await supabase
      .from("highlighted_words")
      .insert([
        {
          review_id: reviewId,
          location_id: locationId,
          word: word.name,
          sentiment: word.sentiment,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted Highlighted Word -> ", data);
  } catch (error) {
    console.error("Error inserting highlighted word -> ", error);
  }
}

// Insert review topics into review_topics table
async function insertReviewTopic(reviewId, topic) {
  try {
    const { data, error } = await supabase
      .from("review_topics")
      .insert([
        {
          review_id: reviewId,
          topic: topic.topic,
          count: topic.count,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted Review Topic -> ", data);
  } catch (error) {
    console.error("Error inserting review topic -> ", error);
  }
}

// Insert what people love into people_love table
async function insertPeopleLove(reviewId, locationId, love) {
  try {
    const { data, error } = await supabase
      .from("people_love")
      .insert([
        {
          review_id: reviewId,
          location_id: locationId,
          label: love,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted People Love -> ", data);
  } catch (error) {
    console.error("Error inserting people love -> ", error);
  }
}

// Insert what people hate into people_hate table
async function insertPeopleHate(reviewId, locationId, hate) {
  try {
    const { data, error } = await supabase
      .from("people_hate")
      .insert([
        {
          review_id: reviewId,
          location_id: locationId,
          label: hate,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted People Hate -> ", data);
  } catch (error) {
    console.error("Error inserting people hate -> ", error);
  }
}

// Insert what people don't like into people_dont_like table
async function insertPeopleDontLike(reviewId, locationId, dontLike) {
  try {
    const { data, error } = await supabase
      .from("people_dont_like")
      .insert([
        {
          review_id: reviewId,
          location_id: locationId,
          label: dontLike,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted People Don't Like -> ", data);
  } catch (error) {
    console.error("Error inserting people don't like -> ", error);
  }
}

// Insert what people's pains are into peoples_pains table
async function insertPeoplesPain(reviewId, locationId, pain) {
  try {
    const { data, error } = await supabase
      .from("peoples_pains")
      .insert([
        {
          review_id: reviewId,
          location_id: locationId,
          label: pain,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted Peoples Pain -> ", data);
  } catch (error) {
    console.error("Error inserting peoples pain -> ", error);
  }
}

// Insert strength into strengths table
async function insertStrength(reviewId, locationId, strength) {
  try {
    const { data, error } = await supabase
      .from("strengths")
      .insert([
        {
          review_id: reviewId,
          location_id: locationId,
          strength: strength,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted Strength -> ", data);
  } catch (error) {
    console.error("Error inserting strength -> ", error);
  }
}

// Insert weakness into weaknesses table
async function insertWeakness(reviewId, locationId, weakness) {
  try {
    const { data, error } = await supabase
      .from("weaknesses")
      .insert([
        {
          review_id: reviewId,
          location_id: locationId,
          weakness: weakness,
        },
      ])
      .select("*");

    if (error) throw error;

    console.log("Inserted Weakness -> ", data);
  } catch (error) {
    console.error("Error inserting weakness -> ", error);
  }
}

// When fetching for reviews for a specific locaiton, we need to delete all existing reviews because current location ID is different
// Usually, the user won't be fetching reviews for a new location under the same location ID
export async function deleteReviewsForLocation(locationId, source) {
  try {
    const { data: existing_reviews, error: existing_reviews_error } =
      await supabase
        .from("reviews")
        .select("*")
        .eq("location_id", locationId)
        .eq("source", source);

    if (existing_reviews_error) {
      console.error("Error fetching existing reviews:", existing_reviews_error);
      return { success: false, error: existing_reviews_error.message };
    }

    if (!existing_reviews || existing_reviews.length === 0) {
      console.log("No existing reviews found for location", locationId);
      return { success: true, deletedCount: 0 };
    }

    console.log("Existing reviews for location", existing_reviews.length);

    const { data, error } = await supabase
      .from("reviews")
      .delete()
      .match({ location_id: locationId });

    if (error) throw error;

    console.log(`Deleted all reviews for location ${locationId}`);
    return { success: true, deletedCount: existing_reviews.length };
  } catch (error) {
    console.error(`Error deleting reviews for location ${locationId}:`, error);
    return { success: false, error: error.message };
  }
}

// Helper function to insert a row in business_category_mentions table
async function insertContext(reviewId, categoryId, context, sentiment) {
  if (!context) return null;
  const { data, error } = await supabase
    .from("business_category_mentions")
    .insert([
      {
        review_id: reviewId,
        business_category_id: categoryId,
        context: context,
        sentiment: sentiment,
      },
    ])
    .select("*");

  if (error) throw error;
  return data;
}

// Helper function to insert a row in keywords table
async function insertKeyword(reviewId, categoryId, keyword, location_id) {
  if (!keyword || !keyword.keyword) return null;

  const { data, error } = await supabase
    .from("keywords")
    .insert([
      {
        review_id: reviewId,
        business_category_id: categoryId,
        name: keyword.keyword,
        sentiment: keyword.sentiment,
        location_id: location_id,
      },
    ])
    .select("*");

  if (error) throw error;
  return data;
}

// Helper function to insert a row in detailed_aspects table
async function insertDetailedAspect(reviewId, aspect, sentiment, locationId) {
  if (!aspect || !aspect.aspect) return null;
  const { data, error } = await supabase
    .from("detailed_aspects")
    .insert([
      {
        review_id: reviewId,
        aspect: aspect.aspect,
        detail: aspect.detail,
        impact: aspect.impact,
        sentiment: sentiment,
        location_id: locationId,
      },
    ])
    .select("*");

  if (error) throw error;
  return data;
}

// Helper function to insert a row in staff_mentions table
async function insertStaffMention(reviewId, locationId, mention) {
  if (!mention || !mention.name || mention.name.toLowerCase() === "n/a")
    return null;
  const { data, error } = await supabase
    .from("staff_mentions")
    .insert([
      {
        review_id: reviewId,
        location_id: locationId,
        employee_name: mention.name,
        sentiment: mention.sentiment,
        context: mention.context,
      },
    ])
    .select("*");

  if (error) throw error;
  return data;
}

// Helper function to insert a row in product_service_feedback table
async function insertProductServiceFeedback(reviewId, locationId, feedback) {
  if (!feedback || !feedback.item) return null;
  const { data, error } = await supabase
    .from("product_service_feedback")
    .insert([
      {
        review_id: reviewId,
        location_id: locationId,
        item: feedback.item,
        sentiment: feedback.sentiment,
        feedback: feedback.feedback,
      },
    ])
    .select("*");

  if (error) throw error;
  return data;
}
