import { User, Complaint } from "../db/association.js";

const complainsController = {
  createComplaint: async (req, res) => {
    try {
      const { userId, description } = req.body;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const complaint = await Complaint.create({
        userId,
        description,
        isReviewed: null,
      });

      res.status(201).json({
        complaintId: complaint.complaintId,
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

      const complaints = await Complaint.findAll({
        where: { userId },
        include: [
          {
            model: User,
            attributes: ["userId", "name", "email"],
          },
        ],
        order: [["time", "DESC"]],
      });

      res.status(200).json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateComplaint: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;
      const { description } = req.body;

      const complaint = await Complaint.findOne({
        where: {
          complaintId: id,
          userId: userId,
        },
      });

      if (!complaint) {
        return res.status(404).json({
          message:
            "Complaint not found or you don't have permission to update it",
        });
      }

      const [updatedRowsCount] = await Complaint.update(
        { description },
        {
          where: {
            complaintId: id,
            userId: userId,
          },
        }
      );

      if (updatedRowsCount > 0) {
        return res.status(200).json({
          message: "Complaint updated successfully",
        });
      } else {
        return res.status(400).json({
          message: "Failed to update complaint",
        });
      }
    } catch (error) {
      console.error("Error in updating Complaint:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  deleteComplaint: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;

      const complaint = await Complaint.findOne({
        where: {
          complaintId: id,
          userId: userId,
        },
      });

      if (!complaint) {
        return res.status(404).json({
          message:
            "Complaint not found or you don't have permission to delete it",
        });
      }
      const deletedRowsCount = await Complaint.destroy({
        where: {
          complaintId: id,
          userId: userId,
        },
      });

      if (deletedRowsCount > 0) {
        return res.status(200).json({
          message: "Complaint deleted successfully",
        });
      } else {
        return res.status(400).json({
          message: "Failed to delete complaint",
        });
      }
    } catch (error) {
      console.error("Error in deleteComplaint:", error);
      return res.status(500).json({
        message: "Server error",
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
        order: [["time", "DESC"]],
      });

      res.status(200).json(complaints);
    } catch (error) {
      console.error("Error fetching all complaints:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  getComplaintById: async (req, res) => {
    try {
      const { id } = req.params;

      const complaint = await Complaint.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["userId", "name", "email"],
          },
        ],
      });

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      res.status(200).json(complaint);
    } catch (error) {
      console.error("Error fetching complaint:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  updateReviewStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { isReviewed } = req.body;

      const [updatedRowsCount] = await Complaint.update(
        { isReviewed },
        {
          where: { complaintId: id },
        }
      );

      if (updatedRowsCount > 0) {
        return res.status(200).json({
          message: "Review status updated successfully",
        });
      } else {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
};

export default complainsController;
