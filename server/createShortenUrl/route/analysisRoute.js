const express = require("express");
const {
  shortenURL,
  redirectToLongUrl,
  analyseUserDetails,
  getAnalytics,
} = require("../controller/shortenUrlController");

const {
  shortenUrlLimiter,
} = require("../controller/rateLimit");

const {
  getUrlAnalyticsAPI,
} = require("../controller/getUrlAnalyticsAPI");

const {analysisTopic} = require("../controller/getTopicAnalysis")
const router = express.Router();

// if you post more than 10 times you will get error message using rateLimit
// error 429 Too Many Requests (that is shortenUrlLimiter works)
router.post("/createShortUrl", shortenUrlLimiter, shortenURL);
router.get("/redirectLongUrl/:alias", redirectToLongUrl);
router.get("/analyseUserDetails/:alias", analyseUserDetails);
router.get("/getAnalytics/:alias", getAnalytics);
router.get("/analytics/:alias", getUrlAnalyticsAPI);
router.get("/analytics/topic/:topic",analysisTopic);

module.exports = router;
