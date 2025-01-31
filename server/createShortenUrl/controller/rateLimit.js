const rateLimit = require("express-rate-limit"); 

// Rate limiter for the shortenURL route (e.g., createShortUrl)
const shortenUrlLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    
    max: 10, // Limit each IP to 10 requests per 10 minutes
    message: "Too many requests to create a shortened URL. Please try again later.",
  });

  module.exports = {
    shortenUrlLimiter
  }