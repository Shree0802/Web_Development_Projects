import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { MapPin, Star, ShieldCheck, Heart, ArrowRight, CalendarCheck } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(hotel.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Hotel Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/hotel-1.jpg';
          }}
        />

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-[#0878D1] shadow-sm uppercase tracking-wide">
            {hotel.type}
          </span>
          {hotel.verified && (
            <span className="bg-emerald-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(hotel);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-transform active:scale-90 shadow-md ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 backdrop-blur-md text-[#17243A] hover:bg-white hover:text-rose-500'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Stars & Value */}
        <div className="absolute bottom-3 left-3 bg-[#17243A]/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
          <div className="flex">
            {[...Array(hotel.stars || 3)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
            ))}
          </div>
          <span>{hotel.rating || 4.5}</span>
        </div>
      </div>

      {/* Hotel Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-lg text-[#17243A] group-hover:text-[#0878D1] transition-colors mb-1 line-clamp-1">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#0878D1] shrink-0" />
            <span className="truncate">{hotel.location}</span>
          </div>

          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed mb-3">
            {hotel.description}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5">
            {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="text-[10px] bg-[#F5F8FC] text-[#17243A] border border-[#E5E7EB] px-2 py-0.5 rounded font-medium">
                {amenity}
              </span>
            ))}
            {hotel.amenities?.length > 3 && (
              <span className="text-[10px] text-[#6B7280] py-0.5">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#6B7280] block uppercase font-medium">Price Range</span>
            <div className="text-sm font-bold text-[#17243A]">
              {hotel.priceRange || 'Contact for rates'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/hotels/${hotel.id}`}
              className="text-xs font-semibold text-[#0878D1] hover:underline"
            >
              Details
            </Link>

            <Link
              to={`/booking?type=hotel&target=${encodeURIComponent(hotel.name)}`}
              className="inline-flex items-center gap-1 bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-transform hover:scale-[1.02] shadow-sm"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
