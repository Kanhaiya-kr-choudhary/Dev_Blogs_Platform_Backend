import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import connectDB from "./DB/index.js";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blogs.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Connect DB then start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("MONGODB CONNECTION FAILED", Error);
  });
