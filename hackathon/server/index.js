process.env.TZ = "Asia/Kolkata";

import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";


dotenv.config();

const PORT = process.env.PORT || 5000;


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));


app.get("/", (req, res) => {
  res.send("Welcome to the Ecommerce");
});


// MONGODB_URI="mongodb+srv://hackathon:hackathon@atlascluster.p0rj0jx.mongodb.net/?appName=AtlasCluster"


mongoose
  .connect(process.env.MONGODB_URI, { dbName: "hackathon" })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));


