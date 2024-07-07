"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateIsFetching = updateIsFetching;
exports.updateFetchErrorMessage = updateFetchErrorMessage;
exports.getLocationInfo = getLocationInfo;

var _supabaseClient = _interopRequireDefault(require("@/utils/supabaseClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function getLocationInfo(locationId) {
  var _ref3, data, error;

  return regeneratorRuntime.async(function getLocationInfo$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_supabaseClient["default"].from("locations").select("*").eq("id", locationId).single());

        case 2:
          _ref3 = _context3.sent;
          data = _ref3.data;
          error = _ref3.error;

          if (!error) {
            _context3.next = 8;
            break;
          }

          console.error("Error fetching location info:", error);
          return _context3.abrupt("return", {
            success: false
          });

        case 8:
          return _context3.abrupt("return", {
            success: true,
            data: data
          });

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}