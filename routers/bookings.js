const router = require("express").Router();
const BookingsController = require("../controllers/booking-controller.js");

router
  .route("/")
  .get(BookingsController.getAllBookings)
  .post(BookingsController.addNewBooking);

router
  .route("/:bookingId")
  .get(BookingsController.getBookingById)
  .delete(BookingsController.cancelBooking);

router
  .route("/userDetails/:userDetailId")
  .get(BookingsController.getUserDetailBookings);

router.route("/payment").post(BookingsController.payment);
router.route("/verification").post(BookingsController.verifyPayment);
module.exports = router;
