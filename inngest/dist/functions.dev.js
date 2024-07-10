"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.fetchYelpReviews = exports.processYelpReviews = exports.processSingleYelpReview = exports.helloWorld = void 0;

var _client = require("./client");

var _next = require("inngest/next");

var _actionsHelpers = require("@/utils/actionsHelpers");

var _axios = _interopRequireDefault(require("axios"));

var _pLimit = _interopRequireDefault(require("p-limit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var helloWorld = _client.inngest.createFunction({
  id: "hello-world"
}, {
  event: "test/hello.world"
}, function _callee(_ref) {
  var event, step;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          event = _ref.event, step = _ref.step;
          _context.next = 3;
          return regeneratorRuntime.awrap(step.sleep("wait-a-moment", "1s"));

        case 3:
          return _context.abrupt("return", {
            event: event,
            body: "Hello, World!"
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});

exports.helloWorld = helloWorld;

var processSingleYelpReview = _client.inngest.createFunction({
  id: "process-single-yelp-review"
}, {
  event: "process/single.yelp.review"
}, function _callee2(_ref2) {
  var event, step, _event$data, review, locationId, clerkId, index, total, insights, parsedInsights;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          event = _ref2.event, step = _ref2.step;
          _event$data = event.data, review = _event$data.review, locationId = _event$data.locationId, clerkId = _event$data.clerkId, index = _event$data.index, total = _event$data.total;
          console.log("Processing review ".concat(index + 1, "/").concat(total, ": ").concat(review.review_id));
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap((0, _actionsHelpers.generateInsights)(review.review_text));

        case 6:
          insights = _context2.sent;

          if (!(!insights || !insights.content || !Array.isArray(insights.content) || insights.content.length === 0)) {
            _context2.next = 9;
            break;
          }

          throw new Error("Invalid insights structure");

        case 9:
          parsedInsights = JSON.parse(insights.content[0].text);
          _context2.next = 12;
          return regeneratorRuntime.awrap((0, _actionsHelpers.storeReview)(review, parsedInsights, locationId, clerkId));

        case 12:
          console.log("Successfully processed review ".concat(review.review_id));
          return _context2.abrupt("return", {
            success: true,
            reviewId: review.review_id
          });

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](3);
          console.error("Error processing review ".concat(review.review_id, ":"), _context2.t0);
          return _context2.abrupt("return", {
            success: false,
            reviewId: review.review_id,
            error: _context2.t0.message
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 16]]);
});

exports.processSingleYelpReview = processSingleYelpReview;

var processYelpReviews = _client.inngest.createFunction({
  id: "process-yelp-reviews",
  retries: 0
}, {
  event: "process/yelp.reviews"
}, function _callee4(_ref3) {
  var event, step, _event$data2, reviews, locationId, clerkId, deleteResult, uniqueReviews, jobPromises;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          event = _ref3.event, step = _ref3.step;
          console.log("Starting processYelpReviews function");
          _event$data2 = event.data, reviews = _event$data2.reviews, locationId = _event$data2.locationId, clerkId = _event$data2.clerkId;
          _context4.next = 5;
          return regeneratorRuntime.awrap((0, _actionsHelpers.deleteReviewsForLocation)(locationId));

        case 5:
          deleteResult = _context4.sent;
          console.log("Delete result: ".concat(JSON.stringify(deleteResult)));
          uniqueReviews = Array.from(new Map(reviews.map(function (review) {
            return [review.review_id, review];
          })).values());
          console.log("Unique review count: ".concat(uniqueReviews.length));
          _context4.prev = 9;
          // Create a job for each review with a delay
          jobPromises = uniqueReviews.map(function _callee3(review, index) {
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(sleep(5000));

                  case 2:
                    return _context3.abrupt("return", _client.inngest.send({
                      name: "process/single.yelp.review",
                      data: {
                        review: review,
                        locationId: locationId,
                        clerkId: clerkId,
                        index: index,
                        total: uniqueReviews.length
                      }
                    }));

                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });
          _context4.next = 13;
          return regeneratorRuntime.awrap(Promise.all(jobPromises));

        case 13:
          console.log("Created ".concat(uniqueReviews.length, " individual review processing jobs"));
          return _context4.abrupt("return", {
            success: true,
            reviewCount: uniqueReviews.length
          });

        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](9);
          console.error("Error in processYelpReviews function: ".concat(_context4.t0.message));
          _context4.next = 22;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateFetchErrorMessage)(_context4.t0.message, clerkId));

        case 22:
          return _context4.abrupt("return", {
            success: false,
            error: _context4.t0.message
          });

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[9, 17]]);
});

exports.processYelpReviews = processYelpReviews;

var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}; // const processYelpReviewsLogic = async (reviews, locationId, clerkId) => {
//   const processedReviews = new Set();
//   const failedReviews = [];
//   const limit = pLimit(25);
//   const delay = 1000;
//   console.log(
//     `Starting to process ${
//       reviews.length
//     } reviews at ${new Date().toISOString()}`
//   );
//   try {
//     const { data: locationData } = await getLocationInfo(locationId);
//     console.log("Location Data fetched —> ", locationData);
//     const deleteResult = await deleteReviewsForLocation(locationId);
//     console.log(`Delete result: ${JSON.stringify(deleteResult)}`);
//     for (let index = 0; index < reviews.length; index++) {
//       const review = reviews[index];
//       console.log(
//         `Processing review ${index + 1}/${reviews.length}: ${review.review_id}`
//       );
//       try {
//         await limit(async () => {
//           await sleep(delay);
//           console.log(`Generating insights for review ${review.review_id}`);
//           const insights = await generateInsights(review.review_text);
//           console.log(`Insights generated for review ${review.review_id}`);
//           if (
//             !insights ||
//             !insights.content ||
//             !Array.isArray(insights.content) ||
//             insights.content.length === 0
//           ) {
//             throw new Error("Invalid insights structure");
//           }
//           const parsedInsights = JSON.parse(insights.content[0].text);
//           console.log(`Storing review ${review.review_id}`);
//           await storeReview(review, parsedInsights, locationId, clerkId);
//           console.log(`Review ${review.review_id} stored successfully`);
//           processedReviews.add(review.review_id);
//           console.log(`Successfully processed review ${review.review_id}`);
//         });
//       } catch (error) {
//         console.error(`Error processing review ${review.review_id}:`, error);
//         failedReviews.push({
//           reviewId: review.review_id,
//           error: error.message,
//           review: review,
//         });
//       }
//       // Log progress every 10 reviews
//       if ((index + 1) % 10 === 0) {
//         console.log(
//           `Progress: ${index + 1}/${reviews.length} reviews processed`
//         );
//       }
//     }
//     console.log(`Finished processing reviews at ${new Date().toISOString()}`);
//     console.log(
//       `Processed ${processedReviews.size} reviews successfully, ${failedReviews.length} failed`
//     );
//     return {
//       processedCount: processedReviews.size,
//       failedCount: failedReviews.length,
//       processedReviews: Array.from(processedReviews),
//       failedReviews: failedReviews,
//     };
//   } catch (error) {
//     console.error("Error in processYelpReviewsLogic:", error);
//     return {
//       processedCount: processedReviews.size,
//       failedCount: reviews.length - processedReviews.size,
//       processedReviews: Array.from(processedReviews),
//       failedReviews: [
//         ...failedReviews,
//         {
//           reviewId: "unknown",
//           error: error.message,
//           review: "Error occurred during overall process",
//         },
//       ],
//     };
//   }
// };


var fetchYelpReviews = _client.inngest.createFunction({
  id: "fetch-yelp-reviews"
}, {
  event: "fetch/yelp.reviews"
}, function _callee6(_ref4) {
  var event, step, _event$data3, yelpBusinessLink, locationId, clerkId, result, reviews;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          event = _ref4.event, step = _ref4.step;
          console.log("Starting fetchYelpReviews function");
          _event$data3 = event.data, yelpBusinessLink = _event$data3.yelpBusinessLink, locationId = _event$data3.locationId, clerkId = _event$data3.clerkId;
          console.log("Received data: yelpBusinessLink=".concat(yelpBusinessLink, ", locationId=").concat(locationId, ", clerkId=").concat(clerkId));
          _context6.prev = 4;
          console.log("Updating isFetching status to true");
          _context6.next = 8;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateIsFetching)("true", clerkId));

        case 8:
          _context6.next = 10;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateFetchErrorMessage)("", clerkId));

        case 10:
          console.log("Starting Fetch Yelp Reviews logic");
          _context6.next = 13;
          return regeneratorRuntime.awrap(step.run("Fetch Yelp Reviews", function _callee5() {
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return regeneratorRuntime.awrap(fetchYelpReviewsLogic(yelpBusinessLink, locationId, clerkId));

                  case 2:
                    return _context5.abrupt("return", _context5.sent);

                  case 3:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          }));

        case 13:
          result = _context6.sent;
          reviews = result.reviews;
          console.log("Sending reviews to process/yelp.reviews function", reviews.length);
          _context6.next = 18;
          return regeneratorRuntime.awrap(_client.inngest.send({
            name: "process/yelp.reviews",
            data: {
              reviews: reviews,
              locationId: locationId,
              clerkId: clerkId
            }
          }));

        case 18:
          console.log("Updating selected location");
          _context6.next = 21;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateSelectedLocation)(locationId, yelpBusinessLink));

        case 21:
          console.log("Updating isFetching status to false");
          _context6.next = 24;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateIsFetching)("false", clerkId));

        case 24:
          console.log("Fetch Yelp Reviews completed successfully");
          return _context6.abrupt("return", _objectSpread({
            success: true
          }, result));

        case 28:
          _context6.prev = 28;
          _context6.t0 = _context6["catch"](4);
          console.error("Error in Inngest function: ".concat(_context6.t0.message));
          _context6.next = 33;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateIsFetching)(false, clerkId));

        case 33:
          _context6.next = 35;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateFetchErrorMessage)(_context6.t0.message, clerkId));

        case 35:
          return _context6.abrupt("return", {
            success: false,
            error: _context6.t0.message
          });

        case 36:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[4, 28]]);
});

exports.fetchYelpReviews = fetchYelpReviews;

function fetchYelpReviewsLogic(yelpBusinessLink, locationId, clerkId) {
  var alias, initialResponse, taskId, initialResults, totalReviews, fullResponse, fullTaskId, allReviews, uniqueReviews, uniqueInitialReviews;
  return regeneratorRuntime.async(function fetchYelpReviewsLogic$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("Starting fetchYelpReviewsLogic");
          alias = yelpBusinessLink.split("/").pop();
          console.log("Extracted alias: ".concat(alias));
          _context7.prev = 3;
          console.log("Posting initial Yelp review task");
          _context7.next = 7;
          return regeneratorRuntime.awrap(postYelpReviewTask(alias, 10));

        case 7:
          initialResponse = _context7.sent;

          if (!(!initialResponse.tasks || initialResponse.tasks.length === 0)) {
            _context7.next = 11;
            break;
          }

          console.error("No tasks found in initial response");
          throw new Error("No tasks found in response.");

        case 11:
          taskId = initialResponse.tasks[0].id;
          console.log("Initial task ID: ".concat(taskId));
          console.log("Polling for initial results");
          _context7.next = 16;
          return regeneratorRuntime.awrap(pollYelpResults(taskId));

        case 16:
          initialResults = _context7.sent;

          if (initialResults.success) {
            _context7.next = 20;
            break;
          }

          console.error("Initial polling failed: ".concat(initialResults.message));
          throw new Error(initialResults.message);

        case 20:
          totalReviews = initialResults.totalReviews;
          console.log("Total reviews found: ".concat(totalReviews));

          if (!(totalReviews > 10)) {
            _context7.next = 39;
            break;
          }

          console.log("Fetching all ".concat(totalReviews, " reviews"));
          _context7.next = 26;
          return regeneratorRuntime.awrap(postYelpReviewTask(alias, totalReviews));

        case 26:
          fullResponse = _context7.sent;
          fullTaskId = fullResponse.tasks[0].id;
          console.log("Full task ID: ".concat(fullTaskId));
          console.log("Polling for all reviews");
          _context7.next = 32;
          return regeneratorRuntime.awrap(pollYelpResults(fullTaskId));

        case 32:
          allReviews = _context7.sent;

          if (allReviews.success) {
            _context7.next = 36;
            break;
          }

          console.error("Full polling failed: ".concat(allReviews.message));
          throw new Error(allReviews.message);

        case 36:
          // De-duplicate reviews here
          uniqueReviews = Array.from(new Map(allReviews.reviews.map(function (review) {
            return [review.review_id, review];
          })).values());
          console.log("Successfully fetched ".concat(allReviews.reviews.length, " reviews, Unique reviews: ").concat(uniqueReviews.length));
          return _context7.abrupt("return", {
            success: true,
            reviews: uniqueReviews,
            totalReviews: uniqueReviews.length
          });

        case 39:
          console.log("Returning initial ".concat(initialResults.reviews.length, " reviews")); // De-duplicate initial reviews as well

          uniqueInitialReviews = Array.from(new Map(initialResults.reviews.map(function (review) {
            return [review.review_id, review];
          })).values());
          console.log("Initial reviews: ".concat(initialResults.reviews.length, ", Unique initial reviews: ").concat(uniqueInitialReviews.length));
          return _context7.abrupt("return", {
            success: true,
            reviews: uniqueInitialReviews,
            totalReviews: uniqueInitialReviews.length
          });

        case 45:
          _context7.prev = 45;
          _context7.t0 = _context7["catch"](3);
          console.error("Yelp fetching error: ".concat(_context7.t0.message));
          _context7.next = 50;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateIsFetching)(false, clerkId));

        case 50:
          _context7.next = 52;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateFetchErrorMessage)(_context7.t0.message, clerkId));

        case 52:
          return _context7.abrupt("return", {
            success: false,
            message: "Failed to fetch Yelp reviews: ".concat(_context7.t0.message)
          });

        case 53:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 45]]);
}

function pollYelpResults(taskId) {
  var maxAttempts, pollingInterval, attempt, response, result;
  return regeneratorRuntime.async(function pollYelpResults$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("Starting to poll Yelp results for task ID: ".concat(taskId));
          maxAttempts = 10;
          pollingInterval = 60000;
          attempt = 0;

        case 4:
          if (!(attempt < maxAttempts)) {
            _context8.next = 35;
            break;
          }

          _context8.prev = 5;
          console.log("Polling attempt ".concat(attempt + 1));
          _context8.next = 9;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "get",
            url: "https://api.dataforseo.com/v3/business_data/yelp/reviews/task_get/".concat(taskId),
            auth: {
              username: "0986881@lbcc.edu",
              password: "4045d2967d70b68e"
            },
            headers: {
              "content-type": "application/json"
            }
          }));

        case 9:
          response = _context8.sent;
          console.log("Polling attempt ".concat(attempt + 1, ", status code: ").concat(response.status));
          console.log("Response status code —> ", response.data.tasks[0].status_code);

          if (!(response.data.tasks && response.data.tasks[0].status_code === 20000)) {
            _context8.next = 19;
            break;
          }

          result = response.data.tasks[0].result[0];

          if (!(!result || result.reviews_count === null)) {
            _context8.next = 17;
            break;
          }

          console.error("No reviews found in response");
          return _context8.abrupt("return", {
            success: false,
            message: "No reviews found in response"
          });

        case 17:
          console.log("Successfully fetched ".concat(result.items.length, " reviews"));
          return _context8.abrupt("return", {
            success: true,
            reviews: result.items,
            totalReviews: result.reviews_count
          });

        case 19:
          if (!(attempt === maxAttempts - 1)) {
            _context8.next = 22;
            break;
          }

          console.error("Max polling attempts reached");
          return _context8.abrupt("return", {
            success: false,
            message: "Max polling attempts reached"
          });

        case 22:
          console.log("Waiting ".concat(pollingInterval, "ms before next attempt"));
          _context8.next = 25;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, pollingInterval);
          }));

        case 25:
          _context8.next = 32;
          break;

        case 27:
          _context8.prev = 27;
          _context8.t0 = _context8["catch"](5);
          console.error("Error polling Yelp results: ".concat(_context8.t0.message));

          if (_context8.t0.response && _context8.t0.response.status === 500) {
            // Handle specific HTTP errors
            console.error("Server error: ".concat(_context8.t0.response.status));
          } else {
            console.error("General error: ".concat(_context8.t0.message));
          }

          return _context8.abrupt("return", {
            success: false,
            message: "Error polling Yelp results: ".concat(_context8.t0.message)
          });

        case 32:
          attempt++;
          _context8.next = 4;
          break;

        case 35:
          console.error("Timeout while fetching Yelp reviews");
          return _context8.abrupt("return", {
            success: false,
            message: "Timeout while fetching Yelp reviews"
          });

        case 37:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[5, 27]]);
}

function postYelpReviewTask(alias, depth) {
  var response;
  return regeneratorRuntime.async(function postYelpReviewTask$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("Posting Yelp review task for alias: ".concat(alias, ", depth: ").concat(depth));
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "post",
            url: "https://api.dataforseo.com/v3/business_data/yelp/reviews/task_post",
            auth: {
              username: "0986881@lbcc.edu",
              password: "4045d2967d70b68e"
            },
            data: [{
              language_name: "English",
              alias: alias,
              depth: depth
            }],
            headers: {
              "content-type": "application/json"
            }
          }));

        case 4:
          response = _context9.sent;
          console.log("Task posted successfully:", response.data);
          return _context9.abrupt("return", response.data);

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](1);
          console.error("HTTP error posting task: ".concat(_context9.t0.message));
          throw new Error("HTTP error! Status: ".concat(_context9.t0.status));

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 9]]);
}

var _default = (0, _next.serve)({
  client: _client.inngest,
  functions: [fetchYelpReviews, processYelpReviews, processSingleYelpReview],
  streaming: "allow"
});

exports["default"] = _default;