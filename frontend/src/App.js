// App.js
import React,{useEffect} from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Restaurants from "./pages/Restaurants";
import Signup     from "./pages/SignUp";
import Login      from "./pages/Login";

export default function App() {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#fada66";
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fada66",  // global yellow
        minHeight: "100vh",          // at least fill the screen
        margin: 0,                   // override any body margin
        padding: "20px",
      }}
    >
      <BrowserRouter>
        <nav>
          <Link to="/restaurants">Browse</Link> |{" "}
          <Link to="/signup">Sign Up</Link> |{" "}
          <Link to="/login">Log In</Link>
        </nav>
        <Routes>
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/signup"      element={<Signup />} />
          <Route path="/login"       element={<Login />} />
          <Route path="*"            element={<Restaurants />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
