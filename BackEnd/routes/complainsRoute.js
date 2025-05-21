import express from "express";
import complainsController from "../controllers/compalinController.js";

const complainRouter = express.Router();
complainRouter.post("/complain", complainsController.createComplaint);

export default complainRouter;
