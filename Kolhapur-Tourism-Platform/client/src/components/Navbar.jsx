import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  Heart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  BookmarkCheck, 
  ChevronDown,
  Compass,
  MapPin,
  Calendar,
  Image,
  HelpCircle,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onOpenAuthModal }) {
  const { user, logout, isAdmin } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setPagesDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPagesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Tours', path: '/tours' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'Experiences', path: '/food-and-culture' },
    { name: 'Travel Guide', path: '/planner' },
  ];

  const pageDropdownLinks = [
    { name: 'Photo Gallery & Lightbox', path: '/gallery', icon: <Image className="w-4 h-4 text-[#0878D1]" /> },
    { name: 'Sacred Temples (Ambabai / Jyotiba)', path: '/temples', icon: <Compass className="w-4 h-4 text-[#0878D1]" /> },
    { name: 'Historic Forts & Maratha Heritage', path: '/history', icon: <ShieldCheck className="w-4 h-4 text-[#0878D1]" /> },
    { name: 'Nature Escapes & Lakes', path: '/nature', icon: <MapPin className="w-4 h-4 text-[#0878D1]" /> },
    { name: 'Interactive Tourism Map', path: '/map', icon: <MapPin className="w-4 h-4 text-[#0878D1]" /> },
    { name: 'Upcoming Festivals & Events', path: '/events', icon: <Calendar className="w-4 h-4 text-[#0878D1]" /> },
    { name: 'Frequently Asked Questions (FAQ)', path: '/faq', icon: <HelpCircle className="w-4 h-4 text-[#0878D1]" /> },
    { name: 'About Kolhapur Tourism', path: '/about', icon: <Sparkles className="w-4 h-4 text-[#0878D1]" /> },
    { name: 'Contact & Support Helpdesk', path: '/contact', icon: <PhoneCall className="w-4 h-4 text-[#0878D1]" /> },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Kolhapur Tourism Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 max-w-[200px] sm:max-w-none">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#0878D1] shadow-sm group-hover:scale-105 transition-transform bg-[#0A2540] flex items-center justify-center shrink-0">
              <img 
                src="/images/logo.png" 
                alt="Kolhapur Tourism Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/logo.jpg';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-2xl font-bold tracking-tight text-[#17243A] leading-none group-hover:text-[#0878D1] transition-colors truncate flex items-center gap-1.5">
                <span>Kolhapur<span className="text-[#0878D1]">Tourism</span></span>
                <span className="text-[9px] sm:text-[10px] font-black text-[#FF7900] tracking-wider uppercase bg-[#FF7900]/10 border border-[#FF7900]/20 px-1 py-0.5 rounded leading-none shadow-2xs">
                  TM
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-[#6B7280] font-medium mt-0.5 hidden xs:block truncate">
                Official Travel Discovery Portal
              </p>
            </div>
          </Link>

          {/* CENTER: Main Horizontal Navigation with Blue Active Underline */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 text-sm font-medium transition-colors relative flex items-center ${
                    active
                      ? 'text-[#0878D1] font-semibold'
                      : 'text-[#17243A] hover:text-[#0878D1]'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0878D1] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Pages Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPagesDropdownOpen(!pagesDropdownOpen)}
                className={`px-3.5 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  ['/gallery', '/temples', '/history', '/nature', '/map', '/events', '/faq', '/about', '/contact'].some(p => location.pathname.startsWith(p))
                    ? 'text-[#0878D1] font-semibold'
                    : 'text-[#17243A] hover:text-[#0878D1]'
                }`}
              >
                <span>Pages</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${pagesDropdownOpen ? 'rotate-180 text-[#0878D1]' : 'text-gray-400'}`} />
              </button>

              {pagesDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 border border-[#E5E7EB] animate-fadeIn">
                  <div className="px-4 py-2 border-b border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                    Kolhapur Travel Directories
                  </div>
                  {pageDropdownLinks.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#17243A] hover:bg-[#F5F8FC] hover:text-[#0878D1] transition-colors"
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT: User Actions, Wishlist & Orange 'Explore Tours' Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Wishlist Button */}
            <Link
              to="/dashboard?tab=wishlist"
              className="relative p-2 rounded-lg text-[#17243A] hover:text-[#0878D1] hover:bg-[#F5F8FC] transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF7900] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Auth: User Profile Dropdown or Sign In / Register */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F5F8FC] text-[#17243A] transition-colors border border-transparent hover:border-[#E5E7EB]"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#0878D1]"
                  />
                  <span className="text-xs font-semibold hidden md:inline max-w-[90px] truncate text-[#17243A]">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 text-[#17243A] border border-[#E5E7EB] animate-fadeIn">
                    <div className="px-4 py-2 border-b border-[#E5E7EB]">
                      <p className="text-xs text-[#6B7280]">Signed in as</p>
                      <p className="text-sm font-semibold truncate text-[#17243A]">{user.name}</p>
                      <p className="text-[11px] text-[#6B7280] truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#17243A] hover:bg-[#F5F8FC] hover:text-[#0878D1]"
                    >
                      <User className="w-4 h-4 text-[#0878D1]" />
                      <span>User Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard?tab=bookings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#17243A] hover:bg-[#F5F8FC] hover:text-[#0878D1]"
                    >
                      <BookmarkCheck className="w-4 h-4 text-[#0878D1]" />
                      <span>My Bookings</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#FF7900] hover:bg-orange-50 border-t border-[#E5E7EB]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#FF7900]" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-[#E5E7EB] mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="text-xs font-medium text-[#17243A] hover:text-[#0878D1] px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="text-xs font-medium text-[#0878D1] hover:bg-[#F5F8FC] px-3 py-2 rounded-lg border border-[#0878D1]/30 transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {/* TRIVVIU ORANGE ACTION BUTTON: Explore Tours */}
            <Link
              to="/tours"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-transform hover:scale-[1.02] shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Tours</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#17243A] hover:bg-[#F5F8FC] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#0878D1]" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#E5E7EB] px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-lg">
          <div className="grid grid-cols-2 gap-1 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-between ${
                  isActive(link.path)
                    ? 'bg-[#0878D1] text-white font-semibold'
                    : 'text-[#17243A] hover:bg-[#F5F8FC]'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E5E7EB]">
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider px-2 py-1">
              Explore More
            </p>
            <div className="grid grid-cols-2 gap-1">
              <Link to="/gallery" className="px-3 py-2 text-xs text-[#17243A] hover:text-[#0878D1] rounded-lg hover:bg-[#F5F8FC]">
                Photo Gallery
              </Link>
              <Link to="/temples" className="px-3 py-2 text-xs text-[#17243A] hover:text-[#0878D1] rounded-lg hover:bg-[#F5F8FC]">
                Sacred Temples
              </Link>
              <Link to="/history" className="px-3 py-2 text-xs text-[#17243A] hover:text-[#0878D1] rounded-lg hover:bg-[#F5F8FC]">
                Forts & Heritage
              </Link>
              <Link to="/nature" className="px-3 py-2 text-xs text-[#17243A] hover:text-[#0878D1] rounded-lg hover:bg-[#F5F8FC]">
                Nature & Lakes
              </Link>
              <Link to="/map" className="px-3 py-2 text-xs text-[#17243A] hover:text-[#0878D1] rounded-lg hover:bg-[#F5F8FC]">
                Interactive Map
              </Link>
              <Link to="/contact" className="px-3 py-2 text-xs text-[#17243A] hover:text-[#0878D1] rounded-lg hover:bg-[#F5F8FC]">
                Contact Support
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
            <Link
              to="/tours"
              className="w-full bg-[#FF7900] text-white font-semibold text-center text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Tours</span>
            </Link>

            {!user && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuthModal(); }}
                className="w-full border border-[#0878D1] text-[#0878D1] font-semibold text-center text-xs py-2 rounded-lg"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
