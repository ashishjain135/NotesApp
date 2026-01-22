import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotesList from "./pages/NotesList";
import Editor from "./pages/Editor";
import Nav from "./components/Nav";
import { AuthContext } from "./contexts/AuthContext";
console.log("API BASE:", import.meta.env.VITE_API_BASE);

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/notes" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<PrivateRoute><NotesList/></PrivateRoute>} />
        <Route path="/notes/:id" element={<PrivateRoute><Editor/></PrivateRoute>} />
      </Routes>
    </div>
  );
}
