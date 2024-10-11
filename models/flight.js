const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  airlines: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
});

const flight = mongoose.model("Flight", flightSchema);

module.exports = flight;
