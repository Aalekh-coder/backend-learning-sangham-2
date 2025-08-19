require("dotenv").config();
const express = require("express");
const { configureCors } = require("./config/corsConfig");
const {
  requestLogger,
  addTimeStamp,
} = require("./middleware/customMiddleware");
const {
  globalErrorhandler,
  ApiError,
  asyncHandler,
} = require("./middleware/errorHandler");

const {
  urlVersioning,
  headerVersioning,
  contentTypeVersioninig,
} = require("./middleware/apiVersioning");
const { createBasicRateLimiter } = require("./middleware/rateLimiting");

const app = express();
const PORT = process.env.PORT;

app.use(requestLogger);
app.use(addTimeStamp);

app.use(configureCors());
app.use(createBasicRateLimiter(100, 15 * 60 * 1000));
app.use(express.json());

app.use(globalErrorhandler);
app.use("/api/v1", urlVersioning("v1"));

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
