"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POST = POST;

var _server = require("next/server");

var _client = require("@/inngest/client");

// "@/app/api/fetch-yelp/route.js"
function POST(request) {
  var _ref, yelpBusinessLink, locationId, clerkId;

  return regeneratorRuntime.async(function POST$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(request.json());

        case 3:
          _ref = _context.sent;
          yelpBusinessLink = _ref.yelpBusinessLink;
          locationId = _ref.locationId;
          clerkId = _ref.clerkId;
          _context.next = 9;
          return regeneratorRuntime.awrap(_client.inngest.send({
            name: "fetch/yelp.reviews",
            data: {
              yelpBusinessLink: yelpBusinessLink,
              locationId: locationId,
              clerkId: clerkId
            }
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(updateIsFetching("true", clerkId));

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(updateFetchErrorMessage("", clerkId));

        case 13:
          return _context.abrupt("return", _server.NextResponse.json({
            message: "Yelp review fetch initiated"
          }, {
            status: 202
          }));

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error("Error initiating Yelp fetch: ".concat(_context.t0.message));
          return _context.abrupt("return", _server.NextResponse.json({
            success: false,
            error: _context.t0.message
          }, {
            status: 500
          }));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
}