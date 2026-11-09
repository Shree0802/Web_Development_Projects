import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { MapPin, Star, Heart } from 'lucide-react';

export default function DestinationCard({ destination }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(destination.id);

  return (
    <Link
      to={`/destinations/${destination.id}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      {/* Background Image */}
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/hero-new-palace.jpg';
        }}
      />

      {/* Gradient Dark Overlay for Bottom Text Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/90 transition-colors" />

      {/* Category Pill (Top Left) */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0878D1] shadow-sm uppercase tracking-wide">
          {destination.category}
        </span>
      </div>

      {/* Favorite Heart Button (Top Right) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(destination);
        }}
        className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-full transition-transform active:scale-90 shadow-md ${
          isFavorite
            ? 'bg-rose-500 text-white'
            : 'bg-white/80 backdrop-blur-md text-[#17243A] hover:bg-white hover:text-rose-500'
        }`}
        title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* Bottom Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white z-10 flex flex-col justify-end space-y-1.5">
        
        {/* Star Rating & Review Count */}
        {destination.rating && (
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-white">{destination.rating}</span>
            {destination.reviewCount && (
              <span className="text-gray-300 text-[11px]">
                ({destination.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Destination Name */}
        <h3 className="font-bold text-base sm:text-lg text-white leading-tight group-hover:text-[#FF7900] transition-colors line-clamp-1">
          {destination.name}
        </h3>

        {/* Location with Pin */}
        <div className="flex items-center gap-1.5 text-xs text-gray-200">
          <MapPin className="w-3.5 h-3.5 text-[#0878D1] shrink-0" />
          <span className="truncate">
            {destination.distanceKm ? `${destination.distanceKm} km from Kolhapur` : 'Kolhapur District'}
          </span>
        </div>
      </div>
    </Link>
  );
}
