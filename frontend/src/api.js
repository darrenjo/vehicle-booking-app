import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  return response;
};

export const createBooking = async (bookingData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(`${API_URL}/bookings`, bookingData, config);
  return response;
};

export const getBookings = () => {
  return axios.get(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
