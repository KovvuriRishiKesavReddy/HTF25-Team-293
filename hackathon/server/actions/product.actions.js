// actions/product.actions.js (complete file with fixes)
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

// Hardcoded Cloudinary config (remove when .env works)
cloudinary.config({
  cloud_name: "doxykd1yk",
  api_key: "626662762526426",
  api_secret: "GXJGOUMRsHH4_JDFRRQWuHeB3hE",
});

export const createProduct = async (req, res) => {
  console.log('Request method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body keys:', Object.keys(req.body || {}));
  const { name, description, price, stock, category, tags, weight, dimensions, vendorId } = req.body || {};
  const imageBase64s = req.body?.images || [];
  console.log(`Images count: ${imageBase64s.length}`);

  try {
    // Input validation
    if (!name || !description || !price || !stock || !category || !vendorId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID." });
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return res.status(400).json({ message: "Invalid price." });
    if (isNaN(parsedStock) || parsedStock < 0) return res.status(400).json({ message: "Invalid stock." });
    if (isNaN(parsedWeight) || parsedWeight <= 0) return res.status(400).json({ message: "Invalid weight." });

    let imageUrls = [];
    if (imageBase64s.length > 0) {
      for (let i = 0; i < imageBase64s.length; i++) {
        try {
          if (typeof imageBase64s[i] !== 'string' || !imageBase64s[i].startsWith('data:image/')) {
            return res.status(400).json({ message: `Invalid base64 for image ${i + 1}` });
          }
          const base64Data = imageBase64s[i].replace(/^data:image\/[a-z]+;base64,/, '');
          const result = await cloudinary.uploader.upload(base64Data, {
            folder: "eshop_products",
            resource_type: "auto",
          });
          imageUrls.push(result.secure_url);
          console.log(`Uploaded image ${i + 1}: OK`);
        } catch (uploadErr) {
          console.error(`Upload error for image ${i + 1}:`, uploadErr);
          return res.status(500).json({ message: `Failed to upload image ${i + 1}: ${uploadErr.message}` });
        }
      }
    } else {
      return res.status(400).json({ message: "At least one image is required." });
    }

    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      stock: parsedStock,
      category: category.trim(),
      tags: tagArray,
      weight: parsedWeight,
      dimensions: dimensions.trim(),
      images: imageUrls,
      vendorId,
      status: "Active",
    });

    const savedProduct = await newProduct.save();
    console.log('Product saved ID:', savedProduct._id);

    const product = await Product.findById(savedProduct._id).populate('vendorId', 'shopName');

    res.status(201).json({
      message: "Product created successfully!",
      product,
    });
  } catch (error) {
    console.error("Top-level error:", error.message, error.stack);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Optional: Get products by vendor
export const getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await Product.find({ vendorId }).populate('vendorId', 'shopName');
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products." });
  }
};