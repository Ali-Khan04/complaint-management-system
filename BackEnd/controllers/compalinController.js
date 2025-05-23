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
  getComplaintsByUser: async (req, res) => {
    try {
      const userId = req.query.userId;
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .query(
          "SELECT complaintId, description, isReviewed, Time FROM Complaints WHERE userId = @userId ORDER BY Time DESC"
        );

      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  updateComplaint: async (req, res) => {
    try {
      const { id } = req.params; // This is actually complaintId
      const userId = req.query.userId || req.body.userId;
      const { description } = req.body;

      const pool = await poolPromise;

      //checking if complaint exists and belongs to the user
      const checkResult = await pool
        .request()
        .input("complaintId", sql.Int, id)
        .input("userId", sql.Int, userId).query(`
        SELECT complaintId
        FROM Complaints
        WHERE complaintId = @complaintId AND userId = @userId
      `);

      if (checkResult.recordset.length === 0) {
        return res.status(404).json({
          message:
            "Complaint not found or you don't have permission to update it",
        });
      }

      const result = await pool
        .request()
        .input("complaintId", sql.Int, id)
        .input("userId", sql.Int, userId)
        .input("description", sql.NVarChar, description).query(`
        UPDATE Complaints
        SET description = @description
        WHERE complaintId = @complaintId AND userId = @userId
      `);

      console.log("Rows Affected:", result.rowsAffected);

      if (result.rowsAffected[0] > 0) {
        return res
          .status(200)
          .json({ message: "Complaint updated successfully" });
      } else {
        return res.status(400).json({ message: "Failed to update complaint" });
      }
    } catch (error) {
      console.error("Error in updating Complaint:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  },

  deleteComplaint: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;

      const pool = await poolPromise;

      const checkResult = await pool
        .request()
        .input("complaintId", sql.Int, id)
        .input("userId", sql.Int, userId)
        .query(
          "SELECT complaintId FROM Complaints WHERE complaintId = @complaintId AND userId = @userId"
        );

      if (checkResult.recordset.length === 0) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      const result = await pool
        .request()
        .input("complaintId", sql.Int, id)
        .input("userId", sql.Int, userId)
        .query(
          "DELETE FROM Complaints WHERE complaintId = @complaintId AND userId = @userId"
        );

      console.log("Rows Affected:", result.rowsAffected);

      if (result.rowsAffected[0] > 0) {
        return res
          .status(200)
          .json({ message: "Complaint deleted successfully" });
      } else {
        return res.status(400).json({ message: "Failed to delete complaint" });
      }
    } catch (error) {
      console.error("Error in deleteComplaint:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  },
};

export default complainsController;
