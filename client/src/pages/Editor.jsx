import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function Editor(){
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if (!id) return;
    setLoading(true);
    api.get(`/notes/${id}`).then(res => {
      setNote(res.data);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, [id]);

  async function save(){

    if(!note) return;

    //frontend validataion  no empty list save
    if(!note.content || !note.content.trim()){
      alert("Note cannot be empty");
      return;
    }
    try{
      await api.put(`/notes/${id}`, { title: note.title, content: note.content });
      nav("/notes");
      alert("saved");
    }catch(err){
      console.error("update note error: ",err);
      const msg = err.response?.data?.message || "Failed to save note";
      alert(msg);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <input value={note.title} onChange={e=>setNote({...note, title: e.target.value})} className="w-full p-2 border rounded mb-2" placeholder="Title"/>
      <textarea value={note.content} onChange={e=>setNote({...note, content: e.target.value})} rows={10} className="w-full p-2 border rounded" placeholder="Write here..."></textarea>
      <div className="mt-3 flex gap-2 justify-end">
        <button onClick={() => nav(-1)} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </div>
  );
}
