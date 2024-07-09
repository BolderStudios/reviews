"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inngest = void 0;

var _inngest = require("inngest");

// "@inngest/client"
var inngest = new _inngest.Inngest({
  id: "reviews" //   endpoint: `https://${process.env.NEXT_PUBLIC_SITE_URL}/api/inngest`,

});
exports.inngest = inngest;