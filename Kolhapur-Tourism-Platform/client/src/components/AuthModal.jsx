import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        city: regCity
      });
      setSuccess('Registration successful!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setTab('login');
    setLoginEmail('admin@kolhapurtourism.com');
    setLoginPassword('Admin@123');
    setError('');
  };

  const fillTraveler = () => {
    setTab('login');
    setLoginEmail('traveler@kolhapur.com');
    setLoginPassword('Traveler@123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E5E7EB]">
        
        {/* Header */}
        <div className="bg-[#17243A] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-xl font-extrabold text-white">
              Kolhapur Tourism Portal
            </h3>
            <p className="text-xs text-[#0878D1] font-semibold mt-1">
              Sign in to manage bookings, create itineraries & save favorites
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-white/10 rounded-xl p-1 mt-4 border border-white/10">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'login' ? 'bg-[#0878D1] text-white shadow' : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'register' ? 'bg-[#0878D1] text-white shadow' : 'text-gray-300 hover:text-white'
              }`}
            >
              Register New Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. traveler@kolhapur.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl focus:border-[#0878D1] outline-none text-[#17243A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl focus:border-[#0878D1] outline-none text-[#17243A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs sm:text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In to Account'}
              </button>

              {/* Quick Fill Testing Credentials */}
              <div className="pt-3 border-t border-[#E5E7EB]">
                <p className="text-[11px] font-bold text-[#6B7280] mb-2 text-center">
                  Quick Demo Login (Click to Auto-fill):
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fillTraveler}
                    className="flex-1 bg-[#F5F8FC] hover:bg-gray-200 text-[#17243A] text-[11px] font-bold py-2 px-2 rounded-xl border border-[#E5E7EB] transition-colors"
                  >
                    Traveler (Demo)
                  </button>
                  <button
                    type="button"
                    onClick={fillAdmin}
                    className="flex-1 bg-[#0878D1]/10 hover:bg-[#0878D1]/20 text-[#0878D1] text-[11px] font-bold py-2 px-2 rounded-xl border border-[#0878D1]/20 transition-colors"
                  >
                    Admin Console
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rajesh Patil"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl focus:border-[#0878D1] outline-none text-[#17243A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. rajesh@example.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl focus:border-[#0878D1] outline-none text-[#17243A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl focus:border-[#0878D1] outline-none text-[#17243A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6B7280]" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full pl-9 pr-2 py-2.5 text-xs bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl focus:border-[#0878D1] outline-none text-[#17243A]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Your City</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6B7280]" />
                    <input
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder="e.g. Pune"
                      className="w-full pl-9 pr-2 py-2.5 text-xs bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl focus:border-[#0878D1] outline-none text-[#17243A]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs sm:text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
