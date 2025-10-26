// models/ProductModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    weight: {
      type: Number,
      required: true,
      min: 0, // in grams
    },
    dimensions: {
      type: String,
      required: true,
      trim: true, // e.g., "10x5x2 cm"
    },
    images: [{
      type: String, // URLs from Cloudinary
      required: true,
    }],
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true, // For querying vendor products
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Out of Stock", "Archived"],
      default: "Draft",
    },
    // Optional: averageRating, numReviews, etc. (add later)
  },
  { timestamps: true }
);

// Compound index for efficient queries
productSchema.index({ vendorId: 1, category: 1 });
productSchema.index({ tags: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;

