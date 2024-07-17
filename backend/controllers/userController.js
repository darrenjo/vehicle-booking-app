const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await getUserByEmail(email);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

module.exports = { registerUser, loginUser };
