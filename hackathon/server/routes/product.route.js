// routes/product.route.js
import express from "express";
import { createProduct } from "../actions/product.actions.js";

const router = express.Router();

// Create product (JSON + base64 images)
router.post('/create', createProduct);


export default router;