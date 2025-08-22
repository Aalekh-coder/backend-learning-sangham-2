require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./Utils/logger");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const routes = require("./Routes/identity-service");
const errorHandler = require("./Middleware/errorHandler")

const app = express();
const PORT = process.env.PORT || 3000;

// connect to mongodb
mongoose
  .connect(process.env?.MONGODB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Received body ${req.body} `);
  next();
});

//DDos protecting and rate limiting

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceed for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: "Too many requests",
      });
    });
});

// ip based rate limiting for sensitive endpoint

const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
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

// apply this senstiveEndpointLimiter to our routes

app.use("/api/auth/register", sensitiveEndpointsLimiter);

//Routes
app.use("/api/auth", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Identity service nunning on port ${PORT}`);
});

/// unhandled promist rejections

process.on("UnhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reson:", reason);
});
