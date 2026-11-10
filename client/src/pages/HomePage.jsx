import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import TourCard from '../components/TourCard';
import HotelCard from '../components/HotelCard';
import ImageLightbox from '../components/ImageLightbox';
import WeatherWidget from '../components/WeatherWidget';
import { 
  Search, 
  MapPin, 
  Compass, 
  Clock, 
  Tag,
  ArrowRight,
  ShieldCheck, 
  Sparkles, 
  HeartHandshake,
  Calendar,
  Award,
  ChevronRight,
  ChevronLeft,
  Send,
  Eye,
  Camera,
  Utensils,
  Landmark,
  TreePine,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  // Curated High-Definition Kolhapur Landmark Hero Scenery
  const heroSlides = [
    {
      id: 'new-palace',
      image: '/images/hero-new-palace.jpg',
      fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/New_Palace%2C_Kolhapur%2C_Maharashtra.jpg/1920px-New_Palace%2C_Kolhapur%2C_Maharashtra.jpg',
      title: 'The Grand New Palace of Kolhapur',
      location: 'New Palace & Chhatrapati Shahu Museum',
      tag: '1884 Indo-Saracenic Royal Marvel'
    },
    {
      id: 'panhala',
      image: '/images/hero-panhala.jpg',
      fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Panhala_Fort_Inside.jpg/1920px-Panhala_Fort_Inside.jpg',
      title: 'Majestic Panhala Hill Fort',
      location: 'Panhala Hill Station (Sahyadri Crest)',
      tag: 'Historic Maratha Stronghold'
    },
    {
      id: 'kopeshwar',
      image: '/images/hero-kopeshwar.jpg',
      fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Inside_view_of_the_Swarga_Gruha_of_Kopeshwar_Temple.jpg/1920px-Inside_view_of_the_Swarga_Gruha_of_Kopeshwar_Temple.jpg',
      title: 'Kopeshwar Temple Swargamandap',
      location: 'Khidrapur, Kolhapur',
      tag: '12th Century Architectural Wonder'
    },
    {
      id: 'rankala',
      image: '/images/hero-rankala.jpg',
      fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rankala_Lake_Kolhapur.jpg/1920px-Rankala_Lake_Kolhapur.jpg',
      title: 'Historic Rankala Lake at Sunset',
      location: 'Rankala Lakeside Promenade',
      tag: 'Iconic Kolhapur Sunset & Marine Drive'
    }
  ];

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Auto-advance hero background every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Floating Search Panel State
  const [searchLocation, setSearchLocation] = useState('');
  const [searchTripType, setSearchTripType] = useState('');
  const [searchDuration, setSearchDuration] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  // Destination category filter
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Data states
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [destRes, tourRes, hotRes, galRes] = await Promise.all([
          api.getDestinations('featured=true'),
          api.getTours(),
          api.getHotels(),
          api.getGallery()
        ]);

        if (destRes?.success && Array.isArray(destRes.data)) {
          setDestinations(destRes.data);
        }
        if (tourRes?.success && Array.isArray(tourRes.data)) {
          setTours(tourRes.data.slice(0, 3));
        }
        if (hotRes?.success && Array.isArray(hotRes.data)) {
          setHotels(hotRes.data.slice(0, 3));
        }
        if (galRes?.success && Array.isArray(galRes.data)) {
          setGalleryPhotos(galRes.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Filter destinations by category tab
  const filteredDestinations = selectedCategory === 'All'
    ? destinations.slice(0, 5)
    : destinations.filter(d => d.category.toLowerCase().includes(selectedCategory.toLowerCase())).slice(0, 5);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set('search', searchLocation);
    if (searchTripType && searchTripType !== 'All Trip Types') params.set('category', searchTripType);
    if (searchDuration && searchDuration !== 'Any Duration') params.set('duration', searchDuration);
    if (searchPrice && searchPrice !== 'Any Budget') params.set('price', searchPrice);

    // If trip type or duration is set, navigate to tours or explore
    if (searchTripType || searchDuration) {
      navigate(`/tours?${params.toString()}`);
    } else {
      navigate(`/explore?${params.toString()}`);
    }
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // 6 Cultural Experiences
  const culturalExperiences = [
    {
      title: 'Authentic Kolhapuri Cuisine',
      category: 'Culinary Heritage',
      marathi: 'कोल्हापुरी तांबडा-पांढरा रस्सा',
      desc: 'Fiery mutton sukkha, rich Pandhra rassa, and world-renowned Kolhapuri Misal.',
      image: '/images/kolhapuri-misal.jpg',
      link: '/food-and-culture'
    },
    {
      title: 'GI-Tagged Kolhapuri Chappals',
      category: 'Living Craftsmanship',
      marathi: 'कोल्हापुरी चप्पल',
      desc: 'Century-old artisan leather craft, vegetable dyed and hand-stitched on Mahadwar Road.',
      image: '/images/kolhapuri-chappal.jpg',
      link: '/food-and-culture#chappal'
    },
    {
      title: 'Historic Maratha Fortresses',
      category: 'Royal History',
      marathi: 'पन्हाळा व विशालगड',
      desc: 'Impregnable double ramparts, Sajja Kothi, and the legendary night of Shiva Kashid.',
      image: '/images/panhala-fort.jpg',
      link: '/history'
    },
    {
      title: 'Traditional Kushti Wrestling',
      category: 'Royal Sports Legacy',
      marathi: 'कोल्हापूरची लाल मातीची कुस्ती',
      desc: 'Historic red-mud Taleems nurtured by Rajarshi Shahu Maharaj that shaped Indian wrestling.',
      image: '/images/kolhapuri-kushti.jpg',
      link: '/food-and-culture#kushti'
    },
    {
      title: 'Sacred Ambabai Darshan',
      category: 'Spiritual Pilgrimage',
      marathi: 'श्री करवीर निवासिनी महालक्ष्मी',
      desc: '7th-century Hemadpanthi Shaktipeeth featuring the celestial bi-annual Kiranotsav.',
      image: '/images/destination-1.jpg',
      link: '/temples'
    },
    {
      title: 'Rankala Lake & Royal Palaces',
      category: 'Lakeside Leisure',
      marathi: 'रंकाळा तलाव व नवीन राजवाडा',
      desc: 'Picturesque sunsets with Shalini Palace views, pedal boating, and local evening chaat.',
      image: '/images/Rankala.jpg',
      link: '/nature'
    }
  ];

  // 4 Why Choose Us Features
  const features = [
    {
      icon: <Compass className="w-7 h-7 text-[#0878D1]" />,
      title: 'Authentic Local Experiences',
      desc: 'Discover centuries of sacred heritage, royal Maratha traditions, authentic culinary trails, and genuine Kolhapuri hospitality.'
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-[#0878D1]" />,
      title: 'Carefully Curated Destinations',
      desc: 'Hand-verified guides for Mahalakshmi Temple, hill forts, pristine lakes, and UNESCO Western Ghats biodiversity reserves.'
    },
    {
      icon: <Calendar className="w-7 h-7 text-[#0878D1]" />,
      title: 'Easy Travel Planning',
      desc: 'Flexible 1-day to 5-day itineraries, transparent route timings, local transport guides, and custom trip recommendations.'
    },
    {
      icon: <Award className="w-7 h-7 text-[#0878D1]" />,
      title: 'Helpful Visitor Information',
      desc: 'Accurate darshan timings, aarti schedules, entry rules, seasonal weather guides, and 24/7 tourist helpline numbers.'
    }
  ];

  return (
    <div className="bg-white text-[#17243A] space-y-16 sm:space-y-20 lg:space-y-28">

      {/* =========================================================================
          HERO SECTION (TRIVVIU Reference Visual Direction)
          ========================================================================= */}
      <section className="relative min-h-[620px] lg:min-h-[720px] flex flex-col justify-between overflow-hidden bg-[#17243A]">
        {/* Scenic Kolhapur Dynamic Landscape Background (Auto-Crossfades Between Real Kolhapur Landmarks) */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-[10000ms] ease-out"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = slide.fallback;
                }}
              />
            </div>
          ))}
          {/* Multi-layer Cinematic Overlays to ensure crisp readability of bold white typography */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/85 via-black/60 to-black/35 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#17243A] via-transparent to-black/25 opacity-90 pointer-events-none" />
        </div>

        {/* Hero Top Content: Left-Aligned Bold White Typography & Landmark Badge */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            
            {/* Left Column: Heading & CTAs */}
            <div className="max-w-2xl space-y-6 text-left">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
                <span>Official Travel & Tourism Guide to Kolhapur</span>
              </div>

              {/* Main Bold Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                Begin Your Kolhapur <br />
                <span className="text-white drop-shadow-md">Travel Journey</span>
              </h1>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg text-gray-200 font-normal leading-relaxed max-w-xl drop-shadow">
                Discover amazing destinations, explore rich heritage, experience authentic Kolhapuri culture and create unforgettable memories.
              </p>

              {/* Secondary line */}
              <p className="text-xs sm:text-sm text-gray-300 font-light flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                Explore temples, historical places, nature escapes and beautiful experiences across Kolhapur.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/explore"
                  className="bg-[#FF7900] hover:bg-[#E66D00] text-white px-7 py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-orange-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Explore Destinations</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/tours"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-6 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                  <span>View Tour Packages</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Dynamic Landmark Indicator & Slider Controls */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 self-stretch lg:self-auto">
              {/* Landmark location pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-md">
                <MapPin className="w-3.5 h-3.5 text-[#FF7900] shrink-0" />
                <span className="font-semibold">{heroSlides[activeHeroIndex].location}</span>
                <span className="text-[10px] text-gray-300 font-light hidden sm:inline border-l border-white/20 pl-2">
                  {heroSlides[activeHeroIndex].tag}
                </span>
              </div>

              {/* Hero Slide Switcher Dots & Arrows */}
              <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-md p-1.5 rounded-full border border-white/15">
                <button
                  type="button"
                  onClick={() => setActiveHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Previous Landmark"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-1">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`transition-all duration-300 h-2 rounded-full ${
                        idx === activeHeroIndex ? 'w-6 bg-[#FF7900]' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`View ${slide.title}`}
                      aria-label={`Slide ${idx + 1}: ${slide.title}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length)}
                  className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Next Landmark"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            FLOATING SEARCH PANEL (Bottom of Hero)
            ========================================================================= */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mb-12 sm:-mb-14">
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl border border-[#E5E7EB] transition-all"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              
              {/* FIELD 1: LOCATION */}
              <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F5F8FC] transition-colors border border-transparent focus-within:border-[#0878D1]">
                <div className="w-10 h-10 rounded-xl bg-[#0878D1]/10 text-[#0878D1] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="search-loc" className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Location
                  </label>
                  <select
                    id="search-loc"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent text-[#17243A] font-semibold text-sm focus:outline-none cursor-pointer truncate"
                  >
                    <option value="">Where do you want to go?</option>
                    <option value="Mahalakshmi">Mahalakshmi (Ambabai) Temple</option>
                    <option value="Panhala">Panhala Fort</option>
                    <option value="Rankala">Rankala Lake</option>
                    <option value="Jyotiba">Jyotiba Hills</option>
                    <option value="Radhanagari">Radhanagari Wildlife</option>
                    <option value="New Palace">New Palace Museum</option>
                    <option value="Kopeshwar">Kopeshwar Temple, Khidrapur</option>
                    <option value="Narsobawadi">Narsobawadi Dattatreya</option>
                    <option value="Bhavani Mandap">Bhavani Mandap</option>
                  </select>
                </div>
              </div>

              {/* FIELD 2: TRIP TYPE */}
              <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F5F8FC] transition-colors border border-transparent focus-within:border-[#0878D1]">
                <div className="w-10 h-10 rounded-xl bg-[#0878D1]/10 text-[#0878D1] flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="search-type" className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Trip Type
                  </label>
                  <select
                    id="search-type"
                    value={searchTripType}
                    onChange={(e) => setSearchTripType(e.target.value)}
                    className="w-full bg-transparent text-[#17243A] font-semibold text-sm focus:outline-none cursor-pointer truncate"
                  >
                    <option value="">Select trip category</option>
                    <option value="Religious Tourism">Religious Tourism</option>
                    <option value="Historical Tourism">Historical Tourism</option>
                    <option value="Nature & Adventure">Nature & Adventure</option>
                    <option value="Family Trip">Family Trip</option>
                    <option value="Cultural Experiences">Cultural Experiences</option>
                    <option value="Weekend Getaway">Weekend Getaway</option>
                  </select>
                </div>
              </div>

              {/* FIELD 3: DURATION */}
              <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F5F8FC] transition-colors border border-transparent focus-within:border-[#0878D1]">
                <div className="w-10 h-10 rounded-xl bg-[#0878D1]/10 text-[#0878D1] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="search-duration" className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Duration
                  </label>
                  <select
                    id="search-duration"
                    value={searchDuration}
                    onChange={(e) => setSearchDuration(e.target.value)}
                    className="w-full bg-transparent text-[#17243A] font-semibold text-sm focus:outline-none cursor-pointer truncate"
                  >
                    <option value="">Choose trip duration</option>
                    <option value="1 Day">1 Day</option>
                    <option value="2 Days">2 Days</option>
                    <option value="3 Days">3 Days</option>
                    <option value="4-5 Days">4-5 Days</option>
                    <option value="1 Week">1 Week</option>
                  </select>
                </div>
              </div>

              {/* FIELD 4: PRICE + SEARCH BUTTON */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 flex items-start gap-3 p-2 rounded-xl hover:bg-[#F5F8FC] transition-colors border border-transparent focus-within:border-[#0878D1]">
                  <div className="w-10 h-10 rounded-xl bg-[#0878D1]/10 text-[#0878D1] flex items-center justify-center shrink-0 mt-0.5">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label htmlFor="search-price" className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Price Range
                    </label>
                    <select
                      id="search-price"
                      value={searchPrice}
                      onChange={(e) => setSearchPrice(e.target.value)}
                      className="w-full bg-transparent text-[#17243A] font-semibold text-sm focus:outline-none cursor-pointer truncate"
                    >
                      <option value="">Budget level</option>
                      <option value="Budget">Budget (&lt; ₹1,500)</option>
                      <option value="Moderate">Moderate (₹1,500 - ₹3,500)</option>
                      <option value="Premium">Premium (₹3,500 - ₹6,000)</option>
                      <option value="Luxury">Luxury (₹6,000+)</option>
                    </select>
                  </div>
                </div>

                {/* Orange Search Action Button */}
                <button
                  type="submit"
                  className="bg-[#FF7900] hover:bg-[#E66D00] text-white font-bold px-6 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden md:inline">Search</span>
                </button>
              </div>

            </div>
          </form>

          {/* TRUST INDICATORS (Directly below search panel) */}
          <div className="pt-5 pb-2 flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10 text-white text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7900]" />
              <span className="drop-shadow">Best Travel Experiences</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0878D1]" />
              <span className="drop-shadow">Helpful Travel Support</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span className="drop-shadow">Discover Authentic Kolhapur</span>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to account for floating search panel */}
      <div className="h-6 sm:h-8" />

      {/* =========================================================================
          SECTION 1: POPULAR DESTINATIONS (TRIVVIU Reference Style)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
              TOP DESTINATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Explore the most cherished landmarks, sacred shrines, and scenic escapes across Kolhapur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Filter Pills */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#F5F8FC] p-1 rounded-xl border border-[#E5E7EB] text-xs font-semibold">
              {['All', 'Religious', 'Historical', 'Nature'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedCategory === cat 
                      ? 'bg-[#0878D1] text-white shadow-sm' 
                      : 'text-[#6B7280] hover:text-[#17243A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Link
              to="/explore"
              className="text-[#0878D1] hover:text-[#1267B0] font-bold text-sm flex items-center gap-1 group whitespace-nowrap"
            >
              <span>View All Destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Destinations 5-Card Grid (TRIVVIU Aspect Ratio 4:5 with Text Overlay) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="rounded-2xl bg-gray-200 aspect-[4/5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 2: WHY CHOOSE US (TRIVVIU Visual Structure)
          ========================================================================= */}
      <section className="bg-[#F5F8FC] py-16 sm:py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight">
              Your Trusted Partner to Explore Kolhapur
            </h2>
            <p className="text-sm text-[#6B7280] mt-2">
              We provide accurate information, curated trails, and genuine local guidance to ensure your journey through Kolhapur is effortless and unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#0878D1]/10 flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#17243A] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: POPULAR TOURS (TRIVVIU Reference Visual Direction)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
              FEATURED PACKAGES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight">
              Explore Our Popular Tours
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Curated multi-day guided tours and day itineraries crafted for every kind of traveler.
            </p>
          </div>

          <Link
            to="/tours"
            className="text-[#0878D1] hover:text-[#1267B0] font-bold text-sm flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View All Tours</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Tour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FIND YOUR PERFECT STAY (HOTELS)
          ========================================================================= */}
      <section className="bg-[#F5F8FC] py-16 sm:py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
                HOTELS & RESORTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight">
                Find Your Perfect Stay
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Handpicked 5-star luxury, comfortable boutique heritage hotels, and budget stays near major landmarks.
              </p>
            </div>

            <Link
              to="/hotels"
              className="text-[#0878D1] hover:text-[#1267B0] font-bold text-sm flex items-center gap-1 group whitespace-nowrap"
            >
              <span>View All Hotels</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3 Hotel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: EXPERIENCE AUTHENTIC KOLHAPUR (Culture, Food & Crafts)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
            EXPERIENCE KOLHAPUR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight">
            Authentic Flavors, Crafts & Royal Traditions
          </h2>
          <p className="text-sm text-[#6B7280] mt-2">
            Beyond temples and fortresses, immerse yourself in Kolhapur's living culinary, artisanal, and athletic heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {culturalExperiences.map((exp, idx) => (
            <Link
              key={idx}
              to={exp.link}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/hero-new-palace.jpg';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-[#0878D1] shadow-sm uppercase tracking-wide">
                    {exp.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[11px] font-medium text-[#6B7280] block mb-1 font-serif">
                    {exp.marathi}
                  </span>
                  <h3 className="font-bold text-lg text-[#17243A] group-hover:text-[#0878D1] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>

                <div className="pt-3 flex items-center gap-1.5 text-xs font-bold text-[#FF7900] group-hover:text-[#E66D00]">
                  <span>Discover More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PHOTO GALLERY WITH INTERACTIVE LIGHTBOX
          ========================================================================= */}
      <section className="bg-[#F5F8FC] py-16 sm:py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
                PHOTO GALLERY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight">
                Glimpses of Kolhapur
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Click on any photo to open the interactive full-screen visual viewer.
              </p>
            </div>

            <Link
              to="/gallery"
              className="text-[#0878D1] hover:text-[#1267B0] font-bold text-sm flex items-center gap-1 group whitespace-nowrap"
            >
              <span>Explore Full Gallery ({galleryPhotos.length > 0 ? '18 Photos' : 'View All'})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 6 Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={photo.url || photo.image}
                  alt={photo.title || 'Kolhapur Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/hero-new-palace.jpg';
                  }}
                />
                
                {/* Overlay with magnifying glass */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-white/25 backdrop-blur-md">
                      <Camera className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      {photo.category || 'Kolhapur Landmark'}
                    </span>
                    <h4 className="font-bold text-sm leading-tight">
                      {photo.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WEATHER & PRACTICAL TRAVELER TIPS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="lg:col-span-1">
            <WeatherWidget />
          </div>

          <div className="lg:col-span-2 bg-[#F5F8FC] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB]">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
              TRAVELER ESSENTIALS
            </span>
            <h3 className="text-2xl font-extrabold text-[#17243A] mb-4">
              Best Time to Visit & Local Advice
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#6B7280]">
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <h4 className="font-bold text-[#17243A] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Winter (October to March)
                </h4>
                <p>Ideal pleasant climate (15°C – 28°C) for heritage exploration, fort walks, and temple pilgrimages.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <h4 className="font-bold text-[#17243A] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0878D1]" />
                  Monsoon (June to September)
                </h4>
                <p>Lush misty green landscapes at Panhala Fort and gushing water cascades across the Western Ghats.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <h4 className="font-bold text-[#17243A] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                  Temple Etiquette & Aarti
                </h4>
                <p>Traditional dress code recommended at Mahalakshmi Temple. Early morning (5:00 AM) Kakad Aarti is peaceful.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <h4 className="font-bold text-[#17243A] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Local Transport
                </h4>
                <p>Auto-rickshaws, KMT city buses, and app taxis are readily available. Panhala is easily reached by ST bus.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                to="/planner"
                className="bg-[#0878D1] hover:bg-[#1267B0] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Create Custom Itinerary</span>
              </Link>
              <Link
                to="/faq"
                className="text-[#0878D1] hover:underline text-xs sm:text-sm font-semibold"
              >
                Read Frequently Asked Questions →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 8: NEWSLETTER & FREE TRAVEL GUIDE DOWNLOAD
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-[#17243A] via-[#103B30] to-[#17243A] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-[#FF7900] uppercase tracking-widest block mb-2">
              STAY CONNECTED
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold mb-3">
              Get Your Free Kolhapur Travel Guide
            </h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Subscribe to receive verified itineraries, festival notifications, exclusive tour offers, and insider food recommendations directly to your inbox.
            </p>

            {newsletterSubmitted ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Thank you! Your travel guide has been sent to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#FF7900] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#FF7900] hover:bg-[#E66D00] text-white px-7 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Subscribe Now</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Full-Screen Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={galleryPhotos}
        initialIndex={lightboxIndex}
      />

    </div>
  );
}
