const logger = require("../Utils/logger");
const { validateRegistration, validateLogin } = require("../Utils/validation");
const User = require("../Models/User");
const generateToken = require("../Utils/generateToken");
const RefreshToken = require("../Models/Refreshtoken");
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
    console.log("user", user);
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
    logger.error(`Registration error ocurred`);
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// user login
const loginUser = async (req, res) => {
  logger.info("Login endpoint hit...");
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // valid password or not

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid credentials");
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const { accessToken, refreshToken } = await generateToken(user);

    res.json({
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (error) {
    logger.error(`Login error occurred`);
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// refresh token
const refreshTokenUser = async (req, res) => {
  logger.info("refresh endpoint hit");

  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warm("Refresh token missing");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn("Invalid or expires refresh token");

      return res.status(401).json({
        success: false,
        message: `Invalid or expires refresh token`,
      });
    }

    const user = await User.findById(storedToken.user);

    if (!user) {
      logger.warn("User not  found");

      return res.status(401).json({
        success: false,
        message: `User not found`,
      });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateToken(user);

    // delete the old refresh token
    await RefreshToken.deleteOne({ _id: newRefreshToken });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error("refresh token  error occured", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// logout
const logoutUser = async (req, res) => {
  logger.info("Logout endpoint hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warm("Refresh token missing");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const deleteToken = await RefreshToken.deleteOne({ token: refreshToken });
    logger.info("refresh token delete for logout");

    res.json({
      success: true,
      message: "logged out successfully",
      deleteToken,
    });
  } catch (error) {
    logger.error("error while log out", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { registerUser, loginUser, refreshTokenUser,logoutUser};
