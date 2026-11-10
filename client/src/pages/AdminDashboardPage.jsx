import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Building2, 
  BookmarkCheck, 
  Mail, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Plus, 
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin, login } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState('bookings'); // bookings, messages, destinations, hotels

  // Quick login for testing
  const [loginLoading, setLoginLoading] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookRes, msgRes, destRes, hotRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllBookings(),
        api.getAllMessages(),
        api.getDestinations(),
        api.getHotels()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (bookRes.success) setBookings(bookRes.data);
      if (msgRes.success) setMessages(msgRes.data);
      if (destRes.success) setDestinations(destRes.data);
      if (hotRes.success) setHotels(hotRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.updateBookingStatus(id, newStatus);
      if (res.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleMessageStatus = async (id, newStatus) => {
    try {
      const res = await api.updateMessageStatus(id, newStatus);
      if (res.success) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
      }
    } catch (err) {
      alert(err.message || 'Inquiry status update failed');
    }
  };

  const quickAdminLogin = async () => {
    setLoginLoading(true);
    try {
      await login('admin@kolhapurtourism.com', 'Admin@123');
    } catch (e) {
      alert(e.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white min-h-screen py-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-[#F5F8FC] rounded-3xl border border-[#E5E7EB] text-center space-y-4 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-[#0878D1]/10 text-[#0878D1] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#17243A]">Administrator Access Required</h2>
          <p className="text-xs text-[#6B7280]">
            You must be logged in as an administrator to access the platform management console.
          </p>
          <button
            onClick={quickAdminLogin}
            disabled={loginLoading}
            className="w-full bg-[#0878D1] hover:bg-[#1267B0] text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {loginLoading ? 'Authenticating...' : 'Sign In as Admin (One-Click)'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Admin Title */}
        <div className="bg-[#17243A] text-white rounded-3xl p-8 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FF7900] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Master Administration Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kolhapur Tourism Management Portal
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 font-light">
              Manage tourist bookings, destination registries, verified hotels, and customer inquiries.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 shrink-0 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Analytics Overview Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#F5F8FC] p-4 rounded-2xl border border-[#E5E7EB] text-center">
              <span className="text-2xl font-extrabold text-[#17243A]">{stats.totalBookings}</span>
              <span className="text-[10px] text-[#6B7280] font-bold block uppercase mt-0.5">Total Bookings</span>
            </div>
            <div className="bg-[#F5F8FC] p-4 rounded-2xl border border-[#E5E7EB] text-center">
              <span className="text-2xl font-extrabold text-amber-600">{stats.pendingBookings}</span>
              <span className="text-[10px] text-[#6B7280] font-bold block uppercase mt-0.5">Pending Enquiries</span>
            </div>
            <div className="bg-[#F5F8FC] p-4 rounded-2xl border border-[#E5E7EB] text-center">
              <span className="text-2xl font-extrabold text-emerald-600">{stats.confirmedBookings}</span>
              <span className="text-[10px] text-[#6B7280] font-bold block uppercase mt-0.5">Confirmed Trips</span>
            </div>
            <div className="bg-[#F5F8FC] p-4 rounded-2xl border border-[#E5E7EB] text-center">
              <span className="text-2xl font-extrabold text-[#0878D1]">{stats.totalDestinations}</span>
              <span className="text-[10px] text-[#6B7280] font-bold block uppercase mt-0.5">Destinations</span>
            </div>
            <div className="bg-[#F5F8FC] p-4 rounded-2xl border border-[#E5E7EB] text-center">
              <span className="text-2xl font-extrabold text-[#FF7900]">{stats.totalHotels}</span>
              <span className="text-[10px] text-[#6B7280] font-bold block uppercase mt-0.5">Hotels</span>
            </div>
            <div className="bg-[#F5F8FC] p-4 rounded-2xl border border-[#E5E7EB] text-center">
              <span className="text-2xl font-extrabold text-purple-600">{stats.totalInquiries}</span>
              <span className="text-[10px] text-[#6B7280] font-bold block uppercase mt-0.5">Inquiries</span>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-[#E5E7EB] overflow-x-auto gap-2">
          {[
            { id: 'bookings', label: `Manage Bookings (${bookings.length})` },
            { id: 'messages', label: `Customer Inquiries (${messages.length})` },
            { id: 'destinations', label: `Destinations (${destinations.length})` },
            { id: 'hotels', label: `Hotels (${hotels.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                adminTab === tab.id
                  ? 'border-[#0878D1] text-[#0878D1]'
                  : 'border-transparent text-[#6B7280] hover:text-[#17243A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: BOOKINGS */}
        {adminTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8FC] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Destination / Hotel</th>
                    <th className="p-4">Travel Date</th>
                    <th className="p-4">Estimated Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-[#F5F8FC]/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#0878D1]">{b.reference || b.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-[#17243A]">{b.customer?.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{b.customer?.email} • {b.customer?.phone}</div>
                      </td>
                      <td className="p-4 font-semibold text-[#17243A]">{b.destinationOrHotel}</td>
                      <td className="p-4 text-[#6B7280]">{b.travelDate}</td>
                      <td className="p-4 font-bold text-[#0878D1]">₹{b.estimatedPrice?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="text-[11px] font-semibold bg-white border border-[#E5E7EB] rounded-lg p-1.5 outline-none focus:border-[#0878D1] cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MESSAGES */}
        {adminTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8FC] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Sender</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {messages.map(m => (
                    <tr key={m.id} className="hover:bg-[#F5F8FC]/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#17243A]">{m.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{m.email} • {m.phone || 'No phone'}</div>
                      </td>
                      <td className="p-4 font-bold text-[#17243A]">{m.subject || 'General Inquiry'}</td>
                      <td className="p-4 text-[#6B7280] max-w-sm truncate">{m.message}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.status || 'New'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleMessageStatus(m.id, m.status === 'Resolved' ? 'New' : 'Resolved')}
                          className="text-[11px] font-bold text-[#0878D1] hover:underline"
                        >
                          {m.status === 'Resolved' ? 'Mark New' : 'Mark Resolved'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3 & 4: DESTINATIONS & HOTELS */}
        {(adminTab === 'destinations' || adminTab === 'hotels') && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-[#17243A]">
                Registered {adminTab === 'destinations' ? 'Attractions' : 'Hotel Properties'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(adminTab === 'destinations' ? destinations : hotels).map((item) => (
                <div key={item.id} className="p-4 bg-[#F5F8FC] rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#17243A]">{item.name}</h4>
                    <p className="text-[11px] text-[#6B7280]">{item.category || item.type}</p>
                  </div>
                  <span className="text-xs font-bold text-[#0878D1]">★ {item.rating || 4.5}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
