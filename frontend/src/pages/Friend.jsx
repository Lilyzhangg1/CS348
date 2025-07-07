"use client"

import { useState, useEffect } from "react"
import API from "../api/api"
import styles from "./Friend.module.css"

export default function Friends() {
  const [friends, setFriends] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("friends")

  const userId = localStorage.getItem("userId")

  // Fetch friends list
  const fetchFriends = () => {
    if (!userId) return

    API.get(`/friends/list/${userId}`)
      .then((res) => {
        console.log("✅ Friends:", res.data)
        setFriends(res.data)
      })
      .catch(console.error)
  }

  // Fetch incoming friend requests
  const fetchIncomingRequests = () => {
    if (!userId) return

    API.get(`/friends/requests/incoming/${userId}`)
      .then((res) => {
        console.log("✅ Incoming requests:", res.data)
        setIncomingRequests(res.data)
      })
      .catch(console.error)
  }

  // Search for users
  const searchUsers = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    API.get(`/users/search?query=${encodeURIComponent(searchTerm)}`)
      .then((res) => {
        console.log("✅ Search results:", res.data)
        // Filter out current user and existing friends
        const filteredResults = res.data.filter(
          (user) => user.userId !== userId && !friends.some((friend) => friend.friendId === user.userId),
        )
        setSearchResults(filteredResults)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  // Send friend request
  const sendFriendRequest = (requesteeId) => {
    API.post("/friends/request", {
      requesterId: userId,
      requesteeId: requesteeId,
    })
      .then((res) => {
        console.log("✅ Friend request sent:", res.data)
        alert("Friend request sent!")
        // Remove from search results
        setSearchResults((prev) => prev.filter((user) => user.userId !== requesteeId))
      })
      .catch((err) => {
        console.error("❌ Error sending friend request:", err)
        const errorMsg = err.response?.data?.detail || "Failed to send friend request"
        alert(`Error: ${errorMsg}`)
      })
  }

  // Respond to friend request
  const respondToRequest = (requesterId, accept) => {
    API.post("/friends/requests/respond", {
      requesterId: requesterId,
      requesteeId: userId,
      accept: accept,
    })
      .then((res) => {
        console.log("✅ Friend request response:", res.data)
        alert(accept ? "Friend request accepted!" : "Friend request rejected!")
        // Refresh data
        fetchIncomingRequests()
        if (accept) {
          fetchFriends()
        }
      })
      .catch((err) => {
        console.error("❌ Error responding to request:", err)
        const errorMsg = err.response?.data?.detail || "Failed to respond to request"
        alert(`Error: ${errorMsg}`)
      })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchTerm(searchQuery)
  }

  useEffect(() => {
    if (userId) {
      fetchFriends()
      fetchIncomingRequests()
    }
  }, [userId])

  useEffect(() => {
    searchUsers()
  }, [searchTerm, friends]) // Re-search when friends list changes

  const btnStyle = {
    backgroundColor: "#FFF9C4",
    border: "1px solid #F0E68C",
    borderRadius: "9999px",
    padding: "0.5rem 1rem",
    margin: "0 0.25rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color .2s",
  }

  const hoverStyle = { backgroundColor: "#FFEE99" }

  if (!userId) {
    return <div className={styles.container}>Please log in to view friends.</div>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Friends</h1>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "friends" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          My Friends ({friends.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "search" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("search")}
        >
          Find Friends
        </button>
        <button
          className={`${styles.tab} ${activeTab === "requests" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Requests ({incomingRequests.length})
        </button>
      </div>

      {/* Friends List Tab */}
      {activeTab === "friends" && (
        <div className={styles.tabContent}>
          <h2>Your Friends</h2>
          {friends.length === 0 ? (
            <p className={styles.emptyState}>You don't have any friends yet. Search for people to add!</p>
          ) : (
            <div className={styles.friendsList}>
              {friends.map((friend) => (
                <div key={friend.friendId} className={styles.friendCard}>
                  <div className={styles.friendInfo}>
                    <strong>{friend.friendId}</strong>
                    <small>Friends since: {new Date(friend.friendedDate).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className={styles.tabContent}>
          <h2>Find New Friends</h2>
          <form
            onSubmit={handleSearch}
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search by name or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "1px solid #F0E68C",
                fontSize: "1rem",
                flex: 1,
              }}
            />
            <button
              type="submit"
              style={btnStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = btnStyle.backgroundColor)}
            >
              Search
            </button>
          </form>

          {loading && <p>Searching...</p>}

          <div className={styles.searchResults}>
            {searchResults.map((user) => (
              <div key={user.userId} className={styles.userCard}>
                <div className={styles.userInfo}>
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                  <small>@{user.userId}</small>
                </div>
                <button
                  onClick={() => sendFriendRequest(user.userId)}
                  style={btnStyle}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = btnStyle.backgroundColor)}
                >
                  Add Friend
                </button>
              </div>
            ))}
            {searchTerm && !loading && searchResults.length === 0 && (
              <p className={styles.emptyState}>No users found matching "{searchTerm}"</p>
            )}
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div className={styles.tabContent}>
          <h2>Friend Requests</h2>
          {incomingRequests.length === 0 ? (
            <p className={styles.emptyState}>No pending friend requests.</p>
          ) : (
            <div className={styles.requestsList}>
              {incomingRequests.map((request) => (
                <div key={request.requesterId} className={styles.requestCard}>
                  <div className={styles.requestInfo}>
                    <strong>{request.requesterId}</strong>
                    <small>Sent: {new Date(request.requestDate).toLocaleDateString()}</small>
                  </div>
                  <div className={styles.requestActions}>
                    <button
                      onClick={() => respondToRequest(request.requesterId, true)}
                      style={{ ...btnStyle, backgroundColor: "#c8e6c9" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#a5d6a7")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#c8e6c9")}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToRequest(request.requesterId, false)}
                      style={{ ...btnStyle, backgroundColor: "#ffcdd2" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ef9a9a")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffcdd2")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
