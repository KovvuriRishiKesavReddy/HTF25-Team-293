// models/VendorModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const vendorSchema = new mongoose.Schema(
  {
    // Personal (Owner) Info
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Shop Info
    shopName: {
      type: String,
      required: true,
    },
    shopCategory: {
      type: String,
      required: true,
    },
    shopAddress: {
      type: String,
      required: true,
    },
    shopLogo: {
      type: String, // This will be a URL from Cloudinary, not the file
    },

    // *** This is the most important field ***
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // You'll add this later
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    // etc.
  },
  { timestamps: true }
);

// Pre-save hook to hash password

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;

