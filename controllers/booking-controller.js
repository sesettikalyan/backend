let Booking = require("../models/booking.js");
let User = require("../models/flight-userdetails.js");
let Flight = require("../models/flight.js");

const Razorpay = require("razorpay");
const shortid = require("shortid");
const crypto = require("crypto");
var customId = require("custom-id");
require("dotenv").config();

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

module.exports = {
  getAllBookings: async (req, res, next) => {
    try {
      const bookings = await Booking.find().populate("flight").populate("user");
      res.status(200).json(bookings);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get bookings", details: error.message });
    }
  },

  getBookingById: async (req, res, next) => {
    const { bookingId } = req.params;
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get booking", details: error.message });
    }
  },

  addNewBooking: async (req, res, next) => {
    const userId = req.body.user;
    const flightId = req.body.flight;

    try {
      const flight = await Flight.findById(flightId);
      const user = await User.findById(userId);

      if (!flight || !user) {
        return res.status(404).json({ error: "Flight or User not found" });
      }

      let bookingId = customId({
        name: flight.from + flight.to + flight.airlines,
        email: user.firstName + user.lastName,
      });
      console.log(bookingId);

      user.flights.push(flight);
      await user.save();

      const newBooking = new Booking({ bookingId, flight, user });
      const booking = await newBooking.save();
      res.status(201).json(booking);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to add booking", details: error.message });
    }
  },

  cancelBooking: async (req, res, next) => {
    const { bookingId } = req.params;
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const userId = booking.user;
      const flightId = booking.flight;

      const result = await Booking.findByIdAndDelete(bookingId);

      const user = await User.findById(userId);
      const flight = await Flight.findById(flightId);

      if (user && flight) {
        user.flights.pull(flight);
        await user.save();
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to cancel booking", details: error.message });
    }
  },

  getUserDetailBookings: async (req, res, next) => {
    const { userDetailId } = req.params;
    try {
      const bookings = await Booking.find({ user: userDetailId })
        .populate("flight")
        .populate("user");
      if (bookings.length === 0) {
        return res
          .status(404)
          .json({ error: "No bookings found for this user" });
      }
      res.status(200).json(bookings);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get user bookings", details: error.message });
    }
  },

  payment: async (req, res, next) => {
    console.log(req.body.fare);
    const payment_capture = 1;
    const amount = req.body.fare * 100;
    console.log(amount);
    const currency = "INR";
    const receipt = shortid.generate();
    try {
      const response = await instance.orders.create({
        amount,
        currency,
        receipt,
        payment_capture,
      });
      console.log(response);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (error) {
      console.log(error);
    }
  },

  verifyPayment: (req, res) => {
    const secret = process.env.KEY_SECRET;

    console.log(req.body);

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
    } else {
      // pass it
    }
    res.json({ status: "ok" });
  },
};
