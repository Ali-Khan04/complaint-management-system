import express from "express";
import complaintsController from "../controllers/complaintsController.js";
import adminController from "../controllers/adminController.js";

const complainRouter = express.Router();

// User complaint routes
complainRouter.post("/complain", complaintsController.createComplaint);
complainRouter.get("/complain", complaintsController.getComplaintsByUser);
complainRouter.put("/complain/:id", complaintsController.updateComplaint);
complainRouter.delete("/complain/:id", complaintsController.deleteComplaint);
complainRouter.get("/complain/all", complaintsController.getAllComplaints);

// Admin routes
complainRouter.post("/admin/register", adminController.registerAdmin);
complainRouter.put("/complain/review/:id", adminController.markAsReviewed);
complainRouter.get(
  "/admin/reviewed-complaints",
  adminController.getAllReviewedComplaints
);
complainRouter.get(
  "/admin/reviewed-complaints/:adminId",
  adminController.getReviewedComplaintsByAdmin
);

export default complainRouter;
