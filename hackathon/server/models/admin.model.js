// models/AdminModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // You can add roles later, e.g., "SuperAdmin", "Support"
    role: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

