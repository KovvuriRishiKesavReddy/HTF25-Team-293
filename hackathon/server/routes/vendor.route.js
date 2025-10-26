import express from "express";
import { getVendor, vendorLogin, vendorSignup } from "../actions/vendor.actions.js";
// 1. Import your controller functions (including getVendor)

const router = express.Router();

// 2. Define the routes
router.post("/signup", vendorSignup); // Handles vendor registration
router.post("/login", vendorLogin);   // Handles vendor login
router.get("/:vendorId", getVendor); // Handles getting a specific vendor by ID

export default router;

