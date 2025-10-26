process.env.TZ = "Asia/Kolkata";

import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // Keep for urlencoded
import http from "http";
import CustomerRouter from "./routes/customer.route.js";
import VendorRouter from "./routes/vendor.route.js";
import AdminRouter from "./routes/admin.route.js";
import ProductRouter from "./routes/product.route.js";
import Admin from "./models/admin.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: "100mb", extended: true })); // Add extended: true
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" })); // For forms

app.get("/", (req, res) => {
  res.send("Welcome to the Ecommerce");
});

app.use("/api/customer", CustomerRouter);
app.use("/api/vendor", VendorRouter);
app.use("/api/admin", AdminRouter);

app.use("/api/products",ProductRouter);



// const createInitialAdmin = async () => {
//   const adminEmail = "jatavathjeevan05@gmail.com";
//   const adminPassword = "jatavath"; // Plain text password

//   try {
//     const existingAdmin = await Admin.findOne({ email: adminEmail });
//     if (existingAdmin) {
//       console.log(`Admin with email ${adminEmail} already exists.`);
//       return; // Exit if admin exists
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(adminPassword, salt);

//     const newAdmin = new Admin({
//       email: adminEmail,
//       password: hashedPassword,
//     });

//     await newAdmin.save();
//     console.log(`✅ Admin user ${adminEmail} created successfully!`);

//   } catch (error) {
//     console.error("❌ Error creating initial admin:", error);
//   }
// };

// createInitialAdmin();

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "hackathon" })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));

  