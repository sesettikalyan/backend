const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Token = require("../models/token.js");

dotenv.config();

const signUpUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = {
      name: req.body.name,
      username: req.body.username,
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

const loginUser = async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ msg: "Username does not match" });
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
        name: user.name,
        username: user.username,
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

{
  /* crypto transaction signatures*/
}
const getSolanaData = async (req, res) => {
  try {
    const solanaRpcUrl = "https://api.devnet.solana.com";
    // const solanaRpcUrl = "https://docs-demo.solana-mainnet.quiknode.pro";

    const response = await fetch(solanaRpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSignaturesForAddress",
        params: [req.params.address, { limit: 6 }],
      }),
    });
    console.log("resp", response);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ msg: "Error fetching Solana data" });
    }

    const data = await response.json();
    console.log("data", data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { signUpUser, loginUser, getSolanaData };
