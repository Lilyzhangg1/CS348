import React, { useEffect, useState } from "react";
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
import Wishlist    from "./pages/Wishlist";
import Ratings       from "./pages/Ratings";
import backgroundColor from "./assets/background.jpeg";
import Friends from "./pages/Friend"


export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("userId"));

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundImage = `url(${backgroundColor})`;
    document.body.style.backgroundPosition = "top center";
    document.body.style.backgroundSize = "cover";
    
    
    const syncLogin = () => setLoggedIn(!!localStorage.getItem("userId"));
    window.addEventListener("storage", syncLogin);
    return () => window.removeEventListener("storage", syncLogin);
  }, []);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("userId"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

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
        {loggedIn && (
          <NavLink
            to="/ratings"
            className={styles.navItem}
            activeClassName={styles.active}
          >
            Ratings
          </NavLink>
        )}
        {loggedIn && (
        <>
          <NavLink
            to="/wishlist"
            className={styles.navItem}
            activeClassName={styles.active}
          >
            Wishlist
          </NavLink>
          <NavLink to="/friends" className={styles.navItem} activeClassName={styles.active}>
              Friends
            </NavLink>
          </>
        )}
        {!loggedIn && (
          <>
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
          </>
        )}
        {loggedIn && (
          <NavLink
            to="#"
            className={styles.navItem}
            activeClassName={styles.active}
            onClick={e => {
              e.preventDefault();
              handleLogout();
            }}
            style={{ cursor: "pointer" }}
          >
            Log Out
          </NavLink>
        )}
      </nav>

      <div style={{ padding: "0 20px" }}>
        <Routes>
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/wishlist"    element={<Wishlist />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/ratings"    element={<Ratings />} />
          <Route path="/signup"      element={<Signup />} />
          <Route path="/login"       element={<Login />} />
          <Route path="*"            element={<Restaurants />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
