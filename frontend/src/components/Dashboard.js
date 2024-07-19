import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings } from "../api";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleCreateBooking = () => {
    navigate("/bookings");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleApproval = () => {
    navigate("/approvals");
  };

  return (
    <div>
      <h1>Vehicle Booking Dashboard</h1>
      <p>Welcome, {role}</p>
      <p>Statistics and other information will be displayed here.</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleApproval}>Approval</button>
      <button onClick={handleCreateBooking}>Create Booking</button>

      <h2>Booking Status</h2>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              Time: {booking.start_date}, Booking ID: {booking.id}, Vehicle ID:{" "}
              {booking.vehicle_id}, Admin approval: {booking.admin_approval},
              Approver approval: {booking.approver_approval}, Status:{" "}
              {booking.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings available</p>
      )}
    </div>
  );
};

export default Dashboard;
