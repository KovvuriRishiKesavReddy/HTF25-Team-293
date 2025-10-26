import express from "express";
import { getUser, googleAuth, loginUser, signupUser } from "../actions/customer.actions.js";

const router = express.Router();

router.get("/:userId", getUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/googleauth", googleAuth);

export default router;

