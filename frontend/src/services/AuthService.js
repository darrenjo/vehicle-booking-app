// src/services/AuthService.js
const API_URL = "http://localhost:5000/api/users/"; // Sesuaikan URL backend Anda

const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  localStorage.setItem("user", JSON.stringify(data));
};

const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.token;
};

const AuthService = {
  login,
  isAuthenticated,
};

export default AuthService;
