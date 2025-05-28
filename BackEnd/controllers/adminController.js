import { complaintsQueries, adminQueries } from "../db/query.js";
import { sql, poolPromise } from "../db/config.js";
const adminController = {
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
            sql.VarChar(250),
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
export default adminController;
