import express from "express";
import Note from "../models/Note.js";
import requireAuth from "../middleware/requireAuth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();
router.use(requireAuth);

// create note
router.post("/",
  body("content").isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const note = await Note.create({ user: req.user.id, ...req.body });
    res.status(201).json(note);
  }
);

// list (filters)
router.get("/", async (req, res) => {
  const { q, page = 1, limit = 20, pinned, archived, trashed } = req.query;
  const filter = { user: req.user.id };


  if (pinned) filter.isPinned = pinned === "true";
  if (archived) filter.isArchived = archived === "true";


  if (trashed === "true"){
    filter.isDeleted = true;
  } else {
    filter.isDeleted = false;
  }

  let query = Note.find(filter);

  if(q){
    query = Note.find({ 
    $text: { $search: q }, 
    user: req.user.id,
    isDeleted: filter.isDeleted
   });
  }
  const items = await query
  .sort({ isPinned: -1, updatedAt: -1 })
  .skip((page-1)*limit)
  .limit(Number(limit));
  
  const total = await Note.countDocuments(filter);
  res.json({ items, total });
});

// get one
router.get("/:id", async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) return res.sendStatus(404);
  res.json(note);
});

// update
router.put("/:id", async (req, res) => {
  const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true });
  if (!note) return res.sendStatus(404);
  res.json(note);
});

// soft delete (trash)
router.delete("/:id", async (req, res) => {
  try{
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, 
      { isDeleted: true }, 
      { new: true }
    );

  if (!note) return res.sendStatus(404);
  res.json(note);
}
catch(err){
  console.error("Error deleting note:", err);
  res.status(500).json({ message: "Server error" });
}
});


//toggle Pin/ Unpin
router.patch("/:id/pin", async (req, res) => {
  try{
    const note = await Note.findOne(
      { _id: req.params.id, 
        user: req.user.id });
    if(!note) return res.sendStatus(404);
    
    //toggle value
    note.isPinned = !note.isPinned;
    await note.save();
    res.json(note);
  }catch(err){
    console.error("Error toggling pin:", err);
    res.status(500).json({ message: "Server error" });
  }
});  

// restore
router.post("/:id/restore", async (req, res) => {
  const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { isDeleted: false }, { new: true });
  if (!note) return res.sendStatus(404);
  res.json(note);
});

// hard delete
router.delete("/:id/hard", async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id, isDeleted: true });
  if (!note) return res.sendStatus(404);
  res.sendStatus(204);
});

export default router;
