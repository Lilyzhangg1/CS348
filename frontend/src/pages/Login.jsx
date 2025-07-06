import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await API.post("/login", { userId, password });
      console.log(res.data);
      alert("Login successful!");

      localStorage.setItem("userId", userId);
      window.dispatchEvent(new Event("storage"));

      nav("/restaurants"); // go to homepage
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
