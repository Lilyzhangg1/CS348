import { useState, useEffect } from 'react';
import { HeartIcon } from 'raster-react';
import { Plus, StarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './RestaurantCard.module.css';
import API from '../api/api';
import restaurantImage from '../assets/restaurant.png';
import RatingModal from './RatingModal';

export default function RestaurantCard({ r, hideImage, comment }) {
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
      toast.error('You must be logged in to manage wishlist.');
      return;
    }
    setIsLoading(true);
    try {
      if (isInWishlist) {
        await API.delete('/wishlist', { data: { userId, placeId: r.placeId } });
        setIsInWishlist(false);
        toast.success('Removed from wishlist!');
      } else {
        await API.post('/wishlist', { userId, placeId: r.placeId });
        setIsInWishlist(true);
        toast.success('Added to wishlist!');
      }
      window.dispatchEvent(new CustomEvent('wishlistChanged', {
        detail: { placeId: r.placeId, isInWishlist: !isInWishlist }
      }));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not update wishlist');
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
      {!hideImage && (
        <div className={styles.imageWrapper}>
          <img
            src={restaurantImage}
            alt={`${r.name} placeholder`}
            className={styles.image}
          />
        </div>
      )}
      {hideImage && comment && (
        <div style={{ minHeight: 40, margin: '0.5rem 0', color: '#555', fontStyle: 'italic', fontSize: '0.97rem' }}>
          “{comment}”
        </div>
      )}
      <div className={styles.footer}>
        <div className={styles.rating}>
          <StarIcon size={14} strokeWidth={0.25} fill="current color"/>
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
            onClick={() => {
              const userId = localStorage.getItem('userId');
              if (!userId) {
                toast.error('You must be logged in to rate restaurants.');
                return;
              }
              setShowModal(true);
            }}
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
