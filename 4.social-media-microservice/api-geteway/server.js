require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Radis = require("ioredis");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const logger = require("./src/Utils/logger");
const proxy = require("express-http-proxy");

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

// rate limiting

const ratelimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for Ip: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many request" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

app.use(ratelimit);

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Received body ${req.body} `);
  next();
});

const proxyOption = {
  proxyReqPathResolve: (req) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      message: `Internal server error`,
      error: err?.message,
    });
  },
};


//setting up proxy for our identity service

app.use("/v1/auth", proxy(process.env.IDENTITY_SERVICE_URL, {
  ...proxy,
  proxyReqOptDecorator:(proxyReqOpts, srcReq)=>{
    proxyReqOpts.headers["Content"]
  }
}))