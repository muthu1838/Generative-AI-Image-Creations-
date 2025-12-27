import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoute from "./routes/generate.js";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/generate", generateRoute);
app.use("/output", express.static("output"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.listen(process.env.PORT, () =>
  console.log("🚀 Server running on port", process.env.PORT)
);