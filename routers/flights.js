const router = require("express").Router();
const {
  getAllFlights,
  addNewFlight,
  getFlightById,
  deleteFlightById,
  updateFlightById,
  searchFlights,
} = require("../controllers/flight-controller.js");

router.route("/").get(getAllFlights).post(addNewFlight);
router
  .route("/:id")
  .get(getFlightById)
  .delete(deleteFlightById)
  .patch(updateFlightById);
router.route("/search").post(searchFlights);

module.exports = router;
