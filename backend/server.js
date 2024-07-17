const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
