import React, { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      // 🔹 No token = user not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 🔥 Token automatically attached by axios interceptor
        const res = await api.get("/auth/me");
        setUser(res.data?.user || null);
      } catch (err) {
        console.log("Auth me error:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
