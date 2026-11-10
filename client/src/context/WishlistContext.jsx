import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kolhapur_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('kolhapur_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const toggleWishlist = (item) => {
    setWishlist(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        showToast(`Removed "${item.name}" from your saved destinations.`);
        return prev.filter(i => i.id !== item.id);
      } else {
        showToast(`Added "${item.name}" to your saved destinations! ❤️`);
        return [...prev, item];
      }
    });
  };

  const isInWishlist = (id) => {
    return wishlist.some(i => i.id === id);
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(i => i.id !== id));
    showToast('Item removed from wishlist.');
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared.');
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      clearWishlist,
      count: wishlist.length,
      toastMessage
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
