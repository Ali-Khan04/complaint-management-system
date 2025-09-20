import Admin from "../db/adminSchema.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

export const adminSignIn = async (req, res) => {
  const { adminId, name } = req.body;
  if (!adminId || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Required Fileds Missing " });
  }
  if (typeof adminId !== "string" || typeof name !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid SignIn Format" });
  }
  try {
    const validAdmin = await Admin.findOne({
      where: { adminId },
    });
    if (!validAdmin) {
      return res
        .status(401)
        .json({ success: false, message: "UnAuthorized , Not a admin" });
    }
    const token = jwt.sign(
      { adminId: validAdmin.adminId, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("AdminToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, //for dev
    });
    res.status(200).json({ success: true, messsage: "Admin SignedIn" });
  } catch (error) {
    console.error("Admin SignIn Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
