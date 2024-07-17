const request = require("supertest");
const app = require("../backend/server"); // Adjust the path if necessary
const pool = require("../backend/config/db");

describe("Booking Creation", () => {
  afterAll(async () => {
    await pool.end();
  });

  let token;

  beforeAll(async () => {
    // Assuming you have a user registration and login process
    // Register and login a test user to get a token
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      role: "admin",
    });

    const loginRes = await request(app).post("/api/users/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    token = loginRes.body.token;
  });

  it("should not allow overlapping bookings for the same vehicle", async () => {
    const booking1 = {
      vehicleId: 1,
      userId: 1,
      driverId: 1,
      approverId: 2,
      startDate: "2024-07-20T08:00:00Z",
      endDate: "2024-07-20T12:00:00Z",
    };

    const booking2 = {
      vehicleId: 1,
      userId: 1,
      driverId: 1,
      approverId: 2,
      startDate: "2024-07-20T10:00:00Z",
      endDate: "2024-07-20T14:00:00Z",
    };

    await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send(booking1)
      .expect(201);

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send(booking2)
      .expect(400);

    expect(res.body.message).toBe(
      "Vehicle is already booked for the requested time range."
    );
  });
});
