// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// const api = axios.create({
//   baseURL: API_BASE,
//   withCredentials: true, // important: send/receive HttpOnly cookie
// });

// export default api;

// // const api = axios.create({
// //   baseURL: "https://notesapp-m7pp.onrender.com/api",
// //   withCredentials: true, // cookie bhejne ke liye
// // });

// // export default api;


import axios from "axios";
console.log("AXIOS BASE URL:", import.meta.env.VITE_API_BASE);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// 🔥 REQUEST INTERCEPTOR (TOKEN AUTO ADD)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
