import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import TourCard from '../components/TourCard';
import { 
  Search, 
  Compass, 
  Clock, 
  Tag, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function ToursPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('category') || 'All');
  const [selectedDuration, setSelectedDuration] = useState(searchParams.get('duration') || 'All');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || 'All');

  useEffect(() => {
    async function fetchTours() {
      try {
        setLoading(true);
        const res = await api.getTours();
        if (res.success && Array.isArray(res.data)) {
          setTours(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch tours:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  // Sync state if query params change
  useEffect(() => {
    if (searchParams.get('category')) setSelectedType(searchParams.get('category'));
    if (searchParams.get('duration')) setSelectedDuration(searchParams.get('duration'));
    if (searchParams.get('price')) setSelectedPrice(searchParams.get('price'));
  }, [searchParams]);

  // Filtered tours
  const filteredTours = tours.filter((tour) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = tour.name?.toLowerCase().includes(q);
      const matchDesc = tour.description?.toLowerCase().includes(q);
      const matchDest = tour.includedDestinations?.some(d => d.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchDest) return false;
    }

    // Category / Trip Type
    if (selectedType !== 'All' && selectedType !== '') {
      const cat = tour.category?.toLowerCase() || '';
      const type = tour.tripType?.toLowerCase() || '';
      const target = selectedType.toLowerCase();
      if (!cat.includes(target) && !type.includes(target) && !target.includes(cat)) {
        return false;
      }
    }

    // Duration
    if (selectedDuration !== 'All' && selectedDuration !== '') {
      const dur = tour.duration?.toLowerCase() || '';
      const target = selectedDuration.toLowerCase();
      if (!dur.includes(target.replace(' days', 'd').replace(' day', 'd')) && !dur.includes(target)) {
        return false;
      }
    }

    // Price
    if (selectedPrice !== 'All' && selectedPrice !== '') {
      if (selectedPrice === 'Budget' && tour.price > 2000) return false;
      if (selectedPrice === 'Moderate' && (tour.price < 2000 || tour.price > 4500)) return false;
      if (selectedPrice === 'Premium' && (tour.price < 4500 || tour.price > 7500)) return false;
      if (selectedPrice === 'Luxury' && tour.price < 7500) return false;
    }

    return true;
  });

  const tripTypes = [
    'All',
    'Religious Tourism',
    'Historical Tourism',
    'Nature & Adventure',
    'Cultural Experiences',
    'Weekend Getaway'
  ];

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      {/* Hero Banner (TRIVVIU Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/panhala-fort.jpg"
            alt="Kolhapur Tours"
            className="w-full h-full object-cover object-center opacity-30"
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Travel Experiences</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Kolhapur Tour Packages
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Explore thoughtfully planned multi-day tours, heritage walks, spiritual yatras, and wildlife expeditions led by verified local guides.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Filter Bar */}
        <div className="bg-[#F5F8FC] p-4 sm:p-6 rounded-2xl border border-[#E5E7EB] mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase text-[#6B7280] mb-1">
                Search Tour
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Temple, Panhala, Wildlife..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#E5E7EB] text-sm text-[#17243A] focus:outline-none focus:border-[#0878D1]"
                />
              </div>
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#6B7280] mb-1">
                Trip Category
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5E7EB] text-sm text-[#17243A] focus:outline-none focus:border-[#0878D1] cursor-pointer"
              >
                {tripTypes.map((t) => (
                  <option key={t} value={t}>{t === 'All' ? 'All Trip Categories' : t}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#6B7280] mb-1">
                Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5E7EB] text-sm text-[#17243A] focus:outline-none focus:border-[#0878D1] cursor-pointer"
              >
                <option value="All">Any Duration</option>
                <option value="1 Day">1 Day</option>
                <option value="2 Days">2 Days</option>
                <option value="3 Days">3 Days</option>
                <option value="4-5 Days">4-5 Days</option>
                <option value="1 Week">1 Week</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#6B7280] mb-1">
                Budget Level
              </label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5E7EB] text-sm text-[#17243A] focus:outline-none focus:border-[#0878D1] cursor-pointer"
              >
                <option value="All">All Budgets</option>
                <option value="Budget">Budget (&lt; ₹2,000)</option>
                <option value="Moderate">Moderate (₹2,000 - ₹4,500)</option>
                <option value="Premium">Premium (₹4,500 - ₹7,500)</option>
                <option value="Luxury">Luxury (₹7,500+)</option>
              </select>
            </div>
          </div>

          {/* Active filter count & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] text-xs text-[#6B7280]">
            <span>
              Showing <strong className="text-[#17243A]">{filteredTours.length}</strong> available tour packages
            </span>
            {(selectedType !== 'All' || selectedDuration !== 'All' || selectedPrice !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedDuration('All');
                  setSelectedPrice('All');
                  setSearchQuery('');
                }}
                className="text-[#0878D1] hover:underline font-semibold"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Tour Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-gray-100 h-96" />
            ))}
          </div>
        ) : filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F5F8FC] rounded-2xl border border-dashed border-[#E5E7EB]">
            <Compass className="w-12 h-12 text-[#6B7280] mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-[#17243A]">No tour packages match your filters</h3>
            <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria, duration, or trip category to discover more travel packages.
            </p>
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedDuration('All');
                setSelectedPrice('All');
                setSearchQuery('');
              }}
              className="mt-4 bg-[#0878D1] text-white px-5 py-2 rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Custom Itinerary Planning Banner */}
        <div className="mt-16 bg-[#F5F8FC] rounded-3xl p-8 sm:p-10 border border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider">
              NEED A CUSTOM TRIP?
            </span>
            <h3 className="text-2xl font-extrabold text-[#17243A]">
              Design Your Personalized Kolhapur Itinerary
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Use our interactive Travel Planner tool to build a customized route based on your dates, budget, interests, and family preferences.
            </p>
          </div>

          <Link
            to="/planner"
            className="bg-[#FF7900] hover:bg-[#E66D00] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Launch Travel Planner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
