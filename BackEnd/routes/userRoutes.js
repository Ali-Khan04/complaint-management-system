import express from "express";
import { userSignIn, userSignUp } from "../controllers/userAuthController.js";

const userRouter = express.Router();

userRouter.post("/register", userSignUp);
userRouter.post("/login", userSignIn);

export default userRouter;
