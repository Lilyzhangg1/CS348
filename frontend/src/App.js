import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import styles from "./AppNav.module.css";

import Restaurants from "./pages/Restaurants";
import Signup      from "./pages/SignUp";
import Login       from "./pages/Login";

export default function App() {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#fada66";
  }, []);

  return (
    <BrowserRouter>
      <nav className={styles.navbar}>
        <NavLink
          to="/restaurants"
          className={styles.navItem}
          activeClassName={styles.active}
        >
          Browse
        </NavLink>
        <NavLink
          to="/signup"
          className={styles.navItem}
          activeClassName={styles.active}
        >
          Sign Up
        </NavLink>
        <NavLink
          to="/login"
          className={styles.navItem}
          activeClassName={styles.active}
        >
          Log In
        </NavLink>
      </nav>

      <div style={{ padding: "0 20px" }}>
        <Routes>
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/signup"      element={<Signup />} />
          <Route path="/login"       element={<Login />} />
          <Route path="*"            element={<Restaurants />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
