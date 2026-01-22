import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

dotenv.config();
const app = express();

/* 🔥 MUST FIRST */
app.use(express.json());

/* 🔥 CORS – JWT HEADER BASED */
app.use(
  cors({
    origin: ["http://localhost:5173",
    "https://notes-app-ruddy-zeta.vercel.app "],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* 🔥 PREFLIGHT */
// app.options("*", cors());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/test", (req, res) => {
  res.send("Backend Connected");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () =>
      console.log("Server running on", PORT)
    );
  })
  .catch((err) => console.error(err));
