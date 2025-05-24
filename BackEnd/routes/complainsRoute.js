import express from "express";
import complainsController from "../controllers/compalinController.js";

const complainRouter = express.Router();
complainRouter.post("/complain", complainsController.createComplaint);
complainRouter.get("/complain", complainsController.getComplaintsByUser);
complainRouter.put("/complain/:id", complainsController.updateComplaint);
complainRouter.delete("/complain/:id", complainsController.deleteComplaint);

export default complainRouter;
