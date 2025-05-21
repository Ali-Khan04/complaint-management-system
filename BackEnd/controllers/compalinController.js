import { sql, poolPromise } from "../db/config.js";

const complainsController = {
  createComplaint: async (req, res) => {
    try {
      const { userId, description } = req.body;
      const pool = await poolPromise;
      const currentDate = new Date();
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("description", sql.VarChar(250), description)
        .input("Time", sql.Date, currentDate).query(`
          INSERT INTO Complaints (userId, description, Time)
          VALUES (@userId, @description, @Time);
          SELECT SCOPE_IDENTITY() AS complaintId;
        `);
      const complaintId = result.recordset[0].complaintId;
      res.status(201).json({
        complaintId,
        message: "Complaint submitted successfully",
      });
    } catch (error) {
      console.error("Error creating complaint:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default complainsController;
