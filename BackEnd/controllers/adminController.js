import { User, Complaint, ReviewedComplaints } from "../db/association.js";
import sequelize from "../db/config.js";
import Admin from "../db/adminSchema.js";

const adminController = {
  markAsReviewed: async (req, res) => {
    const { id } = req.params;
    const { adminId } = req.body;
    let transaction = null;
    try {
      transaction = await sequelize.transaction();

      const complaint = await Complaint.findByPk(id, {
        transaction,
        include: [
          {
            model: User,
            attributes: ["userId", "name", "email"],
          },
        ],
      });

      if (!complaint) {
        if (transaction) await transaction.rollback();
        return res.status(404).json({ message: "Complaint not found" });
      }

      if (complaint.isReviewed) {
        if (transaction) await transaction.rollback();
        return res.status(400).json({ message: "Complaint already reviewed" });
      }
      await complaint.update({ isReviewed: true }, { transaction });

      /* Create reviewed complaint record WITHOUT specifying reviewedDate 
       since sql couldnt parse the date
       Let the database handle it with GETDATE() default  */
      const reviewedComplaint = await sequelize.query(
        `INSERT INTO [dbo].[ReviewedComplaints] 
         ([complaintId], [adminId], [complaintDescription], [reviewedDate]) 
         OUTPUT INSERTED.* 
         VALUES (:complaintId, :adminId, :complaintDescription, GETDATE())`,
        {
          replacements: {
            complaintId: id,
            adminId: adminId,
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
      if (transaction) {
        try {
          await transaction.rollback();
        } catch (rollbackError) {
          console.error("Error rolling back transaction:", rollbackError);
        }
      }

      console.error("Error reviewing complaint:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  getAllComplaints: async (req, res) => {
    try {
      const complaints = await Complaint.findAll({
        include: [
          {
            model: User,
            attributes: ["userId", "name", "email"],
          },
        ],
        order: [["Time", "DESC"]],
      });

      res.json(complaints);
    } catch (error) {
      console.error("Error while getting complaints:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  getAllReviewedComplaints: async (req, res) => {
    try {
      const reviewedComplaints = await ReviewedComplaints.findAll({
        include: [
          {
            model: Complaint,
            include: [
              {
                model: User,
                attributes: ["userId", "name", "email"],
              },
            ],
          },
          {
            model: Admin,
            attributes: ["adminId", "name", "email"],
          },
        ],
        order: [["reviewedDate", "DESC"]],
      });

      res.json(reviewedComplaints);
    } catch (error) {
      console.error("Errorgetting reviewed complaints:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  // for future advancements
  getReviewedComplaintsByAdmin: async (req, res) => {
    try {
      const { adminId } = req.params;

      const reviewedComplaints = await ReviewedComplaints.findAll({
        where: { adminId },
        include: [
          {
            model: Complaint,
            include: [
              {
                model: User,
                attributes: ["userId", "name"],
              },
            ],
          },
          {
            model: Admin,
            attributes: ["adminId", "name"],
          },
        ],
        order: [["reviewedDate", "DESC"]],
      });

      if (reviewedComplaints.length === 0) {
        return res.status(404).json({
          message: "No reviewed complaints found for this admin",
        });
      }

      res.json(reviewedComplaints);
    } catch (error) {
      console.error("Error fetching admin's reviewed complaints:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};
export default adminController;
