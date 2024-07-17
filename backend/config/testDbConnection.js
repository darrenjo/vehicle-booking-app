const pool = require("./db");

const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the database successfully");
    client.release();
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

testDbConnection();
