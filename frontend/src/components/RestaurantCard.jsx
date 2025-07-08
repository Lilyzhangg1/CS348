import React, { useState, useEffect } from 'react';
import { MoonStarIcon, HeartIcon } from 'raster-react';
import { Plus } from 'lucide-react';
import styles from './RestaurantCard.module.css';
import API from '../api/api';
import restaurantImage from '../assets/restaurant.png';
import RatingModal from './RatingModal';

export default function RestaurantCard({ r }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      checkWishlistStatus();
    } else {
      setIsInWishlist(false);
    }
  }, [r.placeId]);

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

  async function checkWishlistStatus() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const res = await API.get(`/wishlist/${userId}/check/${r.placeId}`);
      setIsInWishlist(res.data.isInWishlist);
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  }

  async function handleWishlist() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to manage wishlist.');
      return;
    }
    setIsLoading(true);
    try {
      if (isInWishlist) {
        await API.delete('/wishlist', { data: { userId, placeId: r.placeId } });
        setIsInWishlist(false);
        alert('Removed from wishlist!');
      } else {
        await API.post('/wishlist', { userId, placeId: r.placeId });
        setIsInWishlist(true);
        alert('Added to wishlist!');
      }
      window.dispatchEvent(new CustomEvent('wishlistChanged', {
        detail: { placeId: r.placeId, isInWishlist: !isInWishlist }
      }));
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not update wishlist');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{r.name}</h3>
      <p className={styles.address}>
        {r.street}, {r.city} {r.postalCode}
      </p>
      <div className={styles.imageWrapper}>
        <img
          src={restaurantImage}
          alt={`${r.name} placeholder`}
          className={styles.image}
        />
      </div>
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
          <Plus
            size={16}
            strokeWidth={1.5}
            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>

      {showModal && (
        <RatingModal
          placeId={r.placeId}
          restaurantName={r.name || r.placeId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
