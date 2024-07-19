// src/components/BookingForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api";

const BookingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleId: "",
    userId: "",
    driverId: "",
    approverId: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking(formData);
      alert("Booking created successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to create booking");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Vehicle ID:</label>
        <input
          type="number"
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>User ID:</label>
        <input
          type="number"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Driver ID:</label>
        <input
          type="number"
          name="driverId"
          value={formData.driverId}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Approver ID:</label>
        <input
          type="number"
          name="approverId"
          value={formData.approverId}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="datetime-local"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <button onClick={handleBack}>Back</button>
      <button type="submit">Create Booking</button>
    </form>
  );
};

export default BookingForm;
