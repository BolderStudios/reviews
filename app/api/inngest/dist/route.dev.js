"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PUT = exports.POST = exports.GET = void 0;

var _next = require("inngest/next");

var _client = require("@/inngest/client");

var _functions = require("@/inngest/functions");

// "@/app/api/inngest/route.js"
// Create an API that serves zero functions
var _serve = (0, _next.serve)({
  client: _client.inngest,
  functions: [
  /* your functions will be passed here later! */
  _functions.helloWorld, _functions.fetchYelpReviews]
}),
    GET = _serve.GET,
    POST = _serve.POST,
    PUT = _serve.PUT;

exports.PUT = PUT;
exports.POST = POST;
exports.GET = GET;