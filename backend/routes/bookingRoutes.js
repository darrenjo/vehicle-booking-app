const express = require("express");
const {
  createBooking,
  approveBooking,
  getAllBookings,
  getPendingBookings,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createBooking);
router.get("/", protect, getAllBookings);
router.post("/approve", protect, approveBooking);
router.get("/pending", protect, getPendingBookings);

module.exports = router;
