import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import HotelCard from '../components/HotelCard';
import { 
  User, 
  BookmarkCheck, 
  Heart, 
  Calendar, 
  Settings, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  ShieldCheck, 
  Trash2, 
  Printer, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [myBookings, setMyBookings] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit fields
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editCity, setEditCity] = useState(user?.city || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        if (user) {
          const res = await api.getMyBookings();
          if (res.success && Array.isArray(res.data)) setMyBookings(res.data);
        }
        const plans = JSON.parse(localStorage.getItem('kolhapur_saved_itineraries') || '[]');
        setSavedPlans(plans);
      } catch (err) {
        console.error('Failed to load user bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to request cancellation for this booking?')) return;
    try {
      const res = await api.cancelBooking(id);
      if (res.success) {
        setMyBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
      }
    } catch (err) {
      alert(err.message || 'Cancellation failed');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateProfile({
        name: editName,
        phone: editPhone,
        city: editCity
      });
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Update failed');
    }
  };

  const removePlan = (index) => {
    const updated = savedPlans.filter((_, i) => i !== index);
    setSavedPlans(updated);
    localStorage.setItem('kolhapur_saved_itineraries', JSON.stringify(updated));
  };

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* User Header Profile Card */}
        <div className="bg-[#17243A] text-white rounded-3xl p-6 sm:p-8 shadow-card border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'Guest')}`}
              alt={user?.name || 'Guest'}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#0878D1] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold">
                  {user ? user.name : 'Guest Traveler'}
                </h1>
                {isAdmin && (
                  <span className="bg-[#FF7900] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                {user ? user.email : 'Explore and manage your travel wishlist & plans'}
              </p>
              {user?.city && (
                <p className="text-xs text-[#0878D1] font-semibold mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{user.city}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-center">
              <span className="text-lg font-extrabold text-[#FF7900]">{myBookings.length}</span>
              <span className="text-[10px] text-gray-300 font-semibold block">Bookings</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-center">
              <span className="text-lg font-extrabold text-[#0878D1]">{wishlist.length}</span>
              <span className="text-[10px] text-gray-300 font-semibold block">Wishlist</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-center">
              <span className="text-lg font-extrabold text-emerald-400">{savedPlans.length}</span>
              <span className="text-[10px] text-gray-300 font-semibold block">Saved Plans</span>
            </div>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="flex border-b border-[#E5E7EB] overflow-x-auto gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
            { id: 'bookings', label: `My Bookings (${myBookings.length})`, icon: <BookmarkCheck className="w-4 h-4" /> },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: <Heart className="w-4 h-4" /> },
            { id: 'plans', label: `Saved Plans (${savedPlans.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'profile', label: 'Profile Settings', icon: <Settings className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#0878D1] text-[#0878D1]'
                  : 'border-transparent text-[#6B7280] hover:text-[#17243A]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-card space-y-3">
              <h3 className="font-extrabold text-base text-[#17243A]">Recent Bookings</h3>
              {myBookings.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {myBookings.slice(0, 3).map(b => (
                    <div key={b.id} className="p-3 bg-[#F5F8FC] rounded-xl flex justify-between items-center border border-[#E5E7EB]">
                      <div>
                        <div className="font-bold text-[#17243A]">{b.destinationOrHotel}</div>
                        <div className="text-[10px] text-[#6B7280]">{b.travelDate}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#6B7280]">No active bookings recorded yet.</p>
              )}
              <Link to="/booking" className="inline-block text-xs text-[#0878D1] font-bold hover:underline">
                Book a new destination &rarr;
              </Link>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-card space-y-3">
              <h3 className="font-extrabold text-base text-[#17243A]">Saved Favorites</h3>
              <p className="text-xs text-[#6B7280]">
                You have {wishlist.length} destinations and hotels saved to your trip wishlist.
              </p>
              <button
                onClick={() => setSearchParams({ tab: 'wishlist' })}
                className="text-xs text-[#0878D1] font-bold hover:underline"
              >
                View wishlist items &rarr;
              </button>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-card space-y-3">
              <h3 className="font-extrabold text-base text-[#17243A]">Custom Travel Itineraries</h3>
              <p className="text-xs text-[#6B7280]">
                You have {savedPlans.length} saved custom travel schedules ready for your visit.
              </p>
              <Link to="/planner" className="inline-block text-xs text-[#0878D1] font-bold hover:underline">
                Generate new plan &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-extrabold text-lg text-[#17243A]">Your Trip Bookings</h2>
              <Link to="/booking" className="bg-[#0878D1] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                + New Booking
              </Link>
            </div>

            {myBookings.length === 0 ? (
              <div className="bg-[#F5F8FC] p-12 text-center rounded-3xl border border-dashed border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] mb-4">No bookings found for your account.</p>
                <Link to="/booking" className="bg-[#FF7900] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md">
                  Plan & Book Your Trip
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b) => (
                  <div key={b.id} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0878D1]">{b.reference || b.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#17243A] mt-1">{b.destinationOrHotel}</h3>
                      <div className="text-xs text-[#6B7280] mt-1 flex flex-wrap gap-3">
                        <span>Travel Date: <strong className="text-[#17243A]">{b.travelDate}</strong></span>
                        <span>Guests: <strong className="text-[#17243A]">{b.travellers?.adults} Adults, {b.travellers?.children} Children</strong></span>
                        <span>Estimated: <strong className="text-[#0878D1]">₹{b.estimatedPrice?.toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {b.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-xs text-rose-600 hover:bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-200 transition-colors font-semibold"
                        >
                          Request Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-extrabold text-lg text-[#17243A]">Your Saved Wishlist ({wishlist.length})</h2>
              {wishlist.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {wishlist.length === 0 ? (
              <div className="bg-[#F5F8FC] p-12 text-center rounded-3xl border border-dashed border-[#E5E7EB]">
                <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-xs text-[#6B7280] mb-4">Your wishlist is currently empty.</p>
                <Link to="/explore" className="bg-[#0878D1] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md">
                  Explore Destinations
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlist.map(item => (
                  item.type ? (
                    <HotelCard key={item.id} hotel={item} />
                  ) : (
                    <DestinationCard key={item.id} destination={item} />
                  )
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SAVED PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-extrabold text-lg text-[#17243A]">Saved Custom Itineraries ({savedPlans.length})</h2>
              <Link to="/planner" className="bg-[#0878D1] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                + Create New Plan
              </Link>
            </div>

            {savedPlans.length === 0 ? (
              <div className="bg-[#F5F8FC] p-12 text-center rounded-3xl border border-dashed border-[#E5E7EB]">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-xs text-[#6B7280] mb-4">No custom travel itineraries saved yet.</p>
                <Link to="/planner" className="bg-[#FF7900] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md">
                  Launch Travel Planner
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedPlans.map((plan, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-card space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#0878D1] uppercase tracking-wider block">
                          {plan.daysCount} Days Plan
                        </span>
                        <h3 className="font-bold text-base text-[#17243A] mt-0.5">{plan.planTitle}</h3>
                      </div>
                      <button
                        onClick={() => removePlan(idx)}
                        className="text-gray-400 hover:text-rose-500"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-[#6B7280] space-y-1">
                      <p>👥 Travelers: <strong>{plan.travelersCount}</strong></p>
                      <p>⚡ Pace: <strong>{plan.pace}</strong></p>
                      <p>💰 Est. Total: <strong className="text-[#0878D1]">₹{plan.estimatedTotalBudget?.toLocaleString()}</strong></p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB]">
                      <Link
                        to={`/booking?type=custom_planner&target=${encodeURIComponent(plan.planTitle)}&price=${plan.estimatedTotalBudget}`}
                        className="bg-[#FF7900] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1"
                      >
                        <span>Book Assistance</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-card space-y-6">
            <div>
              <h2 className="font-extrabold text-lg text-[#17243A]">Profile Settings</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Update your personal contact details.</p>
            </div>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                {profileSuccess}
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">City of Residence</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  placeholder="e.g. Pune, Mumbai, Bangalore"
                  className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-[#0878D1] hover:bg-[#1267B0] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
                >
                  Save Profile Changes
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
