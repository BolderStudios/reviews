"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PUT = exports.POST = exports.GET = exports.runtime = void 0;

var _next = require("inngest/next");

var _client = require("@/inngest/client");

var _functions = require("@/inngest/functions");

// "@/app/api/inngest/route.js"
// Enable Edge Runtime
var runtime = "edge"; // Create an API that serves your functions with streaming enabled

exports.runtime = runtime;

var _serve = (0, _next.serve)({
  client: _client.inngest,
  functions: [_functions.helloWorld, _functions.fetchYelpReviews, _functions.processYelpReviews, _functions.processSingleYelpReview],
  streaming: "allow"
}),
    GET = _serve.GET,
    POST = _serve.POST,
    PUT = _serve.PUT;

exports.PUT = PUT;
exports.POST = POST;
exports.GET = GET;