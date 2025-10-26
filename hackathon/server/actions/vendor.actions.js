import mongoose from "mongoose";

import { v2 as cloudinary } from "cloudinary"; // Make sure cloudinary is configured
import Vendor from "../models/vendor.model.js";

// This is your main vendor signup controller

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Backend: vendor.actions.js (no multer needed)
export const vendorSignup = async (req, res) => {
  const { name, email, phone, password, shopName, shopCategory, shopAddress, shopLogo } = req.body;

  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  try {
    if (!name || !email || !phone || !password || !shopName || !shopCategory || !shopAddress) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existingVendor = await Vendor.findOne({ $or: [{ email }, { shopName }] });
    if (existingVendor) {
      return res.status(400).json({ message: "Email or shop name exists." });
    }

    let shopLogoUrl = null;
    if (shopLogo && shopLogo.startsWith('data:image/')) {
      try {
        const base64Data = shopLogo.replace(/^data:image\/[a-z]+;base64,/, '');
        const uploaded = await cloudinary.uploader.upload(base64Data, { folder: "eshop_vendors" });
        shopLogoUrl = uploaded.secure_url;
      } catch (err) {
        console.error(err);
        // Proceed without logo
      }
    }

    const newVendor = new Vendor({
      name, email, phone, password, // Hash in model
      shopName, shopCategory, shopAddress, shopLogo: shopLogoUrl, status: "Pending"
    });

    await newVendor.save();
    const { password: _, ...vendorData } = newVendor.toObject();

    res.status(201).json({ message: "Submitted! Await approval.", vendor: vendorData });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// --- VENDOR LOGIN (Stays the same, checks status) ---
export const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email }).select("+password");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }
    if (vendor.password !== password) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    if (vendor.status !== "Approved") {
      return res.status(403).json({
        message: `Your application is currently ${vendor.status}.`,
        status: vendor.status,
      });
    }
    const vendorData = vendor.toObject();
    delete vendorData.password;
    res.status(200).json({ message: "Login successful", vendor: vendorData });
  } catch (error) {
    console.error("Error logging in vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getVendor = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json({ vendor });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};