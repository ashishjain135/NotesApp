import React, { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  //this flag ensures that we don't render children until we know auth status "/auth/me"
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    //try to get user from server
    api
    .get("/auth/me")
      .then(res => {
        //if cookie valid, set user
        setUser(res.data?.user || null);
      })
      .catch((err) => {
        console.log("Auth me error:", err);
        setUser(null);
      })
      .finally(() => 
        setLoading(false));
      },[]); 

      if(loading){
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-gray-500">Loading...</div>
          </div>
        );
      }
  // optional: implement /auth/me later to persist between refreshes

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
