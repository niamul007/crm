import * as authService from "../services/authService.mjs";
import catchAsync from "../utils/catchAsync.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = catchAsync(async (req, res) => {
  const { email, password, username } = req.body;
  const user = await authService.registerUser(email, password, username);

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "dev secret key",
    { expiresIn: "1d" },
  );

  res.status(201).json({
    status: "success",
    token: token,
    message: "Welcome to client management",
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username || "New User",
      },
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.findUserByEmail(email);

  if (!user) {
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid Credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({
      status: "Fail",
      message: "Password doesn't match",
    });
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "dev secret key",
    { expiresIn: "1d" },
  );

  res.status(200).json({
    status: "success",
    token: token,
    message: "Login succesfull",
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username || "New User",
      },
    },
  });
});
