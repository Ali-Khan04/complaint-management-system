import { User, Complaint, ReviewedComplaints } from "../db/association.js";
import sequelize from "../db/config.js";
import Admin from "../db/adminSchema.js";

const adminController = {
  markAsReviewed: async (req, res) => {
    const { id } = req.params;
    const { adminId } = req.body;

    if (!id || !adminId) {
      return res
        .status(400)
        .json({ message: "Complaint id and adminId are required" });
    }

    let transaction = null;
    try {
      transaction = await sequelize.transaction();

      const complaint = await Complaint.findByPk(id, {
        transaction,
        include: [{ model: User, attributes: ["userId", "name", "email"] }],
      });

      if (!complaint) {
        await transaction.rollback();
        return res.status(404).json({ message: "Complaint not found" });
      }

      if (complaint.isReviewed) {
        await transaction.rollback();
        return res.status(400).json({ message: "Complaint already reviewed" });
      }

      await complaint.update({ isReviewed: true }, { transaction });

      const reviewedComplaint = await sequelize.query(
        `INSERT INTO [dbo].[ReviewedComplaints] 
         ([complaintId], [adminId], [complaintDescription], [reviewedDate]) 
         OUTPUT INSERTED.* 
         VALUES (:complaintId, :adminId, :complaintDescription, GETDATE())`,
        {
          replacements: {
            complaintId: id,
            adminId,
            complaintDescription: complaint.description,
          },
          type: sequelize.QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      res.json({
        message: "Complaint reviewed successfully",
        complaintId: id,
        adminId,
        reviewedDate: reviewedComplaint[0]?.[0]?.reviewedDate || new Date(),
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error reviewing complaint:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getAllComplaints: async (req, res) => {
    try {
      const complaints = await Complaint.findAll({
        include: [{ model: User, attributes: ["userId", "name", "email"] }],
        order: [["Time", "DESC"]],
      });

      res.json(complaints);
    } catch (error) {
      console.error("Error while getting complaints:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getAllReviewedComplaints: async (req, res) => {
    try {
      const reviewedComplaints = await ReviewedComplaints.findAll({
        include: [
          {
            model: Complaint,
            include: [{ model: User, attributes: ["userId", "name", "email"] }],
          },
          { model: Admin, attributes: ["adminId", "name", "email"] },
        ],
        order: [["reviewedDate", "DESC"]],
      });

      res.json(reviewedComplaints);
    } catch (error) {
      console.error("Error getting reviewed complaints:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getReviewedComplaintsByAdmin: async (req, res) => {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ message: "adminId is required" });
    }

    try {
      const reviewedComplaints = await ReviewedComplaints.findAll({
        where: { adminId },
        include: [
          {
            model: Complaint,
            include: [{ model: User, attributes: ["userId", "name"] }],
          },
          { model: Admin, attributes: ["adminId", "name"] },
        ],
        order: [["reviewedDate", "DESC"]],
      });

      if (reviewedComplaints.length === 0) {
        return res
          .status(404)
          .json({ message: "No reviewed complaints found for this admin" });
      }

      res.json(reviewedComplaints);
    } catch (error) {
      console.error("Error fetching admin's reviewed complaints:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

export default adminController;
