"use client"

import { useState, useEffect } from "react"
import API from "../api/api"
import styles from "./Friend.module.css"
import RestaurantCard from "../components/RestaurantCard"

export default function Friends() {
  const [friends, setFriends] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("friends")
  const [friendsRestaurants, setFriendsRestaurants] = useState([])
  const [showFriendsBox, setShowFriendsBox] = useState(false)

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

  // Fetch friends' top rated restaurants
  const fetchFriendsRestaurants = async () => {
    if (!userId || friends.length === 0) return

    console.log(`🔍 Fetching ratings for ${friends.length} friends`)
    
    try {
      const allFriendsRestaurants = []
      
      // Fetch ratings for each friend
      for (const friend of friends) {
        try {
          const response = await API.get(`/users/${friend.friendId}/ratings`)
          let ratings = response.data

          // Sort by rating, then by ratingDate
          ratings = ratings.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return new Date(b.ratingDate) - new Date(a.ratingDate);
          })
          
          // Take top 4 ratings
          const top4 = ratings.slice(0, 4).map(rating => ({
            ...rating,
            avgRating: rating.rating, 
            friendId: friend.friendId
          }))
          
          allFriendsRestaurants.push(...top4)
        } catch (error) {
          console.error(`❌ Error fetching ratings for ${friend.friendId}:`, error)
        }
      }
      
      console.log(`✅ Total restaurants from friends: ${allFriendsRestaurants.length}`)
      setFriendsRestaurants(allFriendsRestaurants)
    } catch (error) {
      console.error("❌ Error fetching friends' restaurants:", error)
    }
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
          fetchFriendsRestaurants()
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

  // Fetch friends' restaurants when friends list changes
  useEffect(() => {
    if (friends.length > 0) {
      fetchFriendsRestaurants()
    }
  }, [friends])

  useEffect(() => {
    searchUsers()
  }, [searchTerm, friends]) 

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

  // Group restaurants by friendId
  const groupedByFriend = friendsRestaurants.reduce((acc, restaurant) => {
    if (!acc[restaurant.friendId]) acc[restaurant.friendId] = [];
    acc[restaurant.friendId].push(restaurant);
    return acc;
  }, {});

  // Calculate average ratings from all friends
  const averageRatings = friendsRestaurants.reduce((acc, restaurant) => {
    const key = restaurant.placeId;
    if (!acc[key]) {
      acc[key] = {
        placeId: restaurant.placeId,
        name: restaurant.name,
        street: restaurant.street,
        city: restaurant.city,
        postalCode: restaurant.postalCode,
        ratings: [],
        totalRating: 0,
        count: 0
      };
    }
    acc[key].ratings.push(restaurant.rating);
    acc[key].totalRating += restaurant.rating;
    acc[key].count += 1;
    return acc;
  }, {});

  // Calculate average and sort by average rating
  const topRecommended = Object.values(averageRatings)
    .map(restaurant => ({
      ...restaurant,
      avgRating: (restaurant.totalRating / restaurant.count).toFixed(1)
    }))
    .sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating))
    .slice(0, 4);

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        maxWidth: "1200px",
        margin: "0 auto 2rem auto",
        padding: "0 20px",
        marginLeft: "0"
      }}>
        <h1 style={{ color: "#333", fontSize: "2.5rem", margin: 0 }}>Friends</h1>
        <button
          className={styles.findFriendsBtn}
          onClick={() => setShowFriendsBox(!showFriendsBox)}
          style={{ marginRight: "-6rem" }}
        >
          {showFriendsBox ? "Hide Find Friends" : "Find Friends"}
        </button>
      </div>

      {showFriendsBox && (
        <div className={styles.container}>
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
      )}

      {/* Recommended by Friends - Average ratings from all friends */}
      <div style={{ marginTop: "2rem", maxWidth: "1200px", margin: "0 auto", padding: "0 20px", marginLeft: "20px" }}>
        <h2>Recommended by Friends</h2>
        {friends.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontStyle: "italic", padding: "40px 20px" }}>
            You don't have any friends yet. Add some friends to see recommendations!
          </p>
        ) : friendsRestaurants.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontStyle: "italic", padding: "40px 20px" }}>
            Your friends haven't rated any restaurants yet.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            alignItems: "start",
            padding: "0.5rem 0"
          }}>
            {topRecommended.map((restaurant) => (
              <RestaurantCard key={restaurant.placeId} r={restaurant} hideImage={true} />
            ))}
          </div>
        )}
      </div>

      {/* Friends' Top Rated Restaurants - Grouped by friend */}
      <div style={{ marginTop: "2rem", maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {friends.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontStyle: "italic", padding: "40px 20px" }}>
            You don't have any friends yet. Add some friends to see their recommendations!
          </p>
        ) : friendsRestaurants.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontStyle: "italic", padding: "40px 20px" }}>
            Your friends haven't rated any restaurants yet.
          </p>
        ) : (
          Object.entries(groupedByFriend).map(([friendId, restaurants]) => (
            <div key={friendId} style={{ marginBottom: "2.5rem", marginLeft: "-6rem" }}>
              <h3 style={{ color: "#222", marginBottom: "1rem" }}>{friendId}'s Top Rated</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                alignItems: "start",
                padding: "0.5rem 0"
              }}>
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={`${friendId}-${restaurant.placeId}`} r={restaurant} hideImage={true} comment={restaurant.comment} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
