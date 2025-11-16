import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, default: "" },
  content: { type: String, required: true },
  tags: [{ type: String }],
  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

NoteSchema.index({ user: 1, title: "text", content: "text" });

export default mongoose.model("Note", NoteSchema);
