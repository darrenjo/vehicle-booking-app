const pool = require("../config/db");

const createBooking = async (booking) => {
  const { vehicleId, userId, driverId, approverId, startDate, endDate } =
    booking;
  const res = await pool.query(
    `INSERT INTO bookings (vehicle_id, user_id, driver_id, approver_id, start_date, end_date, admin_approval, approver_approval, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
    [
      vehicleId,
      userId,
      driverId,
      approverId,
      startDate,
      endDate,
      "pending",
      "pending",
      "pending", // Initial status
    ]
  );
  return res.rows[0];
};

const updateBookingStatus = async (bookingId, role, status) => {
  let query;
  if (role === "admin") {
    query =
      "UPDATE bookings SET admin_approval = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *";
  } else if (role === "approver") {
    query =
      "UPDATE bookings SET approver_approval = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *";
  } else {
    throw new Error("Invalid role");
  }
  const res = await pool.query(query, [status, bookingId]);
  return res.rows[0];
};

module.exports = { createBooking, updateBookingStatus };
