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
  // Admin related functions
  markAsReviewed: async (req, res) => {
    const { id } = req.params;
    const { adminId } = req.body;

    try {
      const pool = await poolPromise;
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        // Get complaint and check if exists/already reviewed
        const complaint = await new sql.Request(transaction)
          .input("complaintId", sql.Int, id)
          .query(complaintsQueries.getComplaintById);

        if (!complaint.recordset.length) {
          await transaction.rollback();
          return res.status(404).json({ message: "Complaint not found" });
        }

        if (complaint.recordset[0].isReviewed) {
          await transaction.rollback();
          return res
            .status(400)
            .json({ message: "Complaint already reviewed" });
        }

        // Mark as reviewed
        await new sql.Request(transaction)
          .input("complaintId", sql.Int, id)
          .query(complaintsQueries.markAsReviewed);

        // Save to reviewed complaints
        const reviewedDate = new Date();
        await new sql.Request(transaction)
          .input("complaintId", sql.Int, id)
          .input("adminId", sql.Int, adminId)
          .input(
            "complaintDescription",
            sql.NVarChar(250),
            complaint.recordset[0].description
          )
          .input("reviewedDate", sql.DateTime, reviewedDate)
          .query(complaintsQueries.insertReviewedComplaint);

        await transaction.commit();

        res.json({
          message: "Complaint reviewed successfully",
          complaintId: id,
          adminId,
          reviewedDate,
        });
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (error) {
      console.error("Error reviewing complaint:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllReviewedComplaints: async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .query(adminQueries.getAllReviewedComplaints);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching reviewed complaints:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getReviewedComplaintsByAdmin: async (req, res) => {
    try {
      const { adminId } = req.params;
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("adminId", sql.Int, adminId)
        .query(adminQueries.getReviewedComplaintsByAdmin);

      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching admin's reviewed complaints:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  registerAdmin: async (req, res) => {
    try {
      const { adminId, name } = req.body;
      const pool = await poolPromise;

      await pool
        .request()
        .input("adminId", sql.Int, adminId)
        .input("name", sql.NVarChar(100), name)
        .query(adminQueries.registerAdmin);

      res.status(201).json({ adminId });
    } catch (error) {
      console.error("Error registering admin:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default complainsController;
