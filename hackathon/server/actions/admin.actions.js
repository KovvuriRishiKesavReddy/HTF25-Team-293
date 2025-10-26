
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import Vendor from "../models/vendor.model.js";
import Customer from "../models/customer.model.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    // 1. Find admin by email and explicitly select the password
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    // 2. Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 3. Login successful - send back admin data (excluding password)
    const adminData = admin.toObject();
    delete adminData.password;

    res.status(200).json({ message: "Admin login successful", admin: adminData });

  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Don't send the password back
    const adminData = admin.toObject();
    delete adminData.password;

    res.status(200).json({ admin: adminData });
  } catch (error) {
    console.error("Error fetching admin:", error);
    // Handle potential invalid ID format errors
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid Admin ID format." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllVendors = async (req, res) => {
  try {
    // Find all vendors, sort by creation date (newest first)
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json({ vendors });
  } catch (error) {
    console.error("Error fetching vendors for admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- APPROVE VENDOR ---
export const approveVendor = async (req, res) => {
  const { vendorId } = req.params; // Get vendorId from the URL parameter

  try {
    // Find the vendor by ID and update their status to "Approved"
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { status: "Approved" },
      { new: true } // Return the updated document
    );

    // Check if a vendor was actually found and updated
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    // Optional: Add code here to send an email notification to the vendor

    res.status(200).json({ message: "Vendor approved successfully.", vendor: updatedVendor });
  } catch (error) {
    console.error("Error approving vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- REJECT VENDOR ---
export const rejectVendor = async (req, res) => {
  const { vendorId } = req.params; // Get vendorId from the URL parameter

  try {
    // Find the vendor by ID and update their status to "Rejected"
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { status: "Rejected" },
      { new: true } // Return the updated document
    );

    // Check if a vendor was actually found and updated
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    // Optional: Add code here to send an email notification to the vendor

    res.status(200).json({ message: "Vendor rejected successfully.", vendor: updatedVendor });
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllCustomers = async (req, res) => {
  try {
    // Find all customers, select fields you want to show, sort by join date
    const customers = await Customer.find()
      .select("name email picture createdAt authMethod") // Select specific fields
      .sort({ createdAt: -1 }); 
      
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers for admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};