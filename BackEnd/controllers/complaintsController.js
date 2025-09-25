import { User, Complaint } from "../db/association.js";

const complainsController = {
  createComplaint: async (req, res) => {
    try {
      const { userId, description } = req.body;

      if (!userId || !description) {
        return res
          .status(400)
          .json({ message: "userId and description are required" });
      }

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
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const complaints = await Complaint.findAll({
        where: { userId },
        include: [{ model: User, attributes: ["userId", "name", "email"] }],
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

      if (!description || !id || !userId) {
        return res
          .status(400)
          .json({ message: "Description, Id, or userId missing" });
      }

      const complaint = await Complaint.findOne({
        where: { complaintId: id, userId },
      });
      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found or you don't have permission",
        });
      }

      const [updatedRowsCount] = await Complaint.update(
        { description },
        { where: { complaintId: id, userId } }
      );

      res.status(updatedRowsCount > 0 ? 200 : 400).json({
        message:
          updatedRowsCount > 0
            ? "Complaint updated successfully"
            : "Failed to update complaint",
      });
    } catch (error) {
      console.error("Error in updating Complaint:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteComplaint: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;

      const complaint = await Complaint.findOne({
        where: { complaintId: id, userId },
      });
      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found or you don't have permission",
        });
      }

      const deletedRowsCount = await Complaint.destroy({
        where: { complaintId: id, userId },
      });

      res.status(deletedRowsCount > 0 ? 200 : 400).json({
        message:
          deletedRowsCount > 0
            ? "Complaint deleted successfully"
            : "Failed to delete complaint",
      });
    } catch (error) {
      console.error("Error in deleteComplaint:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateReviewStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { isReviewed } = req.body;

      if (typeof isReviewed !== "boolean") {
        return res
          .status(400)
          .json({ message: "isReviewed must be true or false" });
      }

      const [updatedRowsCount] = await Complaint.update(
        { isReviewed },
        { where: { complaintId: id } }
      );

      res.status(updatedRowsCount > 0 ? 200 : 404).json({
        message:
          updatedRowsCount > 0
            ? "Review status updated successfully"
            : "Complaint not found",
      });
    } catch (error) {
      console.error("Error updating review status:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default complainsController;
