const rateLimit = require("express-rate-limit");

const createBasicRateLimiter = (maxRequest, time) => {
  return rateLimit({
    max: maxRequest,
    windowMs: time,
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports ={createBasicRateLimiter}