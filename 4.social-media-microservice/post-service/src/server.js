require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const cors = require("cors");
const postRoutes = require("./routes/post-routes");
const errorhandler = require("./middlewares/errorHandler");
const logger = require("./utils/logger");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

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

// *** Homework - implement Ip based  rate limiting for sensitive


// routes -> pass redis client to routes
app.use("/api/posts")
