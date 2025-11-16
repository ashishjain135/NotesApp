import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true } // hashed
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
