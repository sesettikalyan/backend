const User = require("../models/flight-user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Token = require("../models/token.js");

dotenv.config();

const signUpFlightUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = {
      email: req.body.email,
      password: hashedPassword,
      userType: req.body.userType || "user",
    };

    // Save the new user
    const newUser = new User(user);
    await newUser.save();
    return res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Error while signing up the user: ${error.message}` });
  }
};

const loginFlightUser = async (req, res) => {
  try {
    // Find the user by email
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ msg: "Email does not match" });
    }

    // Compare passwords
    let match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      // Generate access and refresh tokens
      const accesstoken = jwt.sign(
        { _id: user._id, email: user.email, userType: user.userType },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );
      const refreshtoken = jwt.sign(
        { _id: user._id, email: user.email, userType: user.userType },
        process.env.REFRESH_TOKEN_SECRET_KEY
      );

      const newToken = new Token({ token: refreshtoken });
      await newToken.save();

      return res.status(200).json({
        accesstoken,
        refreshtoken,
        email: user.email,
        userType: user.userType,
        _id: user._id,
      });
    } else {
      return res.status(400).json({ msg: "Password does not match" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Error while logging in the user: ${error.message}` });
  }
};

module.exports = { signUpFlightUser, loginFlightUser };
