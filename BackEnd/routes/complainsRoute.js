import express from "express";
import complainsController from "../controllers/compalinController.js";

const complainRouter = express.Router();
complainRouter.post("/complain", complainsController.createComplaint);
complainRouter.get("/complain", complainsController.getComplaintsByUser);
complainRouter.put("/complain/:id", complainsController.updateComplaint);
complainRouter.delete("/complain/:id", complainsController.deleteComplaint);

// Admin
complainRouter.post("/admin/register", complainsController.registerAdmin);
complainRouter.get("/complain/all", complainsController.getAllComplaints);
complainRouter.put("/complain/review/:id", complainsController.markAsReviewed);
complainRouter.get(
  "/admin/reviewed-complaints",
  complainsController.getAllReviewedComplaints
);
complainRouter.get(
  "/admin/reviewed-complaints/:adminId",
  complainsController.getReviewedComplaintsByAdmin
);

export default complainRouter;
