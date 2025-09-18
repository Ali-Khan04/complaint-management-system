import bcrypt from "bcrypt";
import { Op } from "sequelize";
import User from "../db/userSchema.js";

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
