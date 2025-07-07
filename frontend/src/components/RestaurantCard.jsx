// RestaurantCard.jsx

import { useState, useEffect } from 'react';
import { MoonStarIcon, HeartIcon, ArrowDownIcon } from 'raster-react';
import styles from './RestaurantCard.module.css';
import API from '../api/api';

export default function RestaurantCard({ r }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      checkWishlistStatus();
    } else {
      setIsInWishlist(false);
    }
  }, [r.placeId]);

  // Listen for storage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        checkWishlistStatus();
      } else {
        setIsInWishlist(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkWishlistStatus = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    try {
      const response = await API.get(`/wishlist/${userId}/check/${r.placeId}`);
      setIsInWishlist(response.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlist = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to manage wishlist.');
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await API.delete('/wishlist', { data: { userId, placeId: r.placeId } });
        setIsInWishlist(false);
        alert('Removed from wishlist!');
      } else {
        // Add to wishlist
        await API.post('/wishlist', { userId, placeId: r.placeId });
        setIsInWishlist(true);
        alert('Added to wishlist!');
      }
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('wishlistChanged', { 
        detail: { placeId: r.placeId, isInWishlist: !isInWishlist } 
      }));
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      {/* — Name / "Speaker" badge spot (we'll drop it for restaurants) — */}
      <h3 className={styles.title}>{r.name}</h3>

      {/* — Address — */}
      <p className={styles.address}>
        {r.street}, {r.city} {r.postalCode}
      </p>

      {/* — Placeholder for an image (if you ever add one) — */}
      <div className={styles.imagePlaceholder}>
        <span>Restaurant Image</span>
      </div>

      {/* — Rating + actions bar — */}
      <div className={styles.footer}>
        <div className={styles.rating}>
          <MoonStarIcon size={16} strokeWidth={0.25} />
          <span className={styles.ratingText}>
            {r.avgRating ?? 'No ratings yet'}
          </span>
        </div>
        <div className={styles.actions}>
          <HeartIcon 
            size={16} 
            strokeWidth={0.25} 
            style={{ 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fill: isInWishlist ? 'currentColor' : 'lightgrey',
              opacity: isLoading ? 0.5 : 1
            }} 
            onClick={isLoading ? undefined : handleWishlist}
          />

          <ArrowDownIcon size={16} strokeWidth={0.25} />
        </div>
      </div>
    </div>
  );
}
