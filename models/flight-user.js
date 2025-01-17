const mongoose = require("mongoose");

const flightUserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  userDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetail",
    },
  ],
});

const flightUser = mongoose.model("flightUser", flightUserSchema);

module.exports = flightUser;
