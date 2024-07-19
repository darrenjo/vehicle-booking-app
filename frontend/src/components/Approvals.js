import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Approval = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/bookings/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleApproval = async (bookingId, status) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/bookings/approve",
        { bookingId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Approval Page</h1>
      {bookings.length === 0 ? (
        <p>No pending bookings</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>User ID</th>
              <th>Driver ID</th>
              <th>Approver ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.vehicle_id}</td>
                <td>{booking.user_id}</td>
                <td>{booking.driver_id}</td>
                <td>{booking.approver_id}</td>
                <td>{new Date(booking.start_date).toLocaleString()}</td>
                <td>{new Date(booking.end_date).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleApproval(booking.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(booking.id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleDashboard}>Back</button>
    </div>
  );
};

export default Approval;
