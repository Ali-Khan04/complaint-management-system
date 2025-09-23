import express from "express";
import adminController from "../controllers/adminController.js";
import { adminSignIn } from "../controllers/adminAuthController.js";

const router = express.Router();
router.post("/login", adminSignIn);
router.get("/complaints", adminController.getAllComplaints);
router.put("/complaints/:id/review", adminController.markAsReviewed);

export default router;
