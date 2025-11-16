import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword:"", });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmpassword] = useState(false);
  const nav = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  }

  //varify email 
  function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
 }
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    //client side password validation

    //length must be 6 character
    if(!form.password || form.password.length < 6){
      alert("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    //password or confirm password
    if(form.password !== form.confirmPassword){
      alert("Password and confirm Password do not match");
      return;
    }

    if(!isValidEmail(form.email)){
      alert("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {

      const payload={
        name: form.name,
        email: form.email,
        password:form.password,
      };

      const res = await api.post("/auth/register", payload);
      setUser(res.data.user);
      nav("/notes");
    } catch (err) {
    console.error("Register error:",err);

    // 400 validation errors (errors array)
    if (err.response?.data?.errors) {
      const map = {};
      err.response.data.errors.forEach((e) => {
        map[e.param] = e.msg;
      });
      setErrors(map);       // yahi text input ke niche dikhega
    }
  // 400/other with simple message
    else if (err.response?.data?.message) {
      alert(err.response.data.message);
    }
    // network / CORS / server down
    else {
      alert("Registration failed: " + err.message);
    }
}
 finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">Create account</h2>

      <form onSubmit={submit} className="space-y-3">
        {/* Name */}
        <div>
          <input
            name="name"
            className="w-full p-2 border rounded"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>
        {/* Email */}
        <div>
          <input
            name="email"
            className="w-full p-2 border rounded"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* password   */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" :"password"}
            className="w-full p-2 border rounded"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
          />
          <button type="button"
          onClick={() =>setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-2 flex items-center text-xs text-gray-600"
          >
          {showConfirmPassword ? "Hide":"show"}
          </button>
      
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>
        
        {/* confirm password */}
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text":"password"}
            className="w-full p-2 border rounded pr-16"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmpassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-xs text-gray-600"
          >
            {showConfirmPassword ? "hide":"show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg 
          hover:ring-2 hover:ring-blue-300 hover:bg-blue-700 
          transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}

