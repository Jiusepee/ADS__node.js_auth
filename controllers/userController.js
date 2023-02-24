const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

// @desc Register new user
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  //Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "simple",
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Login a user
// @route POST /api/users/login
// @access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// meta dabar prisijungusio userio duomenis
// @desc Get user data
// @route GET /api/users/user
// @access Private

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc Get all users data
// @route GET /api/users/list
// @access Private

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "ads",
        localField: "_id",
        foreignField: "user",
        as: "ads",
      },
    },
    {
      $match: { role: { $in: ["simple", "admin"] } }
    },
    {
      $unset: [
        "password",
        "createdAt",
        "updatedAt",
        "ads.createdAt",
        "ads.updatedAt",
        "ads.__v",
        "__v",
      ],
    },
  ]);
  res.status(200).json(users);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
};
