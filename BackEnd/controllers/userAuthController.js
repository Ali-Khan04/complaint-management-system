import bcrypt from "bcrypt";
import { Op } from "sequelize";
import User from "../db/userSchema.js";
import jwt from "jsonwebtoken";
export const userSignUp = async (req, res) => {
  let { userId, name, email, password } = req.body;
  if (!userId || !name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields missing" });
  }

  userId = userId.trim();
  name = name.trim();
  email = email.trim();

  if (
    typeof userId !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input format" });
  }

  try {
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ userId }, { email }],
      },
    });

    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userId,
      name,
      email,
      password: hashPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const userSignIn = async (req, res) => {
  const { userId, email, password } = req.body;
  if (!userId || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Required Fields Missing" });
  }
  if (
    typeof userId !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input Format" });
  }
  try {
    const validUser = await User.findByPk(userId);
    if (!validUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, validUser.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: validUser.userId, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("userToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, //for dev
    });
    res.status(200).json({
      success: true,
      message: "User Signed In!",
      user: {
        userId: validUser.userId,
        name: validUser.name,
        email: validUser.email,
      },
    });
  } catch (error) {
    console.error("User SignIn Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
