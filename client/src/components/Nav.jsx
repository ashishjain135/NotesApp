import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";

export default function Nav(){
  const { user, setUser } = useContext(AuthContext);
  const nav = useNavigate();

  async function logout(){
    try {
      await api.post("/auth/logout");
      setUser(null);
      nav("/login");
    } catch (err) { console.error(err); }
  }

  return (
    <nav className="bg-sky-100 shadow mb-6">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/notes" className="text-2xl font-bold text-gray-800">NotesApp</Link>
        <div className="space-x-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600 mr-4">Hi, {user.name}</span>
              <button onClick={logout} className="px-3 py-1 bg-rose-500 text-white rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:font-bold py-4">Login</Link>
              <Link to="/register" className="text-sm text-gray-600 hover:font-bold py-4">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
