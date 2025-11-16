import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// allow frontend origin to send cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.get("/test", (req, res) => res.send("Backend Connected")); //checking backend running


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(()=> {
    console.log("Mongo connected");
    app.listen(PORT, ()=> console.log("Server running on", PORT));
  })
  .catch(err => console.error(err));
