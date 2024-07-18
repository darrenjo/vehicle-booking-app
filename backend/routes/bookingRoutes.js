const express = require("express");
const {
  createBooking,
  approveBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createBooking);
router.get("/", protect, getAllBookings);
router.put("/approve", protect, approveBooking);

module.exports = router;
