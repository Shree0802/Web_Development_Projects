import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import HotelCard from '../components/HotelCard';
import { Building2, Search, Filter, ShieldCheck, Check, Star, ArrowUpDown, Sparkles } from 'lucide-react';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedType, setSelectedType] = useState('all'); // all, Luxury, Mid-Range, Budget
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmenity, setSelectedAmenity] = useState('all');

  useEffect(() => {
    async function loadHotels() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedType !== 'all') queryParams.append('type', selectedType);
        if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

        const res = await api.getHotels(queryParams.toString());
        if (res.success && Array.isArray(res.data)) {
          let list = res.data;
          if (selectedAmenity !== 'all') {
            list = list.filter(h => h.amenities && h.amenities.some(a => a.toLowerCase().includes(selectedAmenity.toLowerCase())));
          }
          setHotels(list);
        }
      } catch (err) {
        console.error('Failed to load hotels:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHotels();
  }, [selectedType, searchQuery, selectedAmenity]);

  const hotelTypes = [
    { id: 'all', label: 'All Accommodations' },
    { id: 'luxury', label: 'Luxury Stays (4-5 Star)' },
    { id: 'mid-range', label: 'Mid-Range (3 Star)' },
    { id: 'budget', label: 'Budget & Transit' }
  ];

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Hero Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Hotel.jpg"
            alt="Kolhapur Hotels"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Kolhapur Stays</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Hotels, Resorts & Heritage Stays
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Find the perfect place to rest in Kolhapur — from 5-star royal hospitality at Sayaji to central station boutique stays and convenient highway transit hotels.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Filter Bar */}
        <div className="bg-[#F5F8FC] p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels by property name, location, or amenities..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
              />
            </div>

            {/* Hotel Type Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {hotelTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedType === type.id
                      ? 'bg-[#0878D1] text-white shadow-sm'
                      : 'bg-white text-[#6B7280] hover:text-[#17243A] border border-[#E5E7EB]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

          </div>

          {/* Secondary Filters */}
          <div className="pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#17243A]">Filter by Amenity:</span>
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#17243A] outline-none focus:border-[#0878D1] cursor-pointer"
              >
                <option value="all">All Amenities</option>
                <option value="Swimming Pool">Swimming Pool</option>
                <option value="Free WiFi">Free High-Speed WiFi</option>
                <option value="Restaurant">In-House Restaurant</option>
                <option value="Parking">Free Secure Parking</option>
                <option value="Fitness Center">Fitness Center / Gym</option>
              </select>
            </div>

            <div>
              <span>
                Showing <strong className="text-[#17243A]">{hotels.length}</strong> verified properties
              </span>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-2xl h-96" />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="bg-[#F5F8FC] rounded-3xl p-12 text-center border border-dashed border-[#E5E7EB]">
            <Building2 className="w-12 h-12 text-[#6B7280] mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-lg text-[#17243A] mb-1">
              No Hotels Found
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto mb-4">
              Try adjusting your search criteria or resetting filters to browse all verified accommodations.
            </p>
            <button
              onClick={() => {
                setSelectedType('all');
                setSearchQuery('');
                setSelectedAmenity('all');
              }}
              className="bg-[#0878D1] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#1267B0] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
