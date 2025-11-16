import React, { useEffect, useState } from "react";
import api from "../api";
import NoteCard from "../components/NoteCard";

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ page load pe notes laana
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await api.get("/notes"); // GET /api/notes
      console.log("Fetched notes:", res.data);
      setNotes(res.data.items || res.data);
    } catch (err) {
      console.error("Fetch notes error:", err);
      alert("Failed to load notes");
    }
  }

  // ✅ note save karna
  async function handleSave() {
    if (!content.trim()) {
      alert("Write something in note");
      return;
    }
    setLoading(true);
    try {
      await api.post("/notes", { title, content }); // POST /api/notes
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Create note error:", err);
      alert("Failed to create note");
    } finally {
      setLoading(false);
    }
  }

  // ✅ DELETE handler (yeh hi delete ka main function hai)
  async function handleDelete(id) {
    console.log("handleDelete called with id:", id);
    try {
      await api.delete(`/notes/${id}`); // DELETE /api/notes/:id
      console.log("delete API success");
      fetchNotes(); // list refresh
    } catch (err) {
      console.error("Delete note error:", err);
      alert("Failed to delete note: " + (err.response?.data?.message || err.message));
    }
  }

  //handle pin or unpin notes 
  async function handlePin(id) {
    console.log("pin clicked:", id);

    try{
      await api.patch(`/notes/${id}/pin`);
      fetchNotes();// refresh page;
    }
    catch(err){
      console.error("Pin note error", err);
      alert("Failed to pin");
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      {/* Add note box */}
      <div className="bg-white p-4 rounded shadow">
        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>

      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((n) => (
          <NoteCard
            key={n._id}
            note={n}
            onDelete={handleDelete} // ✅ yaha se delete function pass ho raha
            onPin = {handlePin}
          />
        ))}
      </div>

      {notes.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No notes yet. Create your first note above ✍️
        </p>
      )}
    </div>
  );
}
