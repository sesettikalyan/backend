const User = require("../models/flight-user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Token = require("../models/token.js");

dotenv.config();

const signUpFlightUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = {
      email: req.body.email,
      password: hashedPassword,
    };

    const newUser = new User(user);
    await newUser.save();
    return res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Error while signing up the user : ${error}` });
  }
};

const loginFlightUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "Email does not match" });
  }
  try {
    let match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const accesstoken = jwt.sign(
        user.toJSON(),
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );
      const refreshtoken = jwt.sign(
        user.toJSON(),
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
      const newToken = new Token({ token: refreshtoken });
      newToken.save();

      return res.status(200).json({
        accesstoken,
        refreshtoken,
        email: user.email,
      });
    } else {
      return res.status(400).json({ msg: "password does not match" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Error while login in the user : ${error}` });
  }
};

module.exports = { signUpFlightUser, loginFlightUser };
