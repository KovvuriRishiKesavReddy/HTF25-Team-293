import express from "express";
import { adminLogin, approveVendor, getAdmin, getAllCustomers, getAllVendors, rejectVendor } from "../actions/admin.actions.js";
// 1. Import your controller function

const router = express.Router();


router.post("/login", adminLogin); // Handles admin login


router.get("/vendors", getAllVendors); // Gets all vendors for the table
router.put("/vendors/approve/:vendorId", approveVendor); // Approves a vendor
router.put("/vendors/reject/:vendorId", rejectVendor);

router.get("/customers", getAllCustomers);


router.get("/:adminId", getAdmin); // Gets a specific admin by ID

export default router;