"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllReviewData = getAllReviewData;

var _supabaseClient = _interopRequireDefault(require("@/utils/supabaseClient"));

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
          }; // Fetch all necessary data
          //   await fetchData("business_categories", "business_categories");


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