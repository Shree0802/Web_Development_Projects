import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  CalendarCheck, 
  MapPin, 
  Building2, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Search,
  Phone,
  Mail,
  User,
  Printer,
  Sparkles
} from 'lucide-react';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const prefillType = searchParams.get('type') || 'destination_tour';
  const prefillTarget = searchParams.get('target') || '';
  const prefillPrice = searchParams.get('price') || '';

  const { user } = useAuth();

  // Mode: 'new_booking' | 'track_booking'
  const [mode, setMode] = useState('new_booking');

  // Form Fields
  const [bookingType, setBookingType] = useState(prefillType);
  const [destinationOrHotel, setDestinationOrHotel] = useState(prefillTarget);
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [custName, setCustName] = useState(user ? user.name : '');
  const [custEmail, setCustEmail] = useState(user ? user.email : '');
  const [custPhone, setCustPhone] = useState(user ? user.phone : '');
  const [custCity, setCustCity] = useState(user ? user.city : '');
  const [accommodationPref, setAccommodationPref] = useState('Standard Guided Tour Package');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (user) {
      if (!custName && user.name) setCustName(user.name);
      if (!custEmail && user.email) setCustEmail(user.email);
      if (!custPhone && user.phone) setCustPhone(user.phone);
      if (!custCity && user.city) setCustCity(user.city);
    }
  }, [user]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [error, setError] = useState('');

  // Tracking state
  const [trackingRef, setTrackingRef] = useState('');
  const [trackedBooking, setTrackedBooking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Auto-calculate realistic estimated pricing
  const calculateEstimate = () => {
    if (prefillPrice && Number(prefillPrice) > 0) return Number(prefillPrice);
    if (bookingType === 'hotel') {
      const days = Math.max(1, Math.round((new Date(checkOutDate) - new Date(travelDate)) / (1000 * 60 * 60 * 24)) || 1);
      return (adults * 2200 + children * 600) * days;
    }
    return adults * 1500 + children * 500;
  };

  const estimatedPrice = calculateEstimate();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Date validation
    const today = new Date().toISOString().split('T')[0];
    if (travelDate < today) {
      setError('Travel date cannot be in the past. Please select a valid future date.');
      return;
    }
    if (bookingType === 'hotel' && checkOutDate < travelDate) {
      setError('Check-out date must be on or after check-in date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type: bookingType,
        destinationOrHotel,
        travelDate,
        checkOutDate: bookingType === 'hotel' ? checkOutDate : undefined,
        travellers: { adults, children },
        customer: {
          name: custName,
          email: custEmail,
          phone: custPhone,
          city: custCity
        },
        accommodationPreference: accommodationPref,
        specialRequests,
        estimatedPrice
      };

      const res = await api.createBooking(payload);
      if (res.success && res.data) {
        setConfirmedBooking(res.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error(res.message || 'Booking submission failed');
      }
    } catch (err) {
      setError(err.message || 'Could not complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackingRef.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackedBooking(null);

    try {
      const res = await api.trackBooking(trackingRef.trim());
      if (res.success && res.data) {
        setTrackedBooking(res.data);
      } else {
        setTrackingError('No booking found with this reference code.');
      }
    } catch (err) {
      setTrackingError(err.message || 'Failed to locate booking record.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Header Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-14 sm:py-16 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Booking"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900] mb-2">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Travel & Hotel Reservations</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Book Your Kolhapur Experience
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 font-light">
                Verified tour packages, temple darshan guidance & hotel booking enquiries.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-white/15 backdrop-blur-md rounded-xl p-1 border border-white/20 shrink-0">
              <button
                onClick={() => { setMode('new_booking'); setConfirmedBooking(null); }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'new_booking' ? 'bg-[#FF7900] text-white shadow-md' : 'text-gray-300 hover:text-white'
                }`}
              >
                New Booking
              </button>
              <button
                onClick={() => setMode('track_booking')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'track_booking' ? 'bg-[#FF7900] text-white shadow-md' : 'text-gray-300 hover:text-white'
                }`}
              >
                Track Status
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* CONFIRMED RECEIPT SCREEN */}
        {confirmedBooking ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-[#E5E7EB] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Booking Enquiry Registered Successfully!
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] mt-1">
                Thank You, {confirmedBooking.customer.name}!
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                A verification confirmation has been sent to <strong>{confirmedBooking.customer.email}</strong>.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="inline-block bg-[#F5F8FC] border-2 border-dashed border-[#0878D1] p-4 rounded-2xl">
              <span className="text-[10px] text-[#6B7280] font-bold uppercase block">
                Unique Booking Reference Code:
              </span>
              <div className="text-2xl font-mono font-extrabold text-[#0878D1] tracking-wider mt-0.5">
                {confirmedBooking.reference}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">Status: {confirmedBooking.status}</span>
            </div>

            {/* Summary Box */}
            <div className="bg-[#F5F8FC] p-6 rounded-2xl border border-[#E5E7EB] text-left text-xs max-w-lg mx-auto space-y-2.5">
              <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-[#6B7280]">Destination / Property:</span>
                <span className="font-bold text-[#17243A]">{confirmedBooking.destinationOrHotel}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-[#6B7280]">Travel Date:</span>
                <span className="font-semibold text-[#17243A]">{confirmedBooking.travelDate}</span>
              </div>
              {confirmedBooking.type === 'hotel' && (
                <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="text-[#6B7280]">Check-out Date:</span>
                  <span className="font-semibold text-[#17243A]">{confirmedBooking.checkOutDate}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-[#6B7280]">Number of Guests:</span>
                <span className="font-semibold text-[#17243A]">
                  {confirmedBooking.travellers.adults} Adults, {confirmedBooking.travellers.children} Children
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-[#6B7280]">Estimated Total:</span>
                <span className="font-bold text-[#0878D1] text-sm">₹{confirmedBooking.estimatedPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#6B7280]">Payment Protocol:</span>
                <span className="font-semibold text-[#17243A]">{confirmedBooking.paymentMode}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-white hover:bg-[#F5F8FC] text-[#17243A] text-xs font-bold px-5 py-2.5 rounded-xl border border-[#E5E7EB] shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <Link
                to="/dashboard?tab=bookings"
                className="bg-[#0878D1] hover:bg-[#1267B0] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md"
              >
                View in Dashboard
              </Link>
            </div>
          </div>
        ) : mode === 'track_booking' ? (
          
          /* TRACKING SCREEN */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-[#E5E7EB] space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#17243A]">Track Your Booking Reference</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Enter your unique booking reference (e.g. <code>KOL-2026-4019</code>) to check live status.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-md">
              <input
                type="text"
                required
                value={trackingRef}
                onChange={(e) => setTrackingRef(e.target.value.toUpperCase())}
                placeholder="e.g. KOL-2026-XXXX"
                className="flex-1 px-4 py-2.5 text-xs font-mono bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="bg-[#0878D1] hover:bg-[#1267B0] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
              >
                {trackingLoading ? 'Searching...' : 'Track'}
              </button>
            </form>

            {trackingError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {trackingError}
              </div>
            )}

            {trackedBooking && (
              <div className="bg-[#F5F8FC] p-6 rounded-2xl border border-[#E5E7EB] text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                  <span className="font-extrabold text-[#17243A] text-sm">{trackedBooking.reference}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    trackedBooking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    trackedBooking.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {trackedBooking.status}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280]">Destination / Hotel: </span>
                  <span className="font-semibold text-[#17243A]">{trackedBooking.destinationOrHotel}</span>
                </div>
                <div>
                  <span className="text-[#6B7280]">Travel Date: </span>
                  <span className="font-semibold text-[#17243A]">{trackedBooking.travelDate}</span>
                </div>
                <div>
                  <span className="text-[#6B7280]">Guest Name: </span>
                  <span className="font-semibold text-[#17243A]">{trackedBooking.customer?.name}</span>
                </div>
                <div>
                  <span className="text-[#6B7280]">Estimated Total: </span>
                  <span className="font-bold text-[#0878D1]">₹{trackedBooking.estimatedPrice?.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

        ) : (

          /* NEW BOOKING FORM */
          <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-[#E5E7EB] space-y-8">
            
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Section 1: Trip Type & Destination */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-[#0878D1] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                1. Destination & Experience Selection
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Booking Category</label>
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  >
                    <option value="destination_tour">Heritage & Temple Tour Package</option>
                    <option value="hotel">Hotel / Resort Stay Reservation</option>
                    <option value="custom_planner">Custom Itinerary Guided Tour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Destination / Hotel Name</label>
                  <input
                    type="text"
                    required
                    value={destinationOrHotel}
                    onChange={(e) => setDestinationOrHotel(e.target.value)}
                    placeholder="e.g. Mahalakshmi Temple or Sayaji Hotel Kolhapur"
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Dates & Guests */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-[#0878D1] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                2. Dates & Guest Party
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Travel / Check-in Date</label>
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  />
                </div>

                {bookingType === 'hotel' && (
                  <div>
                    <label className="block text-xs font-bold text-[#17243A] mb-1">Check-out Date</label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Adults (12+ yrs)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Children (under 12)</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact Details */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-[#0878D1] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                3. Primary Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Ramesh Kadam"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
                    <input
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">10-Digit Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
                    <input
                      type="tel"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">City of Residence</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
                    <input
                      type="text"
                      value={custCity}
                      onChange={(e) => setCustCity(e.target.value)}
                      placeholder="e.g. Pune / Mumbai"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Special Requests & Preferences */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-[#0878D1] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                4. Package Preference & Special Requests
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Package Tier</label>
                  <select
                    value={accommodationPref}
                    onChange={(e) => setAccommodationPref(e.target.value)}
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  >
                    <option value="Standard Tour Package">Standard Guided Package</option>
                    <option value="Comfort AC Stay & Guide">Comfort AC Stay & Transport</option>
                    <option value="Royal Heritage Experience">Royal Heritage VIP Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Estimated Budget: ~₹{estimatedPrice.toLocaleString()}</label>
                  <p className="text-[11px] text-[#6B7280] pt-2">
                    No advance payment deducted online. Direct payment verification at property / Devasthan Trust office.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Special Requests (Optional)</label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Mention wheelchair assistance, dietary preferences (Jain food), arrival time, or airport pickup..."
                  className="w-full text-xs p-3 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free cancellation up to 24 hours prior to scheduled visit.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Generating Booking...' : 'Confirm Travel Enquiry'}
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
}
