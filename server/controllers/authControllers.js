import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */

export const registerUser = async function (req, res) {
  try {
    const { name, email, password } = req.body;

    //check if all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //ensure user exists or not
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "user already exists." });
    }
    console.log(name);
    const user = await User.create({
      name,

      email,

      password,
    });
    console.log(name);
    res.status(201).json({
      user_id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc Login user
 * @route Post /api/auth/login
 * @access Public
 */

export const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    //Login success response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
