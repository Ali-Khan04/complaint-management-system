import { sql, poolPromise } from "../db/config.js";
import { complaintsQueries, adminQueries } from "../db/query.js";

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
        .input("Time", sql.Date, currentDate)
        .query(complaintsQueries.createComplaint);

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
        .query(complaintsQueries.getComplaintsByUser);

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
        .input("userId", sql.Int, userId)
        .query(complaintsQueries.checkComplaintOwnership);

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
        .input("description", sql.NVarChar, description)
        .query(complaintsQueries.updateComplaint);

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
        .query(complaintsQueries.checkComplaintOwnership);

      if (checkResult.recordset.length === 0) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      const result = await pool
        .request()
        .input("complaintId", sql.Int, id)
        .input("userId", sql.Int, userId)
        .query(complaintsQueries.deleteComplaint);

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

  getAllComplaints: async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .query(complaintsQueries.getAllComplaints);

      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error fetching all complaints:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  markAsReviewed: async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("complaintId", sql.Int, id)
        .query(complaintsQueries.markAsReviewed);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      res.status(200).json({ message: "Complaint marked as reviewed" });
    } catch (error) {
      console.error("Error marking complaint as reviewed:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Admin related functions
  registerAdmin: async (req, res) => {
    try {
      const { adminId, name } = req.body;
      const pool = await poolPromise;

      await pool
        .request()
        .input("adminId", sql.Int, adminId)
        .input("name", sql.NVarChar(100), name)
        .query(adminQueries.registerAdmin);

      res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      console.error("Error registering admin:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default complainsController;
