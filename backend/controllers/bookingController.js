const {
  createBooking: createBookingModel,
  updateBookingStatus,
} = require("../models/Booking");
const pool = require("../config/db");

const createBooking = async (req, res) => {
  try {
    const { vehicleId, userId, driverId, approverId, startDate, endDate } =
      req.body;

    if (
      !vehicleId ||
      !userId ||
      !driverId ||
      !approverId ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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
        message: "Driver is already booked at the requested time range.",
      });
    }

    const newBooking = await createBookingModel(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM bookings");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getPendingBookings = async (req, res) => {
  try {
    const { rows: bookings } = await pool.query(`
      SELECT * FROM bookings
      WHERE status = 'pending'
    `);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/bookingController.js
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

    if (
      updatedBooking.admin_approval === "approved" &&
      updatedBooking.approver_approval === "approved"
    ) {
      await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
        "approved",
        bookingId,
      ]);
    } else if (status === "rejected") {
      await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
        "rejected",
        bookingId,
      ]);
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  approveBooking,
  getAllBookings,
  getPendingBookings,
};
