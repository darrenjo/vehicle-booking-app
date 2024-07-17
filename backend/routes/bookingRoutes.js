const express = require("express");
const {
  createBooking,
  approveBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createBooking);
router.post("/approve", protect, approveBooking);

module.exports = router;
