import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      setUser(res.data.user);
      nav("/notes");
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})}/>
        <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg 
        hover:ring-2 hover:ring-blue-300 hover:bg-blue-700 
        transition-all duration-200 font-bold">
        Login
        </button>
      </form>
    </div>
  );
}
