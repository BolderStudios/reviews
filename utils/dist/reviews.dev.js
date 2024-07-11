"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllReviewData = getAllReviewData;
exports.fetchDataFromAPI = fetchDataFromAPI;

var _supabaseClient = _interopRequireDefault(require("@/utils/supabaseClient"));

var _dateFns = require("date-fns");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// ———————————————————————————————————————————————————————————————————————————
// Helper functions for Reviews Table
// ———————————————————————————————————————————————————————————————————————————
function getAllReviewData(reviewId) {
  var result, fetchData;
  return regeneratorRuntime.async(function getAllReviewData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          result = {
            success: true,
            data: {},
            errors: {}
          }; // Helper function to fetch data and handle errors

          fetchData = function fetchData(table, key) {
            var _ref, data, error;

            return regeneratorRuntime.async(function fetchData$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(_supabaseClient["default"].from(table).select("*").eq("review_id", reviewId));

                  case 2:
                    _ref = _context.sent;
                    data = _ref.data;
                    error = _ref.error;

                    if (error) {
                      result.success = false;
                      result.errors[key] = error.message;
                    } else {
                      result.data[key] = data;
                    }

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          _context2.next = 4;
          return regeneratorRuntime.awrap(fetchData("business_category_mentions", "business_category_mentions"));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(fetchData("detailed_aspects", "detailed_aspects"));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(fetchData("product_service_feedback", "product_service_feedback"));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(fetchData("keywords", "keywords"));

        case 10:
          return _context2.abrupt("return", result);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function fetchDataFromAPI(locationId, dateRange) {
  var startDate, endDate;
  return regeneratorRuntime.async(function fetchDataFromAPI$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Fetch all reviews for the given date range
          console.log("Fetching data for location", locationId);
          console.log("Date Range", dateRange);
          startDate = dateRange.startDate;
          endDate = dateRange.endDate;
          fetchAverageRatingData(locationId, dateRange);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function fetchAverageRatingData(locationId, dateRange) {
  var startDate, endDate, _ref2, firstReview, error, date, formattedDate, dates;

  return regeneratorRuntime.async(function fetchAverageRatingData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(dateRange.startDate === null || dateRange.endDate === null)) {
            _context4.next = 14;
            break;
          }

          _context4.next = 3;
          return regeneratorRuntime.awrap(_supabaseClient["default"].from("reviews").select("timestamp").eq("location_id", locationId).order("created_at", {
            ascending: false
          }).limit(1));

        case 3:
          _ref2 = _context4.sent;
          firstReview = _ref2.data;
          error = _ref2.error;
          date = new Date(firstReview[0].timestamp);
          formattedDate = date.toLocaleDateString("en-US");
          startDate = formattedDate.split("/").join("-");
          endDate = (0, _dateFns.format)(new Date(), "mm-dd-yyyy");
          console.log("start date", startDate);
          console.log("end date", endDate);
          _context4.next = 16;
          break;

        case 14:
          startDate = dateRange.startDate;
          endDate = dateRange.endDate;

        case 16:
          // Create a list of dates between the start and end date
          dates = (0, _dateFns.eachDayOfInterval)({
            start: (0, _dateFns.parseISO)(startDate),
            end: (0, _dateFns.parseISO)(endDate)
          }); // Call supabase to fetch the average rating for dates between the start date and end date incrementing by 14 days if start date and end date are null (meaning all time)
          // If start date and end date are not null, fetch the average rating for the given date range incrementing by 1. So I can have average rating for each day in the period while summing up the total number of review ratings for each day
          // Return an array of dates and average rating up to that date for the given location

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  });
}