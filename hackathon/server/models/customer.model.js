// models/CustomerModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = new mongoose.Schema(
  {
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
    password: {
      type: String,
      // Not required if they sign up with Google
    },
    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/doxykd1yk/image/upload/v1751733473/download_ywnnsj.png",
    },
    authMethod: {
      type: String,
      enum: ["google", "email"],
      default: "email",
    },
    // E-commerce features
    // cart: [
    //   {
    //     product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    //     quantity: { type: Number, default: 1 },
    //   },
    // ],
    // orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// Changed from "User" to "Customer"
const Customer = mongoose.model("Customer", customerSchema);
export default Customer;