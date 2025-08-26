const { createPost } = require("../controller/postController");
const express = require("express");
const { authenticateRequest } = require("../middlewares/authmiddleware");

const router = express();
// middleware -> this will tell if the  user is an auth user or not

router.use(authenticateRequest);

router.post("/create-post", createPost);

module.exports = router;
