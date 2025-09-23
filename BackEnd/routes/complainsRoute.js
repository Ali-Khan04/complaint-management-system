import express from "express";
import complaintsController from "../controllers/complaintsController.js";

const complainRouter = express.Router();

// User complaint routes
complainRouter.post("/complain", complaintsController.createComplaint);
complainRouter.get("/complain", complaintsController.getComplaintsByUser);
complainRouter.put("/complain/:id", complaintsController.updateComplaint);
complainRouter.delete("/complain/:id", complaintsController.deleteComplaint);

export default complainRouter;
