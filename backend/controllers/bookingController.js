const {
  createBooking: createBookingModel,
  updateBookingStatus,
} = require("../models/Booking");
const pool = require("../config/db");

const createBooking = async (req, res) => {
  try {
    const { vehicleId, userId, driverId, startDate, endDate } = req.body;

    // Check for overlapping bookings for the same vehicle
    const overlappingVehicleBookingsQuery = `
      SELECT * FROM bookings
      WHERE vehicle_id = $1
      AND (
        (start_date, end_date) OVERLAPS ($2::timestamp, $3::timestamp)
      )
    `;
    const { rows: overlappingVehicleBookings } = await pool.query(
      overlappingVehicleBookingsQuery,
      [vehicleId, startDate, endDate]
    );

    if (overlappingVehicleBookings.length > 0) {
      return res.status(400).json({
        message: "Vehicle is already booked for the requested time range.",
      });
    }

    // Check for overlapping bookings for the same driver and user
    const overlappingDriverBookingsQuery = `
      SELECT * FROM bookings
      WHERE driver_id = $1
      AND user_id = $2
      AND (
        (start_date, end_date) OVERLAPS ($3::timestamp, $4::timestamp)
      )
    `;
    const { rows: overlappingDriverBookings } = await pool.query(
      overlappingDriverBookingsQuery,
      [driverId, userId, startDate, endDate]
    );

    if (overlappingDriverBookings.length > 0) {
      return res.status(400).json({
        message: "Driver is already booked at requested time range.",
      });
    }

    const newBooking = await createBookingModel(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveBooking = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const userRole = req.user.role;

    if (!["admin", "approver"].includes(userRole)) {
      return res.status(400).json({ message: "Invalid role for approval" });
    }

    const updatedBooking = await updateBookingStatus(
      bookingId,
      userRole,
      status
    );

    // Check if both approvals are done
    if (
      updatedBooking.admin_approval === "approved" &&
      updatedBooking.approver_approval === "approved"
    ) {
      // All approvals are done, update the final status
      await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
        "approved",
        bookingId,
      ]);
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, approveBooking };
