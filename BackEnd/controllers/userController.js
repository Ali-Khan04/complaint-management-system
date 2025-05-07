import { sql, poolPromise } from "../db/config.js";

export const registerUser = async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const pool = await poolPromise;
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("name", sql.VarChar(100), name)
      .input("email", sql.VarChar(100), email)
      .query(
        "INSERT INTO User_table (userId, name, email) VALUES (@userId, @name, @email)"
      );

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: "Database error" });
  }
};
