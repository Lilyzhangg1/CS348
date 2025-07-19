import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import styles from "./AppNav.module.css";

import Restaurants from "./pages/Restaurants";
import Signup      from "./pages/SignUp";
import Login       from "./pages/Login";
import Wishlist    from "./pages/Wishlist";
import Ratings       from "./pages/Ratings";
import backgroundColor from "./assets/background.jpeg";
import Friends from "./pages/Friend"
import Profile from "./pages/Profile"
import ProfileCard from "./components/ProfileCard"



export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("userId"))
  const [showFriendsBox, setShowFriendsBox] = useState(false)
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    document.body.style.margin = "0"
    document.body.style.padding = "0"
    document.body.style.backgroundImage = `url(${backgroundColor})`
    document.body.style.backgroundPosition = "top center"
    document.body.style.backgroundSize = "cover"

    const syncLogin = () => setLoggedIn(!!localStorage.getItem("userId"))
    window.addEventListener("storage", syncLogin)
    return () => window.removeEventListener("storage", syncLogin)
  }, [])

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("userId"))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userId")
    setLoggedIn(false)
  }

  return (
    <BrowserRouter>
    <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FEF3C7',
            color: '#92400E',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#FEF3C7',
            },
            icon: <CheckCircle size={20} color="#92400E" />,
          },
          error: {
            style: {
              background: '#FCD34D',
            },
            icon: <XCircle size={20} color="#92400E" />,
          },
        }}
      />
      <div style={{ position: "relative" }}>
        <nav className={styles.navbar}>
          <NavLink to="/restaurants" className={styles.navItem} activeClassName={styles.active}>
            Browse
          </NavLink>
          {loggedIn && (
            <NavLink to="/ratings" className={styles.navItem} activeClassName={styles.active}>
              Ratings
            </NavLink>
          )}
          {loggedIn && (
            <>
              <NavLink to="/wishlist" className={styles.navItem} activeClassName={styles.active}>
                Wishlist
              </NavLink>
              <NavLink to="/friends" className={styles.navItem} activeClassName={styles.active}>
                Friends
              </NavLink>
            </>
          )}
          {!loggedIn && (
            <>
              <NavLink to="/signup" className={styles.navItem} activeClassName={styles.active}>
                Sign Up
              </NavLink>
              <NavLink to="/login" className={styles.navItem} activeClassName={styles.active}>
                Log In
              </NavLink>
            </>
          )}
        </nav>

        {/* Profile Card as separate element */}
        {loggedIn && (
          <div className={styles.profileCardContainer}>
            <ProfileCard userId={userId} showFriendsBox={showFriendsBox} setShowFriendsBox={setShowFriendsBox} />
          </div>
        )}
      </div>

      <div style={{ padding: "0 20px" }}>
        <Routes>
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/friends" element={<Friends showFriendsBox={showFriendsBox} setShowFriendsBox={setShowFriendsBox} />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Restaurants />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
