"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.fetchYelpReviews = exports.processYelpReviews = exports.helloWorld = void 0;

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

var processYelpReviews = _client.inngest.createFunction({
  id: "process-yelp-reviews",
  retries: 0
}, {
  event: "process/yelp.reviews"
}, function _callee3(_ref2) {
  var event, step, _event$data, reviews, locationId, clerkId, uniqueReviews, result;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          event = _ref2.event, step = _ref2.step;
          console.log("Starting processYelpReviews function");
          _event$data = event.data, reviews = _event$data.reviews, locationId = _event$data.locationId, clerkId = _event$data.clerkId; // De-duplicate reviews here

          uniqueReviews = Array.from(new Map(reviews.map(function (review) {
            return [review.review_id, review];
          })).values());
          console.log("Original review count: ".concat(reviews.length, ", Unique review count: ").concat(uniqueReviews.length));
          _context3.prev = 5;
          console.log("Log from processYelpReviews, unique reviews: ", uniqueReviews.length);
          _context3.next = 9;
          return regeneratorRuntime.awrap(step.run("Process Fetch Reviews", function _callee2() {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(processYelpReviewsLogic(uniqueReviews, locationId, clerkId));

                  case 2:
                    return _context2.abrupt("return", _context2.sent);

                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }));

        case 9:
          result = _context3.sent;
          return _context3.abrupt("return", _objectSpread({
            success: true
          }, result));

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](5);
          console.error("Error in processYelpReviews function: ".concat(_context3.t0.message));
          _context3.next = 18;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateFetchErrorMessage)(_context3.t0.message, clerkId));

        case 18:
          return _context3.abrupt("return", {
            success: false,
            error: _context3.t0.message,
            processedCount: 0,
            failedCount: uniqueReviews.length
          });

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 13]]);
});

exports.processYelpReviews = processYelpReviews;

var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

var processYelpReviewsLogic = function processYelpReviewsLogic(reviews, locationId, clerkId) {
  var processedReviews, failedReviews, limit, delay, _ref3, locationData, deleteResult, _loop, index;

  return regeneratorRuntime.async(function processYelpReviewsLogic$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          processedReviews = new Set();
          failedReviews = [];
          limit = (0, _pLimit["default"])(12);
          delay = 1000;
          console.log("Starting to process ".concat(reviews.length, " reviews at ").concat(new Date().toISOString()));
          _context6.prev = 5;
          _context6.next = 8;
          return regeneratorRuntime.awrap((0, _actionsHelpers.getLocationInfo)(locationId));

        case 8:
          _ref3 = _context6.sent;
          locationData = _ref3.data;
          console.log("Location Data fetched —> ", locationData);
          _context6.next = 13;
          return regeneratorRuntime.awrap((0, _actionsHelpers.deleteReviewsForLocation)(locationId));

        case 13:
          deleteResult = _context6.sent;
          console.log("Delete result: ".concat(JSON.stringify(deleteResult)));

          _loop = function _loop(index) {
            var review;
            return regeneratorRuntime.async(function _loop$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    review = reviews[index];
                    console.log("Processing review ".concat(index + 1, "/").concat(reviews.length, ": ").concat(review.review_id));
                    _context5.prev = 2;
                    _context5.next = 5;
                    return regeneratorRuntime.awrap(limit(function _callee4() {
                      var insights, parsedInsights;
                      return regeneratorRuntime.async(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              _context4.next = 2;
                              return regeneratorRuntime.awrap(sleep(delay));

                            case 2:
                              console.log("Generating insights for review ".concat(review.review_id));
                              _context4.next = 5;
                              return regeneratorRuntime.awrap((0, _actionsHelpers.generateInsights)(review.review_text));

                            case 5:
                              insights = _context4.sent;
                              console.log("Insights generated for review ".concat(review.review_id));

                              if (!(!insights || !insights.content || !Array.isArray(insights.content) || insights.content.length === 0)) {
                                _context4.next = 9;
                                break;
                              }

                              throw new Error("Invalid insights structure");

                            case 9:
                              parsedInsights = JSON.parse(insights.content[0].text);
                              console.log("Storing review ".concat(review.review_id));
                              _context4.next = 13;
                              return regeneratorRuntime.awrap((0, _actionsHelpers.storeReview)(review, parsedInsights, locationId, clerkId));

                            case 13:
                              console.log("Review ".concat(review.review_id, " stored successfully"));
                              processedReviews.add(review.review_id);
                              console.log("Successfully processed review ".concat(review.review_id));

                            case 16:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      });
                    }));

                  case 5:
                    _context5.next = 11;
                    break;

                  case 7:
                    _context5.prev = 7;
                    _context5.t0 = _context5["catch"](2);
                    console.error("Error processing review ".concat(review.review_id, ":"), _context5.t0);
                    failedReviews.push({
                      reviewId: review.review_id,
                      error: _context5.t0,
                      review: review
                    });

                  case 11:
                    // Log progress every 10 reviews
                    if ((index + 1) % 10 === 0) {
                      console.log("Progress: ".concat(index + 1, "/").concat(reviews.length, " reviews processed"));
                    }

                  case 12:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[2, 7]]);
          };

          index = 0;

        case 17:
          if (!(index < reviews.length)) {
            _context6.next = 23;
            break;
          }

          _context6.next = 20;
          return regeneratorRuntime.awrap(_loop(index));

        case 20:
          index++;
          _context6.next = 17;
          break;

        case 23:
          console.log("Finished processing reviews at ".concat(new Date().toISOString()));
          console.log("Processed ".concat(processedReviews.size, " reviews successfully, ").concat(failedReviews.length, " failed"));
          return _context6.abrupt("return", {
            processedCount: processedReviews.size,
            failedCount: failedReviews.length,
            processedReviews: Array.from(processedReviews),
            failedReviews: failedReviews
          });

        case 28:
          _context6.prev = 28;
          _context6.t0 = _context6["catch"](5);
          console.error("Error in processYelpReviewsLogic:", _context6.t0);
          return _context6.abrupt("return", {
            processedCount: processedReviews.size,
            failedCount: reviews.length - processedReviews.size,
            processedReviews: Array.from(processedReviews),
            failedReviews: [].concat(failedReviews, [{
              reviewId: "unknown",
              error: _context6.t0.message,
              review: "Error occurred during overall process"
            }])
          });

        case 32:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[5, 28]]);
};

var fetchYelpReviews = _client.inngest.createFunction({
  id: "fetch-yelp-reviews"
}, {
  event: "fetch/yelp.reviews"
}, function _callee6(_ref4) {
  var event, step, _event$data2, yelpBusinessLink, locationId, clerkId, result, reviews;

  return regeneratorRuntime.async(function _callee6$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          event = _ref4.event, step = _ref4.step;
          console.log("Starting fetchYelpReviews function");
          _event$data2 = event.data, yelpBusinessLink = _event$data2.yelpBusinessLink, locationId = _event$data2.locationId, clerkId = _event$data2.clerkId;
          console.log("Received data: yelpBusinessLink=".concat(yelpBusinessLink, ", locationId=").concat(locationId, ", clerkId=").concat(clerkId));
          _context8.prev = 4;
          console.log("Updating isFetching status to true");
          _context8.next = 8;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateIsFetching)("true", clerkId));

        case 8:
          _context8.next = 10;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateFetchErrorMessage)("", clerkId));

        case 10:
          console.log("Starting Fetch Yelp Reviews logic");
          _context8.next = 13;
          return regeneratorRuntime.awrap(step.run("Fetch Yelp Reviews", function _callee5() {
            return regeneratorRuntime.async(function _callee5$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(fetchYelpReviewsLogic(yelpBusinessLink, locationId, clerkId));

                  case 2:
                    return _context7.abrupt("return", _context7.sent);

                  case 3:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          }));

        case 13:
          result = _context8.sent;
          reviews = result.reviews;
          console.log("Sending reviews to process/yelp.reviews function", reviews.length);
          _context8.next = 18;
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
          _context8.next = 21;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateSelectedLocation)(locationId, yelpBusinessLink));

        case 21:
          console.log("Updating isFetching status to false");
          _context8.next = 24;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateIsFetching)("false", clerkId));

        case 24:
          console.log("Fetch Yelp Reviews completed successfully");
          return _context8.abrupt("return", _objectSpread({
            success: true
          }, result));

        case 28:
          _context8.prev = 28;
          _context8.t0 = _context8["catch"](4);
          console.error("Error in Inngest function: ".concat(_context8.t0.message));
          _context8.next = 33;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateIsFetching)(false, clerkId));

        case 33:
          _context8.next = 35;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateFetchErrorMessage)(_context8.t0.message, clerkId));

        case 35:
          return _context8.abrupt("return", {
            success: false,
            error: _context8.t0.message
          });

        case 36:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[4, 28]]);
});

exports.fetchYelpReviews = fetchYelpReviews;

function fetchYelpReviewsLogic(yelpBusinessLink, locationId, clerkId) {
  var alias, initialResponse, taskId, initialResults, totalReviews, fullResponse, fullTaskId, allReviews, uniqueReviews, uniqueInitialReviews;
  return regeneratorRuntime.async(function fetchYelpReviewsLogic$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("Starting fetchYelpReviewsLogic");
          alias = yelpBusinessLink.split("/").pop();
          console.log("Extracted alias: ".concat(alias));
          _context9.prev = 3;
          console.log("Posting initial Yelp review task");
          _context9.next = 7;
          return regeneratorRuntime.awrap(postYelpReviewTask(alias, 10));

        case 7:
          initialResponse = _context9.sent;

          if (!(!initialResponse.tasks || initialResponse.tasks.length === 0)) {
            _context9.next = 11;
            break;
          }

          console.error("No tasks found in initial response");
          throw new Error("No tasks found in response.");

        case 11:
          taskId = initialResponse.tasks[0].id;
          console.log("Initial task ID: ".concat(taskId));
          console.log("Polling for initial results");
          _context9.next = 16;
          return regeneratorRuntime.awrap(pollYelpResults(taskId));

        case 16:
          initialResults = _context9.sent;

          if (initialResults.success) {
            _context9.next = 20;
            break;
          }

          console.error("Initial polling failed: ".concat(initialResults.message));
          throw new Error(initialResults.message);

        case 20:
          totalReviews = initialResults.totalReviews;
          console.log("Total reviews found: ".concat(totalReviews));

          if (!(totalReviews > 10)) {
            _context9.next = 39;
            break;
          }

          console.log("Fetching all ".concat(totalReviews, " reviews"));
          _context9.next = 26;
          return regeneratorRuntime.awrap(postYelpReviewTask(alias, totalReviews));

        case 26:
          fullResponse = _context9.sent;
          fullTaskId = fullResponse.tasks[0].id;
          console.log("Full task ID: ".concat(fullTaskId));
          console.log("Polling for all reviews");
          _context9.next = 32;
          return regeneratorRuntime.awrap(pollYelpResults(fullTaskId));

        case 32:
          allReviews = _context9.sent;

          if (allReviews.success) {
            _context9.next = 36;
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
          return _context9.abrupt("return", {
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
          return _context9.abrupt("return", {
            success: true,
            reviews: uniqueInitialReviews,
            totalReviews: uniqueInitialReviews.length
          });

        case 45:
          _context9.prev = 45;
          _context9.t0 = _context9["catch"](3);
          console.error("Yelp fetching error: ".concat(_context9.t0.message));
          _context9.next = 50;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateIsFetching)(false, clerkId));

        case 50:
          _context9.next = 52;
          return regeneratorRuntime.awrap((0, _actionsHelpers.updateFetchErrorMessage)(_context9.t0.message, clerkId));

        case 52:
          return _context9.abrupt("return", {
            success: false,
            message: "Failed to fetch Yelp reviews: ".concat(_context9.t0.message)
          });

        case 53:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[3, 45]]);
}

function pollYelpResults(taskId) {
  var maxAttempts, pollingInterval, attempt, response, result;
  return regeneratorRuntime.async(function pollYelpResults$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log("Starting to poll Yelp results for task ID: ".concat(taskId));
          maxAttempts = 10;
          pollingInterval = 60000;
          attempt = 0;

        case 4:
          if (!(attempt < maxAttempts)) {
            _context10.next = 35;
            break;
          }

          _context10.prev = 5;
          console.log("Polling attempt ".concat(attempt + 1));
          _context10.next = 9;
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
          response = _context10.sent;
          console.log("Polling attempt ".concat(attempt + 1, ", status code: ").concat(response.status));
          console.log("Response status code —> ", response.data.tasks[0].status_code);

          if (!(response.data.tasks && response.data.tasks[0].status_code === 20000)) {
            _context10.next = 19;
            break;
          }

          result = response.data.tasks[0].result[0];

          if (!(!result || result.reviews_count === null)) {
            _context10.next = 17;
            break;
          }

          console.error("No reviews found in response");
          return _context10.abrupt("return", {
            success: false,
            message: "No reviews found in response"
          });

        case 17:
          console.log("Successfully fetched ".concat(result.items.length, " reviews"));
          return _context10.abrupt("return", {
            success: true,
            reviews: result.items,
            totalReviews: result.reviews_count
          });

        case 19:
          if (!(attempt === maxAttempts - 1)) {
            _context10.next = 22;
            break;
          }

          console.error("Max polling attempts reached");
          return _context10.abrupt("return", {
            success: false,
            message: "Max polling attempts reached"
          });

        case 22:
          console.log("Waiting ".concat(pollingInterval, "ms before next attempt"));
          _context10.next = 25;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, pollingInterval);
          }));

        case 25:
          _context10.next = 32;
          break;

        case 27:
          _context10.prev = 27;
          _context10.t0 = _context10["catch"](5);
          console.error("Error polling Yelp results: ".concat(_context10.t0.message));

          if (_context10.t0.response && _context10.t0.response.status === 500) {
            // Handle specific HTTP errors
            console.error("Server error: ".concat(_context10.t0.response.status));
          } else {
            console.error("General error: ".concat(_context10.t0.message));
          }

          return _context10.abrupt("return", {
            success: false,
            message: "Error polling Yelp results: ".concat(_context10.t0.message)
          });

        case 32:
          attempt++;
          _context10.next = 4;
          break;

        case 35:
          console.error("Timeout while fetching Yelp reviews");
          return _context10.abrupt("return", {
            success: false,
            message: "Timeout while fetching Yelp reviews"
          });

        case 37:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[5, 27]]);
}

function postYelpReviewTask(alias, depth) {
  var response;
  return regeneratorRuntime.async(function postYelpReviewTask$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log("Posting Yelp review task for alias: ".concat(alias, ", depth: ").concat(depth));
          _context11.prev = 1;
          _context11.next = 4;
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
          response = _context11.sent;
          console.log("Task posted successfully:", response.data);
          return _context11.abrupt("return", response.data);

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](1);
          console.error("HTTP error posting task: ".concat(_context11.t0.message));
          throw new Error("HTTP error! Status: ".concat(_context11.t0.status));

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[1, 9]]);
}

var _default = (0, _next.serve)({
  client: _client.inngest,
  functions: [fetchYelpReviews, processYelpReviews],
  streaming: "allow"
});

exports["default"] = _default;

function retryRequest(fn) {
  var maxRetries,
      retryDelay,
      i,
      _args12 = arguments;
  return regeneratorRuntime.async(function retryRequest$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          maxRetries = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : 5;
          retryDelay = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : 5000;
          i = 0;

        case 3:
          if (!(i < maxRetries)) {
            _context12.next = 28;
            break;
          }

          _context12.prev = 4;
          _context12.next = 7;
          return regeneratorRuntime.awrap(fn());

        case 7:
          return _context12.abrupt("return", _context12.sent);

        case 10:
          _context12.prev = 10;
          _context12.t0 = _context12["catch"](4);

          if (!(_context12.t0.status === 429 || _context12.t0.error && _context12.t0.error.type === "rate_limit_error")) {
            _context12.next = 18;
            break;
          }

          console.log("Rate limit hit, waiting ".concat(retryDelay / 1000, " seconds before retry ").concat(i + 1));
          _context12.next = 16;
          return regeneratorRuntime.awrap(sleep(retryDelay));

        case 16:
          _context12.next = 25;
          break;

        case 18:
          if (!(i === maxRetries - 1)) {
            _context12.next = 22;
            break;
          }

          throw _context12.t0;

        case 22:
          console.log("Error occurred, retrying in ".concat(retryDelay / 1000, " seconds. Attempt ").concat(i + 1));
          _context12.next = 25;
          return regeneratorRuntime.awrap(sleep(retryDelay));

        case 25:
          i++;
          _context12.next = 3;
          break;

        case 28:
          throw new Error("Failed after ".concat(maxRetries, " retries"));

        case 29:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[4, 10]]);
}