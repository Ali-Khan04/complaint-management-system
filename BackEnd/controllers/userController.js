import { sql, poolPromise } from "../db/config.js";
import { userQueries } from "../db/query.js";

export const registerUser = async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const pool = await poolPromise;
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("name", sql.VarChar(100), name)
      .input("email", sql.VarChar(100), email)
      .query(userQueries.registerUser);

    res.status(201).json({ userId });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: "Database error" });
  }
};
