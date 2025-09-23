import Admin from "../db/adminSchema.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

export const adminSignIn = async (req, res) => {
  const { adminId, name } = req.body;
  if (!adminId || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Admin ID and name are required" });
  }
  const numericAdminId =
    typeof adminId === "string" ? parseInt(adminId) : adminId;

  if (isNaN(numericAdminId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Admin ID format" });
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid name format" });
  }

  try {
    const validAdmin = await Admin.findOne({
      where: {
        adminId: numericAdminId,
        name: name.trim(),
      },
    });

    if (!validAdmin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      {
        adminId: validAdmin.adminId,
        name: validAdmin.name,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("AdminToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({
      success: true,
      message: "Admin signed in successfully",
      admin: {
        adminId: validAdmin.adminId,
        name: validAdmin.name,
        email: validAdmin.email,
      },
    });
  } catch (error) {
    console.error("Admin SignIn Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
