"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchYelpReviews = exports.helloWorld = void 0;

var _client = require("./client");

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

var fetchYelpReviews = _client.inngest.createFunction({
  id: "fetch-yelp-reviews"
}, {
  event: "fetch/yelp.reviews"
}, function _callee2(_ref2) {
  var event, step;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          event = _ref2.event, step = _ref2.step;
          _context2.next = 3;
          return regeneratorRuntime.awrap(step.sleep("wait-a-moment", "1s"));

        case 3:
          return _context2.abrupt("return", {
            event: event,
            body: "Yelp reviews fetched!"
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.fetchYelpReviews = fetchYelpReviews;