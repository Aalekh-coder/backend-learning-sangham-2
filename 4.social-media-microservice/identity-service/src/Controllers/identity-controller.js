const logger = require("../Utils/logger");
const { validateRegistration } = require("../Utils/validation");
const User = require("../Models/User");
const generateToken = require("../Utils/generateToken");
// user register

const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit...");
  try {
    // validate the schema
    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password, username } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ username, email, password });
    console.log("user",user);
    await user.save();
    logger.warn("User saved  successfully", user?._id);

    const { accessToken, refreshToken } = await generateToken(user);

    return res.status(201).json({
      success: "true",
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(`Registration error occured`);
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// user login

// refresh token

// logout

module.exports = { registerUser };
