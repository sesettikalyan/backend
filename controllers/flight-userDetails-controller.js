let User = require("../models/flight-user.js");
let UserDetail = require("../models/flight-userdetails.js");
let Flight = require("../models/flight.js");

module.exports = {
  getAllUserDetails: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("userDetails");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user.userDetails);
    } catch (err) {
      res.status(500).json({ error: "Server error: " + err.message });
    }
  },

  addNewUserDetail: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const newUserDetail = new UserDetail(req.body);
      const userDetail = await newUserDetail.save();
      user.userDetails.push(userDetail);
      await user.save();
      res.status(201).json({ success: true, userDetail });
    } catch (err) {
      res.status(500).json({ error: "Server error: " + err.message });
    }
  },

  getUserDetail: async (req, res, next) => {
    try {
      const { userId, userDetailId } = req.params;

      // Find the user by ID
      const user = await User.findById(userId).populate("userDetails");

      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the specific user detail from user's userDetails
      const userDetail = user.userDetails.find(
        (detail) => detail._id.toString() === userDetailId
      );

      // Check if userDetail exists
      if (!userDetail) {
        return res.status(404).json({ error: "User detail not found" });
      }

      // Return the specific userDetail
      res.status(200).json(userDetail);
    } catch (err) {
      res.status(500).json({ error: "Server error: " + err.message });
    }
  },

  deleteUserDetail: async (req, res, next) => {
    try {
      const { userId, userDetailId } = req.params;

      const user = await User.findById(userId).populate("userDetails");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userDetail = user.userDetails.find(
        (detail) => detail._id.toString() === userDetailId
      );

      if (!userDetail) {
        return res.status(404).json({ error: "User detail not found" });
      }

      await UserDetail.findByIdAndDelete(userDetailId);

      user.userDetails.pull(userDetailId);
      await user.save();

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Server error: " + err.message });
    }
  },

  replaceUserDetail: async (req, res, next) => {
    try {
      const { userId, userDetailId } = req.params;
      const newUserDetail = req.body;

      const user = await User.findById(userId).populate("userDetails");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userDetail = user.userDetails.find(
        (detail) => detail._id.toString() === userDetailId
      );

      if (!userDetail) {
        return res.status(404).json({ error: "User detail not found" });
      }

      const updatedDetail = await UserDetail.findByIdAndUpdate(
        userDetailId,
        newUserDetail,
        { new: true }
      );

      res.status(200).json({ success: true, result: updatedDetail });
    } catch (err) {
      res.status(500).json({ error: "Server error: " + err.message });
    }
  },

  //   getUserDetailFlights: async (req, res, next) => {
  //     try {
  //       const { userDetailId } = req.params;
  //       const userDetails = await UserDetail.findById(userDetailId).populate(
  //         "flights"
  //       );
  //       if (!userDetails) {
  //         return res.status(404).json({ error: "User detail not found" });
  //       }
  //       res.status(200).json(userDetails.flights);
  //     } catch (err) {
  //       res.status(500).json({ error: "Server error: " + err.message });
  //     }
  //   },

  //   addUserDetailFlight: async (req, res, next) => {
  //     try {
  //       const { userDetailId } = req.params;
  //       const newFlight = new Flight(req.body);
  //       const userDetail = await UserDetail.findById(userDetailId);
  //       if (!userDetail) {
  //         return res.status(404).json({ error: "User detail not found" });
  //       }
  //       await newFlight.save();
  //       userDetail.flights.push(newFlight);
  //       await userDetail.save();
  //       res.status(201).json(newFlight);
  //     } catch (err) {
  //       res.status(500).json({ error: "Server error: " + err.message });
  //     }
  //   },

  //   addUserDetailFlightById: async (req, res, next) => {
  //     try {
  //       const { userDetailId, flightId } = req.params;
  //       const newFlight = await Flight.findById(flightId);
  //       if (!newFlight) {
  //         return res.status(404).json({ error: "Flight not found" });
  //       }
  //       const userDetail = await UserDetail.findById(userDetailId);
  //       if (!userDetail) {
  //         return res.status(404).json({ error: "User detail not found" });
  //       }
  //       userDetail.flights.push(newFlight);
  //       await userDetail.save();
  //       res.status(201).json(newFlight);
  //     } catch (err) {
  //       res.status(500).json({ error: "Server error: " + err.message });
  //     }
  //   },

  //   cancelUserDetailFlightById: async (req, res, next) => {
  //     try {
  //       const { userDetailId, flightId } = req.params;
  //       const userDetail = await UserDetail.findById(userDetailId);
  //       if (!userDetail) {
  //         return res.status(404).json({ error: "User detail not found" });
  //       }
  //       const flight = await Flight.findById(flightId);
  //       if (!flight) {
  //         return res.status(404).json({ error: "Flight not found" });
  //       }
  //       userDetail.flights.pull(flight);
  //       await userDetail.save();
  //       res.status(200).json({ success: true });
  //     } catch (err) {
  //       res.status(500).json({ error: "Server error: " + err.message });
  //     }
  //   },
};
