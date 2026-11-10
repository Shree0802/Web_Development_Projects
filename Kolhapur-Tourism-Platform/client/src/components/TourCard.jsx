import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star, ArrowRight, Compass } from 'lucide-react';

export default function TourCard({ tour }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Tour Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/hero-new-palace.jpg';
          }}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-[#0878D1] shadow-sm uppercase tracking-wide">
            {tour.category || tour.tripType}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 bg-[#17243A]/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#FF7900]" />
          <span>{tour.duration}</span>
        </div>

        {/* Rating */}
        {tour.rating && (
          <div className="absolute bottom-3 right-3 bg-white/95 text-[#17243A] text-xs font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>{tour.rating}</span>
          </div>
        )}
      </div>

      {/* Tour Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <MapPin className="w-3.5 h-3.5 text-[#0878D1]" />
            <span>{tour.destinationsCount || 4} Key Landmarks Included</span>
          </div>

          <h3 className="font-bold text-lg text-[#17243A] group-hover:text-[#0878D1] transition-colors leading-snug">
            {tour.name}
          </h3>

          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
            {tour.description}
          </p>

          {/* Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {tour.highlights.slice(0, 2).map((h, i) => (
                <span key={i} className="text-[10px] bg-[#F5F8FC] text-[#17243A] font-medium px-2 py-0.5 rounded border border-[#E5E7EB]">
                  ✓ {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & CTA Button */}
        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#6B7280] block uppercase font-medium">Estimated From</span>
            <div className="text-lg font-bold text-[#17243A]">
              ₹{tour.estimatedPrice?.toLocaleString()}
              <span className="text-xs text-[#6B7280] font-normal"> / person</span>
            </div>
          </div>

          <Link
            to={`/booking?type=destination_tour&target=${encodeURIComponent(tour.name)}&price=${tour.estimatedPrice}`}
            className="inline-flex items-center gap-1.5 bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-transform hover:scale-[1.02] shadow-sm"
          >
            <span>Book Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
