"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateIsFetching = updateIsFetching;
exports.updateFetchErrorMessage = updateFetchErrorMessage;
exports.updateSelectedLocation = updateSelectedLocation;
exports.getLocationInfo = getLocationInfo;
exports.generateResponse = generateResponse;
exports.generateInsights = generateInsights;
exports.storeReview = storeReview;

var _supabaseClient = _interopRequireDefault(require("@/utils/supabaseClient"));

var _sdk = _interopRequireDefault(require("@anthropic-ai/sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var anthropic = new _sdk["default"]({
  apiKey: process.env.ANTHROPIC_API_KEY // defaults to process.env["ANTHROPIC_API_KEY"]

});

function updateIsFetching(booleanState, clerkId) {
  var _ref, updatedUser, updatedUserError;

  return regeneratorRuntime.async(function updateIsFetching$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Updating fetch state to:", booleanState);
          console.log("User ID: ", clerkId);
          _context.next = 4;
          return regeneratorRuntime.awrap(_supabaseClient["default"].from("users").update({
            is_fetching: booleanState
          }).eq("clerk_id", clerkId));

        case 4:
          _ref = _context.sent;
          updatedUser = _ref.data;
          updatedUserError = _ref.error;

          if (!updatedUserError) {
            _context.next = 10;
            break;
          }

          console.error("Error updating user fetch state:", updatedUserError);
          return _context.abrupt("return", {
            success: false
          });

        case 10:
          return _context.abrupt("return", {
            success: true
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}

function updateFetchErrorMessage(errorMessage, clerkId) {
  var _ref2, error;

  return regeneratorRuntime.async(function updateFetchErrorMessage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Updating fetch error message to:", errorMessage);
          console.log("User ID: ", clerkId);
          _context2.next = 4;
          return regeneratorRuntime.awrap(_supabaseClient["default"].from("users").update({
            fetch_error_message: errorMessage
          }).eq("clerk_id", clerkId));

        case 4:
          _ref2 = _context2.sent;
          error = _ref2.error;

          if (!error) {
            _context2.next = 9;
            break;
          }

          console.error("Error updating fetch error message:", error);
          return _context2.abrupt("return", {
            success: false
          });

        case 9:
          return _context2.abrupt("return", {
            success: true
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function updateSelectedLocation(locationId, yelpProfileUrl) {
  var _ref3, data, error;

  return regeneratorRuntime.async(function updateSelectedLocation$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_supabaseClient["default"].from("locations").update({
            is_yelp_configured: true,
            yelp_profile_url: yelpProfileUrl
          }).eq("id", locationId));

        case 2:
          _ref3 = _context3.sent;
          data = _ref3.data;
          error = _ref3.error;

          if (!error) {
            _context3.next = 8;
            break;
          }

          console.error("Error updating selected location:", error);
          return _context3.abrupt("return", {
            success: false
          });

        case 8:
          return _context3.abrupt("return", {
            success: true
          });

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getLocationInfo(locationId) {
  var _ref4, data, error;

  return regeneratorRuntime.async(function getLocationInfo$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(_supabaseClient["default"].from("locations").select("*").eq("id", locationId).single());

        case 2:
          _ref4 = _context4.sent;
          data = _ref4.data;
          error = _ref4.error;

          if (!error) {
            _context4.next = 8;
            break;
          }

          console.error("Error fetching location info:", error);
          return _context4.abrupt("return", {
            success: false
          });

        case 8:
          return _context4.abrupt("return", {
            success: true,
            data: data
          });

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function generateResponse(organization_name, contant_name, contact_position, rating, customer_name, review_text) {
  var message;
  return regeneratorRuntime.async(function generateResponse$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 2000,
            temperature: 0.7,
            system: 'You are an AI assistant trained to write personalized, empathetic, and varied responses to customer reviews for personal service businesses. Craft responses that sound natural, friendly, and human-like, avoiding robotic or generic language.\n\nLanguage Variety:\n- Use the following phrases sparingly and only when appropriate: "top priority," "aim for," "strive for," "we pride ourselves," "we\'re always," "we always," "I\'m thrilled," "I\'m glad," "it\'s not an excuse," "we\'re deeply troubled," "I\'m thrilled," "we\'re deeply [something]," "doesn\'t align with [something]," "I appreciate you," "We take pride," "I\'d like to make this right. If you\'re willing," "You\'re absolutely right – we should," "I\'m truly sorry," "I sincerely apologize," "I couldn\'t help but chuckle," "dropped the ball," "I\'m deeply concerned."\n- Avoid starting consecutive sentences with similar expressions.\n- Diversify your vocabulary and phrasing to maintain a fresh, genuine tone in each response.\n\nKey Guidelines:\n\nOpenings:\n- IMPORTANT: Do NOT use any generic opening statements. This includes, but is not limited to:\n  * Making personal observations about the reviewer\'s comments\n  * "I\'m thrilled you had such a fantastic time at [Business Name]!"\n  * "Thank you for your review."\n  * Commenting on their experience in a general way\n  * "We appreciate your feedback."\n  * "I\'m [manager\'s name], and I\'m glad you visited us."\n- Instead, start your response by directly addressing a specific point from the review.\n- Your first sentence should reference a detail from the customer\'s experience.\n- Avoid any form of general acknowledgment or thanks at the beginning of the response.\n- Do not give introductions of the business owner or manager. \n\nRemember: The goal is to make the customer feel heard by immediately engaging with the content of their review.\n\n2. Brevity: Aim for concise responses. Longer isn\'t always better; a short, focused response can be more impactful.\n\n3. Natural Flow: Write as if you\'re having a real conversation. Use transitions to connect ideas smoothly.\n\n4. Structure: Vary the order of addressing points. Don\'t always start with an apology or acknowledgment. Mix up the flow to keep responses feeling natural and unique.\n\n5. Style: Use more "I" statements instead of "we" to make responses feel more personal. Incorporate the reviewer\'s language or style when appropriate.\n   - Greet the customer and add a closing signature.\n   - Vary opening and closing statements\n   - Select openings and greetings randomly, so it doesn\'t sound the same every time you write a response. Get straight to the point\n   - Use conversational language, including colloquialisms and contractions\n   - Personalize based on review content\n   - Vary the structure and order of response elements\n   - Incorporate emotion and empathy\n   - Add conditional statements to sound less scripted\n   - Include occasional humor or light-heartedness where appropriate\n   - Vary the level of formality based on the review\'s tone\n   - For negative reviews: vary statements like "dropped the ball" because this expression appears in almost every review. Acknowledge the mistake and don\'t overuse frequently used terms or expressions.\n\n6. Content: Focus more on solutions and future actions rather than explanations of standard practices. Be concise when addressing issues.\n   - Be specific in addressing the reviewer\'s points\n   - Offer concrete solutions or improvements\n   - Include a call-to-action (e.g., invitation to return, contact information)\n   - Mention any relevant policies or procedures\n   - Incorporate industry-specific language where appropriate \n\n7. Tone: Adjust your level of formality and emotion based on the review\'s content and tone. Don\'t overcompensate with excessive apologies or enthusiasm.\n\n8. Authenticity: Write as if you\'re having a real conversation. It\'s okay to be brief if the situation calls for it.\n\n9. Problem-Solving: Offer specific, actionable solutions rather than generic promises to do better.\n\n10. Closing: Vary your call-to-action and closing statements. Not every response needs to invite the customer back or offer a free service.\n- Some closures start with "Rest assured" or "We\'d like to make this right for you. If you\'re willing." I want them to be fluid and be more conversational and cohesive.\n\n11. Sentence Structure and Flow:\n   - Combine related ideas into single, flowing sentences instead of using multiple short, abrupt sentences.\n   - Use transitional phrases to connect ideas and create a smoother narrative.\n   - Vary sentence length to create a more natural rhythm in your writing.\n   - Don\'t be afraid to use longer, more complex sentences when appropriate, especially when connecting related thoughts.\n\n12. Conclusions and Closing Statements:\n   - Avoid overused phrases like "I\'m disheartened," "I\'m disappointed," "I\'m particularly concerned," or "If you\'re open to it."\n   - Craft unique closing statements that reflect the specific situation and tone of the review.\n   - Don\'t always end with an invitation to return or an offer to make things right. Sometimes, a simple acknowledgment or thank you is sufficient.\n   - Use varied language to express regret, appreciation, or hope for future interactions.\n   - Consider ending with a forward-looking statement that doesn\'t necessarily require action from the reviewer.\n\n13. Overall Response Structure:\n    - Avoid falling into a predictable pattern across responses (e.g., always starting with an apology or ending with an invitation).\n    - Mix up the order in which you address points, express empathy, offer solutions, or share business insights.\n    - Tailor the length and complexity of your response to match the review\'s tone and content.\n\nRemember:\n- Prioritize addressing the reviewer\'s main concerns over covering every point.\n- It\'s okay to leave some minor points unaddressed if they don\'t significantly impact the overall response.\n- Aim for a conversational tone that flows naturally, as if you\'re speaking directly to the reviewer.\n- Each response should feel unique and tailored to the specific review.\n\nNow, please write a response to the following review, keeping in mind these refined guidelines and the specific points raised by the reviewer.',
            messages: [{
              role: "user",
              content: [{
                type: "text",
                text: "".concat(contact_position, "'s Name: ").concat(contant_name, "\nBusiness's Name: ").concat(organization_name, "\nRating: ").concat(rating, " star\nBackground Information: None\nCustomer's Name: ").concat(customer_name, "\nCustomer's Review: ").concat(review_text)
              }]
            }]
          }));

        case 2:
          message = _context5.sent;
          return _context5.abrupt("return", message);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function generateInsights(organization_name, contant_name, contact_position, rating, customer_name, review_text) {
  var message;
  return regeneratorRuntime.async(function generateInsights$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 3003,
            temperature: 0.7,
            system: 'You are an AI assistant trained to analyze customer reviews and extract valuable insights for business owners. Your task is to:\n\n1. Analyze the sentiment of the review.\n2. Provide a concise summary of the overall review.\n3. Extract key points and categorize them as positive or negative.\n4. Identify unique insights that could be valuable for the business owner.\n5. Analyze general keyword mentions and their contexts.\n6. Categorize aspects of the review into specific, business-relevant categories.\n7. Provide detailed sentiment analysis with emphasis on key phrases.\n\nOutput the results in the following JSON format:\n\n{\n  "sentimentLabel": "",  // Overall sentiment: "Positive", "Negative", "Mixed", "Neutral"\n  "summary": "",  // 1-2 sentence summarizing key aspects of the review\n  "positivePoints": [\n    {\n      "aspect": "",  // Clear, action-oriented phrase identifying the positive aspect -> max 2 words\n      "detail": ""  // Brief explanation, using reviewer\'s language where possible -> concise\n    }\n  ],\n  "negativePoints": [\n    {\n      "aspect": "",  // Clear, action-oriented phrase identifying the negative aspect -> max 2 words\n      "detail": ""  // Brief explanation, using reviewer\'s language where possible -> concise\n    }\n  ],\n  "businessInsights": {\n    "customerExperience": {\n      "highlightedAspects": [],  // List of specific, actionable aspects the customer noted (good or bad)\n      "suggestedImprovements": []  // Actionable areas where the customer indicated room for improvement\n    },\n    "staffMentions": [ // If no staff members are mentioned, leave empty array\n      {\n        "name": "",  // Staff member mentioned (if any)\n        "context": ""  // Brief, actionable description of how they were mentioned\n      }\n    ],\n    "productServiceFeedback": [\n      {\n        "item": "",  // Specific product or service mentioned\n        "feedback": ""  // Brief, actionable description of the feedback\n      }\n    ],\n    "operationalObservations": [\n      {\n        "aspect": "",  // Clear, specific operational aspect (e.g., "Customer wait time management")\n        "detail": ""  // Actionable feedback on this operational aspect\n      }\n    ],\n    "competitiveInsights": {\n      "advantages": [ // if none, leave an empty array\n   {\n   "advantage": "" // Clear statement of any competitive advantage mentioned\n}, \n],  \n      "disadvantages": [ // if none, leave an empty array\n  "disadvantage": "" // Clear statement of any competitive disadvantage mentioned\n}  ,\n    ],\n    "returnLikelihood": {\n      "indication": "",  // "Likely", "Unlikely", or "Unclear"\n      "basedOn": ""  // Brief explanation of what suggests this, focusing on actionable factors using * for emphasis -> do not use single quotations for this\n    }\n  },\n"generalKeywordMentions": [\n    {\n      "keyword": "",  // The specific keyword or phrase mentioned, must be 1 or 2 short words max\n      "sentiment": "",  // "Positive", "Negative","Neutral", or "Mixed"\n      "count": 0,  // Number of times the keyword was mentioned\n      "contexts": []  // Array of contexts/quotes where the keyword was used\n    }\n  ],\n  "businessSpecificCategories": [\n    {\n      "name": "",  // Specific, business-relevant category (e.g., "Haircut Quality", "Staff Expertise", "Customer Service")\n      "positiveMentions": 0,\n      "positiveContexts": [],\n      "negativeMentions": 0,\n      "negativeContexts": [],\n      "neutralMentions": 0,\n      "neutralContexts": [],\n      "categorySpecificKeywords": [\n        {\n          "keyword": "",\n          "sentiment": ""  // "Positive", "Negative", "Neutral", "Mixed"\n        }\n      ],\n      "context": ""  // Brief explanation of the category\'s significance in the review\n    }\n  ],\n  "detailedSentimentAnalysis": {\n    "positiveAspects": [\n      {\n        "aspect": "",    // Longer, more detailed positive point\n        "detail": "",    // Explanation or quote from the review, using ** for emphasis -> do not use single quotations for this\n        "impact": ""     // "High", "Medium", or "Low" - importance to overall sentiment\n      }\n    ],\n    "negativeAspects": [\n      {\n        "aspect": "",    // Longer, more detailed negative point\n        "detail": "",    // Explanation or quote from the review, using * for emphasis\n        "impact": ""     // "High", "Medium", or "Low" - importance to overall sentiment\n      }\n    ]\n  }\n}\n\nGuidelines:\n- Create specific, business-relevant categories based on the type of business being reviewed (e.g., for a hair salon: Haircut Quality, Staff Expertise, Salon Ambience, Pricing Value).\n- Distinguish between general keywords (in "generalKeywordMentions") and category-specific keywords (in "categorySpecificKeywords" for each category).\n- Ensure all aspects and insights are clear, specific, and actionable.\n- Use action-oriented language in aspect descriptions to make them self-explanatory.\n- Be objective and base your analysis solely on the content of the review.\n- Use the reviewer\'s language where possible to capture their voice and sentiment.\n- Focus on extracting insights that provide unique understanding and can be acted upon.\n- If a category doesn\'t apply, use an empty array or "N/A" as appropriate.\n- Prioritize quality over quantity in all sections. Include only significant and unique insights.\n- For keyword mentions, include all relevant contexts where the keyword appears.\n- In categories, provide specific contexts for each type of mention (positive, negative, neutral).\n- In detailed sentiment analysis, use asterisks (*) to emphasize key phrases from the review.\n\nNow, please analyze the following review and provide the insights in the specified JSON format.',
            messages: [{
              role: "user",
              content: [{
                type: "text",
                text: "".concat(contact_position, "'s Name: ").concat(contant_name, "\nBusiness's Name: ").concat(organization_name, "\nRating: ").concat(rating, " star\nBackground Information: None\nCustomer's Name: ").concat(customer_name, "\nCustomer's Review: ").concat(review_text)
              }]
            }]
          }));

        case 2:
          message = _context6.sent;
          return _context6.abrupt("return", message);

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function storeReview(review, response, insights, locationId, clerkId) {
  var _ref5, inserted_review, inserted_review_error, businessSpecificCategories;

  return regeneratorRuntime.async(function storeReview$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return regeneratorRuntime.awrap(_supabaseClient["default"].from("reviews").insert([{
            location_id: locationId,
            yelp_review_id: review.review_id,
            timestamp: review.timestamp,
            rating: review.rating.value,
            review_text: review.review_text,
            customer_name: review.user_profile.name,
            customer_profile_url: review.user_profile.url,
            customer_image_url: review.user_profile.image_url,
            has_responded_to: review.responses === null ? false : true,
            source: "yelp",
            generated_response: response.content[0].text,
            sentiment: insights.sentimentLabel,
            summary: insights.summary,
            return_likelihood: insights.businessInsights.returnLikelihood.indication
          }]).select("*"));

        case 2:
          _ref5 = _context16.sent;
          inserted_review = _ref5.data;
          inserted_review_error = _ref5.error;
          console.log("Inserted Review -> ", inserted_review);
          businessSpecificCategories = insights.businessSpecificCategories;
          businessSpecificCategories.forEach(function _callee5(category) {
            var _ref6, inserted_category, inserted_category_error;

            return regeneratorRuntime.async(function _callee5$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    console.log("Category -> ", category);
                    _context11.next = 3;
                    return regeneratorRuntime.awrap(_supabaseClient["default"].from("business_categories").insert([{
                      review_id: inserted_review[0].id,
                      location_id: locationId,
                      name: category.name,
                      context: category.context
                    }]).select("*"));

                  case 3:
                    _ref6 = _context11.sent;
                    inserted_category = _ref6.data;
                    inserted_category_error = _ref6.error;
                    console.log("Inserted Category -> ", inserted_category);
                    category.positiveContexts.forEach(function _callee(context) {
                      var _ref7, inserted_context, inserted_context_error;

                      return regeneratorRuntime.async(function _callee$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              console.log("Context -> ", context);
                              _context7.next = 3;
                              return regeneratorRuntime.awrap(_supabaseClient["default"].from("business_category_mentions").insert([{
                                review_id: inserted_review[0].id,
                                category_id: inserted_category[0].id,
                                context: context,
                                sentiment: "positive"
                              }]).select("*"));

                            case 3:
                              _ref7 = _context7.sent;
                              inserted_context = _ref7.data;
                              inserted_context_error = _ref7.error;
                              console.log("Inserted Context -> ", inserted_context);

                            case 7:
                            case "end":
                              return _context7.stop();
                          }
                        }
                      });
                    });
                    category.negativeContexts.forEach(function _callee2(context) {
                      var _ref8, inserted_context, inserted_context_error;

                      return regeneratorRuntime.async(function _callee2$(_context8) {
                        while (1) {
                          switch (_context8.prev = _context8.next) {
                            case 0:
                              console.log("Context -> ", context);
                              _context8.next = 3;
                              return regeneratorRuntime.awrap(_supabaseClient["default"].from("business_category_mentions").insert([{
                                review_id: inserted_review[0].id,
                                business_category_id: inserted_category[0].id,
                                context: context,
                                sentiment: "negative"
                              }]).select("*"));

                            case 3:
                              _ref8 = _context8.sent;
                              inserted_context = _ref8.data;
                              inserted_context_error = _ref8.error;
                              console.log("Inserted Context -> ", inserted_context);

                            case 7:
                            case "end":
                              return _context8.stop();
                          }
                        }
                      });
                    });
                    category.neutralContexts.forEach(function _callee3(context) {
                      var _ref9, inserted_context, inserted_context_error;

                      return regeneratorRuntime.async(function _callee3$(_context9) {
                        while (1) {
                          switch (_context9.prev = _context9.next) {
                            case 0:
                              console.log("Context -> ", context);
                              _context9.next = 3;
                              return regeneratorRuntime.awrap(_supabaseClient["default"].from("business_category_mentions").insert([{
                                review_id: inserted_review[0].id,
                                business_category_id: inserted_category[0].id,
                                context: context,
                                sentiment: "neutral"
                              }]).select("*"));

                            case 3:
                              _ref9 = _context9.sent;
                              inserted_context = _ref9.data;
                              inserted_context_error = _ref9.error;
                              console.log("Inserted Context -> ", inserted_context);

                            case 7:
                            case "end":
                              return _context9.stop();
                          }
                        }
                      });
                    });
                    category.categorySpecificKeywords.forEach(function _callee4(keyword) {
                      var _ref10, inserted_keyword, inserted_keyword_error;

                      return regeneratorRuntime.async(function _callee4$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                              console.log("Keyword -> ", keyword);
                              _context10.next = 3;
                              return regeneratorRuntime.awrap(_supabaseClient["default"].from("keywords").insert([{
                                review_id: inserted_review[0].id,
                                business_category_id: inserted_category[0].id,
                                name: keyword.keyword,
                                sentiment: keyword.sentiment
                              }]).select("*"));

                            case 3:
                              _ref10 = _context10.sent;
                              inserted_keyword = _ref10.data;
                              inserted_keyword_error = _ref10.error;
                              console.log("Inserted Keyword -> ", inserted);

                            case 7:
                            case "end":
                              return _context10.stop();
                          }
                        }
                      });
                    });

                  case 11:
                  case "end":
                    return _context11.stop();
                }
              }
            });
          });
          insights.detailedSentimentAnalysis.positiveAspects.forEach(function _callee6(aspect) {
            var _ref11, inserted_aspect, inserted_aspect_error;

            return regeneratorRuntime.async(function _callee6$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    console.log("Aspect -> ", aspect);
                    _context12.next = 3;
                    return regeneratorRuntime.awrap(_supabaseClient["default"].from("detailed_aspects").insert([{
                      review_id: inserted_review[0].id,
                      aspect: aspect.aspect,
                      detail: aspect.detail,
                      impact: aspect.impact,
                      sentiment: "positive"
                    }]).select("*"));

                  case 3:
                    _ref11 = _context12.sent;
                    inserted_aspect = _ref11.data;
                    inserted_aspect_error = _ref11.error;
                    console.log("Inserted Aspect -> ", inserted_aspect);

                  case 7:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          });
          insights.detailedSentimentAnalysis.negativeAspects.forEach(function _callee7(aspect) {
            var _ref12, inserted_aspect, inserted_aspect_error;

            return regeneratorRuntime.async(function _callee7$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    console.log("Aspect -> ", aspect);
                    _context13.next = 3;
                    return regeneratorRuntime.awrap(_supabaseClient["default"].from("detailed_aspects").insert([{
                      review_id: inserted_review[0].id,
                      aspect: aspect.aspect,
                      detail: aspect.detail,
                      impact: aspect.impact,
                      sentiment: "negative"
                    }]).select("*"));

                  case 3:
                    _ref12 = _context13.sent;
                    inserted_aspect = _ref12.data;
                    inserted_aspect_error = _ref12.error;
                    console.log("Inserted Aspect -> ", inserted_aspect);

                  case 7:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          });
          insights.businessInsights.staffMentions.forEach(function _callee8(mention) {
            var _ref13, inserted_mention, inserted_mention_error;

            return regeneratorRuntime.async(function _callee8$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    console.log("Mention -> ", mention);
                    _context14.next = 3;
                    return regeneratorRuntime.awrap(_supabaseClient["default"].from("staff_mentions").insert([{
                      review_id: inserted_review[0].id,
                      location_id: locationId,
                      employee_name: mention.name,
                      role: mention.role,
                      context: mention.context
                    }]).select("*"));

                  case 3:
                    _ref13 = _context14.sent;
                    inserted_mention = _ref13.data;
                    inserted_mention_error = _ref13.error;
                    console.log("Inserted Mention -> ", inserted_mention);

                  case 7:
                  case "end":
                    return _context14.stop();
                }
              }
            });
          });
          insights.businessInsights.productServiceFeedback.forEach(function _callee9(feedback) {
            var _ref14, inserted_feedback, inserted_feedback_error;

            return regeneratorRuntime.async(function _callee9$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    console.log("Feedback -> ", feedback);
                    _context15.next = 3;
                    return regeneratorRuntime.awrap(_supabaseClient["default"].from("product_service_feedback").insert([{
                      review_id: inserted_review[0].id,
                      location_id: locationId,
                      item: feedback.item,
                      feedback: feedback.feedback
                    }]).select("*"));

                  case 3:
                    _ref14 = _context15.sent;
                    inserted_feedback = _ref14.data;
                    inserted_feedback_error = _ref14.error;
                    console.log("Inserted Feedback -> ", inserted_feedback);

                  case 7:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          });
          return _context16.abrupt("return", {
            success: true
          });

        case 13:
        case "end":
          return _context16.stop();
      }
    }
  });
}

;