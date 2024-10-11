const Flight = require("../models/flight.js");

const getAllFlights = (req, res) => {
  Flight.find()
    .then((flights) => res.status(200).json(flights))
    .catch((err) => res.status(500).json("Error: " + err));
};

const addNewFlight = (req, res) => {
  const newFlight = new Flight(req.body);

  newFlight
    .save()
    .then(() => res.status(201).json("Flight added!"))
    .catch((err) => res.status(500).json("Error: " + err));
};

const getFlightById = (req, res) => {
  Flight.findById(req.params.id)
    .then((flight) => res.status(200).json(flight))
    .catch((err) => res.status(500).json("Error: " + err));
};

const deleteFlightById = (req, res) => {
  Flight.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Flight deleted."))
    .catch((err) => res.status(500).json("Error: " + err));
};

const updateFlightById = (req, res) => {
  Flight.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.status(200).json("Flight updated!"))
    .catch((err) => res.status(500).json("Error: " + err));
};

const searchFlights = (req, res) => {
  const { from, to, date } = req.body;
  const startDate = Date.parse(date);
  const endDate = startDate + 24 * 60 * 60 * 1000;

  Flight.find({ from, to, date: { $gte: startDate, $lt: endDate } })
    .exec()
    .then((flights) => res.status(200).json(flights))
    .catch((err) => res.status(500).json("Error: " + err));
};

module.exports = {
  getAllFlights,
  addNewFlight,
  getFlightById,
  deleteFlightById,
  updateFlightById,
  searchFlights,
};
