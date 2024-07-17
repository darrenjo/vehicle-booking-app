const pool = require("../config/db");

const createUser = async (user) => {
  const { name, email, password, role } = user;
  const res = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, password, role]
  );
  return res.rows[0];
};

const getUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

module.exports = { createUser, getUserByEmail };
