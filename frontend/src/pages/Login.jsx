import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import styles from "./Login.module.css";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", { userId, password });
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
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label}>User ID:</label>
          <input
            className={styles.input}
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password:</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
    </div>
  );
}
