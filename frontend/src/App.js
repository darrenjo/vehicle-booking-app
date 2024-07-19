import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import BookingForm from "./components/BookingForm";
import Approval from "./components/Approvals";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<BookingForm />} />
          <Route path="/approvals" element={<Approval />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
