import React from "react";
import { Link } from "react-router-dom";
import {Pin} from "lucide-react";

export default function NoteCard({ note, onDelete, onPin}) {
  const pinned = note.isPinned;

  return (
     <div
      className={`bg-white p-4 rounded shadow-sm hover:shadow-md hover:-translate-y-0.5 transition relative ${
        pinned ? "border border-yellow-400" : ""
      }`}>

      
      {/* Pin Button */}
      <button
        onClick={() => onPin(note._id)}
        className="absolute top-2 right-2 text-yellow-600 hover:scale-110 transition"
        title={pinned ? "Unpin" : "Pin"}
      >
        <Pin
          size={18}
          className={pinned ? "fill-yellow-400" : ""}
        />
      </button>


      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{note.title || note.content.slice(0, 40)}</h3>
          <p className="text-sm text-gray-600 mt-2">{note.content.slice(0, 120)}</p>
        </div>
        <div className="text-xs text-gray-500">{new Date(note.updatedAt).toLocaleString()}</div>
      </div>
      <div className="mt-3 flex gap-2 bg-white p-4 rounded shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
        <Link to={`/notes/${note._id}`} className="text-sm text-blue-600">Edit</Link>
        <button onClick={() => onDelete(note._id)} 
        className="text-sm text-rose-600"> 🗑 Delete</button>
      </div>
    </div>
  );
}
