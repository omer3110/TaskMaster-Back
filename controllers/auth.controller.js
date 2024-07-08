const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

async function register(req, res) {
  console.log("register");
  try {
    const { username, email, password } = req.body;

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // Hash password
    const user = new User({
      username,
      email,
      password: hashedPassword,
    }); // Create new user object
    await user.save(); // Save user to database

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("register", error.name);
    if (error.code === 11000) {
      console.log("username or email already exists");
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    // Generate JWT token containing user id
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token in response to the client, not the user object!
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    res.json(user);
    console.log(user);
  } catch (err) {
    if (err.name === "CastError") {
      console.log(
        `user.controller, getUserById. User not found with id: ${id}`
      );
      return res.status(404).json({ message: "User not found" });
    }
    console.log(
      `user.controller, getUserById. Error while getting User with id: ${id}`,
      err.name
    );
    res.status(500).json({ message: err.message });
  }
}

// async function addProductToUser(req, res) {
//   const { id } = req.params;
//   const { products } = req.body;
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { products },
//       { new: true, runValidators: true }
//     );
//     if (!updatedUser) {
//       console.log(
//         `user.controller, addProductToUser. User not found with id: ${id}`
//       );
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({
//       message: "User changed successfully",
//       user: updatedUser,
//     });
//   } catch (err) {
//     console.log(
//       `user.controller, addProductToUser. Error while updating user with id: ${id}`,
//       err
//     );
//     if (err.name === "ValidationError") {
//       // Mongoose validation error
//       console.log(`user.controller, addProductToUser. ${err.message}`);
//       res.status(400).json({ message: err.message });
//     } else {
//       // Other types of errors
//       console.log(`user.controller, addProductToUser. ${err.message}`);
//       res.status(500).json({ message: "Server error while updating user" });
//     }
//   }
// }
module.exports = { register, login, getUserById };
