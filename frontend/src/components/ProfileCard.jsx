"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import styles from "./ProfileCard.module.css"

export default function ProfileCard({ userId }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!userId) return null

  const profileImageUrl = `https://github.com/identicons/${userId}.png`

  return (
    <div className={styles.profileContainer}>
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
