import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Email / Password Login/Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://localhost:5000/api/register"
      : "http://localhost:5000/api/login";

    const payload = isRegister
      ? form
      : { email: form.email, password: form.password };

    try {
      const res = await axios.post(url, payload);

      // ✅ SAVE USER + JWT
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(isRegister ? "Registered!" : "Login Successful!");
      navigate("/Home");

    } catch (err) {
      alert(err?.response?.data?.error || "Error occurred");
    }
  };

  // 🔹 Google Login
  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google-login", // ✅ correct URL
        { token: response.credential }
      );


     

      // ✅ SAVE USER + JWT
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log("JWT TOKEN:", res.data.token);
       console.log("USER:", res.data.user);

      navigate("/Home");
    } catch (err) {
      console.log(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-6 border rounded-md w-80">

        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={updateForm}
            required
            className="border p-2 rounded-md w-full mb-3"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={updateForm}
          required
          className="border p-2 rounded-md w-full mb-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={updateForm}
          required
          className="border p-2 rounded-md w-full mb-4"
        />

        <button
          type="submit"
          className="bg-amber-600 text-white px-4 py-2 rounded-md w-full"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p className="my-4">OR</p>

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => alert("Google Login Failed")}
      />

      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-4 text-blue-600"
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default LoginRegister;
