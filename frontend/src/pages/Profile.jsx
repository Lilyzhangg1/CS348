"use client"

import { useState, useEffect } from "react"
import styles from "./Profile.module.css"

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (userId) {
      // You might want to create an endpoint to get user details
      // For now, we'll just use the userId from localStorage
      setUserInfo({ userId })
      setLoading(false)
    }
  }, [userId])

  if (!userId) {
    return (
      <div className={styles.container}>
        <h1>Please log in to view your profile</h1>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Loading...</h1>
      </div>
    )
  }

  const profileImageUrl = `https://github.com/identicons/${userId}.png`

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <img
            src={profileImageUrl || "/placeholder.svg"}
            alt={`${userId}'s profile`}
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <h1 className={styles.userId}>@{userId}</h1>
            <p className={styles.joinDate}>Member since {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className={styles.profileStats}>
          <div className={styles.statCard}>
            <h3>Profile</h3>
            <p>User ID: {userId}</p>
            <p>Status: Active</p>
          </div>
        </div>

        <div className={styles.profileActions}>
          <button
            className={styles.actionButton}
            onClick={() => {
              localStorage.removeItem("userId")
              window.location.href = "/login"
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
