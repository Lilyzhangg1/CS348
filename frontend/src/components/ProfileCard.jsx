"use client"

import { useState, useEffect, useRef } from "react"
import { NavLink, useLocation } from "react-router-dom"
import styles from "./ProfileCard.module.css"

export default function ProfileCard({ userId, showFriendsBox, setShowFriendsBox }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!userId) return null

  const profileImageUrl = `https://github.com/identicons/${userId}.png`

  return (
    <div className={styles.profileContainer} ref={dropdownRef}>
      {location.pathname === "/friends" && showFriendsBox !== undefined && setShowFriendsBox && (
        <button
          className={styles.findFriendsBtn}
          onClick={() => setShowFriendsBox(!showFriendsBox)}
        >
          {showFriendsBox ? "Hide Find Friends" : "Find Friends"}
        </button>
      )}

      <button className={styles.profileButton} onClick={() => setIsOpen(!isOpen)}>
        <img src={profileImageUrl || "/placeholder.svg"} alt={`${userId}'s profile`} className={styles.profileImage} />
        <span className={styles.userId}>@{userId}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <NavLink to="/profile" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            View Profile
          </NavLink>
          <button
            className={styles.dropdownItem}
            onClick={() => {
              localStorage.removeItem("userId")
              window.location.href = "/login"
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
