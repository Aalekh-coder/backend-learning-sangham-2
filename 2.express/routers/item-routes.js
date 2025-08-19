const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const router = express.Router();

const items = [
  { id: 1, name: "item 1" },
  { id: 2, name: "item 2" },
  { id: 3, name: "item 3" },
  { id: 4, name: "item 4" },
  { id: 5, name: "item 5" },
];

router.get(
  "/items",
  asyncHandler(async (req, res) => {
  return  res.json(items);
  })
);

module.exports = router;
