import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { 
  Search, 
  MapPin, 
  Sparkles,
  Compass,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [distanceFilter, setDistanceFilter] = useState('all'); // all, near (<10km), mid (10-30km), far (>30km)
  const [sortBy, setSortBy] = useState('featured'); // featured, rating, distance_asc, name_asc
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    async function fetchDestinations() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'all') queryParams.append('category', selectedCategory);
        if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());
        if (sortBy === 'rating') queryParams.append('sort', 'rating');
        if (sortBy === 'distance_asc') queryParams.append('sort', 'distance_asc');
        if (sortBy === 'name_asc') queryParams.append('sort', 'name_asc');

        const res = await api.getDestinations(queryParams.toString());
        if (res.success && Array.isArray(res.data)) {
          let list = res.data;

          // Client-side distance filtering
          if (distanceFilter === 'near') {
            list = list.filter(d => (d.distanceKm || 0) <= 10);
          } else if (distanceFilter === 'mid') {
            list = list.filter(d => (d.distanceKm || 0) > 10 && (d.distanceKm || 0) <= 30);
          } else if (distanceFilter === 'far') {
            list = list.filter(d => (d.distanceKm || 0) > 30);
          }

          setDestinations(list);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, [selectedCategory, searchQuery, distanceFilter, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setDistanceFilter('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'temple', label: 'Sacred Temples' },
    { id: 'historical', label: 'Forts & Heritage' },
    { id: 'nature', label: 'Lakes & Nature' }
  ];

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Hero Header Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Explore Kolhapur"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Attractions</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Discover Destinations in Kolhapur
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Explore verified temples, historic Maratha hill forts, serene lakes, and UNESCO Western Ghats nature reserves across Kolhapur district.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

        {/* Filter and Search Bar Controls */}
        <div className="bg-[#F5F8FC] p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by landmark name, architecture, or location..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#0878D1] text-white shadow-sm'
                      : 'bg-white text-[#6B7280] hover:text-[#17243A] border border-[#E5E7EB]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Secondary Filter Row: Distance & Sort */}
          <div className="pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B7280]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#17243A] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0878D1]" />
                  <span>Distance:</span>
                </span>
                <select
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#17243A] outline-none focus:border-[#0878D1] cursor-pointer"
                >
                  <option value="all">Any Distance</option>
                  <option value="near">City Center (&lt; 10 km)</option>
                  <option value="mid">Mid-Range (10 - 30 km)</option>
                  <option value="far">Excursion (&gt; 30 km)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#17243A] flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#0878D1]" />
                  <span>Sort By:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#17243A] outline-none focus:border-[#0878D1] cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="distance_asc">Closest First</option>
                  <option value="name_asc">Alphabetical (A - Z)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium text-[#6B7280]">
                Showing <strong className="text-[#17243A]">{destinations.length}</strong> attractions
              </span>
              {(selectedCategory !== 'all' || searchQuery || distanceFilter !== 'all' || sortBy !== 'featured') && (
                <button
                  onClick={resetFilters}
                  className="text-[#0878D1] hover:underline font-bold flex items-center gap-1 text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Destinations Grid (TRIVVIU Card Aspect Ratio 4:5 with Text Overlay) */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="rounded-2xl aspect-[4/5] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="bg-[#F5F8FC] rounded-3xl p-12 text-center border border-dashed border-[#E5E7EB]">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#0878D1] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-[#17243A] mb-1">
              No Destinations Found
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto mb-5">
              We couldn't find any attractions matching your exact filters. Try adjusting your search query or reset the filters.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#0878D1] hover:bg-[#1267B0] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {destinations.slice(0, visibleCount).map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < destinations.length && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="bg-white hover:bg-[#F5F8FC] text-[#0878D1] font-bold text-xs sm:text-sm px-7 py-3 rounded-xl border border-[#E5E7EB] shadow-sm transition-all"
                >
                  Load More Destinations ({destinations.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
