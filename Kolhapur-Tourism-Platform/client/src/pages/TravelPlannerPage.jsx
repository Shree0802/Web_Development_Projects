import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ShareModal from '../components/ShareModal';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  Calendar, 
  Clock, 
  MapPin, 
  Printer, 
  Share2, 
  Bookmark, 
  CheckCircle, 
  Sparkles, 
  Coins, 
  ArrowRight,
  RefreshCw,
  Car
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TravelPlannerPage() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  // Generator inputs
  const [durationDays, setDurationDays] = useState(2);
  const [pace, setPace] = useState('balanced');
  const [travelersCount, setTravelersCount] = useState(2);
  const [budgetLevel, setBudgetLevel] = useState('moderate');
  const [startingLocation, setStartingLocation] = useState('Kolhapur Railway Station / CBS');

  const [itineraryResult, setItineraryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const res = await api.generateItinerary({
        durationDays,
        pace,
        travelersCount,
        budgetLevel,
        startingLocation
      });
      if (res.success && res.data) {
        setItineraryResult(res.data);
      }
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePlan();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToDashboard = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('kolhapur_saved_itineraries') || '[]');
      existing.unshift(itineraryResult);
      localStorage.setItem('kolhapur_saved_itineraries', JSON.stringify(existing));
      setSavedSuccess(true);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Header Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden no-print">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/panhala-fort.jpg"
            alt="Travel Planner"
            className="w-full h-full object-cover object-center opacity-30"
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Route & Itinerary Builder</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Personalized Kolhapur Travel Planner
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Generate an authentic, geographically sequenced day-by-day plan with travel timings, temple darshan hours, meal recommendations, and realistic budget calculations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">

        {/* Planner Preference Controls Card */}
        <div className="bg-[#F5F8FC] p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] no-print space-y-6">
          <div className="border-b border-[#E5E7EB] pb-3">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              CUSTOMIZE PREFERENCES
            </span>
            <h2 className="text-xl font-extrabold text-[#17243A]">
              Choose Your Travel Style & Timing
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-[#17243A] mb-1.5">Duration</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full text-xs p-3 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
              >
                <option value={1}>1 Day (Express Heritage)</option>
                <option value={2}>2 Days (Classic Temples & Fort)</option>
                <option value={3}>3 Days (Deep Heritage & River)</option>
                <option value={4}>4 Days (Complete District & Wildlife)</option>
              </select>
            </div>

            {/* Travel Pace */}
            <div>
              <label className="block text-xs font-bold text-[#17243A] mb-1.5">Sightseeing Pace</label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
              >
                <option value="relaxed">Relaxed & Leisurely</option>
                <option value="balanced">Balanced (Recommended)</option>
                <option value="intensive">Intensive Explorer</option>
              </select>
            </div>

            {/* Travelers Count */}
            <div>
              <label className="block text-xs font-bold text-[#17243A] mb-1.5">Travelers</label>
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full text-xs p-3 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
              >
                <option value={1}>Solo Traveler (1)</option>
                <option value={2}>Couple / Duo (2)</option>
                <option value={4}>Family with Kids (4)</option>
                <option value={6}>Group of Friends (6)</option>
              </select>
            </div>

            {/* Budget Level */}
            <div>
              <label className="block text-xs font-bold text-[#17243A] mb-1.5">Budget Preference</label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
              >
                <option value="budget">Budget-Friendly (₹950/day)</option>
                <option value="moderate">Comfort / Moderate (₹1,800/day)</option>
                <option value="luxury">Luxury / Royal (₹4,500/day)</option>
              </select>
            </div>

            {/* Starting Location */}
            <div>
              <label className="block text-xs font-bold text-[#17243A] mb-1.5">Starting Point</label>
              <select
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
              >
                <option value="Kolhapur Railway Station / CBS">Kolhapur Station / CBS</option>
                <option value="Kolhapur Airport (KLH)">Kolhapur Airport (KLH)</option>
                <option value="NH-48 Shiroli Bypass Entry">NH-48 Highway Entry</option>
                <option value="Rankala Lakeside Hotel">Rankala Lakeside Hotel</option>
              </select>
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={generatePlan}
              disabled={loading}
              className="bg-[#0878D1] hover:bg-[#1267B0] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#FF7900]" />}
              <span>Generate Custom Plan</span>
            </button>
          </div>
        </div>

        {/* Generated Itinerary Display */}
        {loading ? (
          <div className="p-16 text-center bg-[#F5F8FC] rounded-3xl border border-[#E5E7EB]">
            <RefreshCw className="w-10 h-10 animate-spin text-[#0878D1] mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-[#6B7280]">Calculating driving distances and optimizing itinerary route...</p>
          </div>
        ) : itineraryResult && (
          <div className="space-y-8">
            
            {/* Plan Summary Bar */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-[11px] font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
                  OPTIMIZED TRAVEL PLAN
                </span>
                <h2 className="text-2xl font-extrabold text-[#17243A]">
                  {itineraryResult.planTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280] mt-2 font-medium">
                  <span>⏱️ {itineraryResult.daysCount} Days</span>
                  <span>•</span>
                  <span>👥 {itineraryResult.travelersCount} Travelers</span>
                  <span>•</span>
                  <span>⚡ {itineraryResult.pace?.toUpperCase()} Pace</span>
                  <span>•</span>
                  <span>📍 From: {itineraryResult.startingLocation}</span>
                </div>
              </div>

              {/* Estimated Budget Card */}
              <div className="bg-[#F5F8FC] p-5 rounded-2xl border border-[#E5E7EB] text-left md:text-right shrink-0">
                <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block">
                  Estimated Total Trip Budget
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0878D1] mt-0.5">
                  ₹{itineraryResult.estimatedTotalBudget?.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#6B7280] block mt-0.5">
                  Includes approx. lodging, food, and local travel
                </span>
              </div>
            </div>

            {/* Action Bar (Print, Save, Share) */}
            <div className="flex flex-wrap items-center justify-between gap-4 no-print">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-white hover:bg-[#F5F8FC] text-[#17243A] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#E5E7EB] shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-[#6B7280]" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  onClick={handleSaveToDashboard}
                  className="bg-white hover:bg-[#F5F8FC] text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-200 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Bookmark className="w-4 h-4 text-emerald-600" />
                  <span>{savedSuccess ? 'Saved to Dashboard!' : 'Save Plan'}</span>
                </button>

                <button
                  onClick={() => setShareOpen(true)}
                  className="bg-white hover:bg-[#F5F8FC] text-[#17243A] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#E5E7EB] shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4 text-[#6B7280]" />
                  <span>Share Plan</span>
                </button>
              </div>

              <Link
                to={`/booking?type=custom_planner&target=${encodeURIComponent(itineraryResult.planTitle)}&price=${itineraryResult.estimatedTotalBudget}`}
                className="bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Book Assisted Tour for this Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Day-by-Day Schedule */}
            <div className="space-y-8">
              {itineraryResult.itinerary?.map((day) => (
                <div
                  key={day.day}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-card space-y-6"
                >
                  {/* Day Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-[#E5E7EB]">
                    <div>
                      <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
                        Day 0{day.day} • {day.theme}
                      </span>
                      <h3 className="text-xl font-extrabold text-[#17243A]">
                        {day.title}
                      </h3>
                    </div>
                    <span className="text-xs bg-[#F5F8FC] text-[#0878D1] font-bold px-3 py-1 rounded-full border border-[#E5E7EB]">
                      Est. Active Time: ~{day.estimatedTimeHours} Hours
                    </span>
                  </div>

                  <p className="text-xs text-[#6B7280] italic">
                    "{day.summary}"
                  </p>

                  {/* Timeline of Activities */}
                  <div className="space-y-6 relative pl-6 border-l-2 border-[#0878D1]/30 ml-2">
                    {day.activities?.map((act, actIdx) => (
                      <div key={actIdx} className="relative group space-y-1.5">
                        {/* Timeline dot */}
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0878D1] border-2 border-white absolute -left-[31px] top-1 shadow-sm" />

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#FF7900]">
                            {act.time}
                          </span>
                          <span className="text-[11px] text-[#6B7280] font-medium">
                            Duration: {act.duration}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-[#17243A]">
                          {act.destinationName}
                        </h4>

                        <p className="text-xs text-[#6B7280] leading-relaxed">
                          {act.highlight}
                        </p>

                        <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-[#6B7280]">
                          {act.distanceFromPrev && (
                            <span className="flex items-center gap-1 font-semibold text-[#17243A]">
                              <Car className="w-3.5 h-3.5 text-[#0878D1]" />
                              <span>{act.distanceFromPrev}</span>
                            </span>
                          )}
                          {act.travelTip && (
                            <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 font-medium">
                              💡 {act.travelTip}
                            </span>
                          )}
                        </div>

                        {act.destinationId && (
                          <div className="pt-1 no-print">
                            <Link
                              to={`/destinations/${act.destinationId}`}
                              className="text-[11px] text-[#0878D1] font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <span>View Destination Guide</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

            {/* Budget Breakdown Summary */}
            {itineraryResult.budgetBreakdown && (
              <div className="bg-[#F5F8FC] p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-card space-y-4">
                <h3 className="font-extrabold text-base text-[#17243A] flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#0878D1]" />
                  <span>Estimated Budget Allocation</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="text-[11px] text-[#6B7280] font-bold">Accommodation (45%)</div>
                    <div className="text-base font-extrabold text-[#17243A] mt-1">₹{itineraryResult.budgetBreakdown.accommodation.toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="text-[11px] text-[#6B7280] font-bold">Food & Dining (25%)</div>
                    <div className="text-base font-extrabold text-[#17243A] mt-1">₹{itineraryResult.budgetBreakdown.foodAndDining.toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="text-[11px] text-[#6B7280] font-bold">Local Transport (20%)</div>
                    <div className="text-base font-extrabold text-[#17243A] mt-1">₹{itineraryResult.budgetBreakdown.localTransport.toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="text-[11px] text-[#6B7280] font-bold">Passes & Shrines (10%)</div>
                    <div className="text-base font-extrabold text-[#17243A] mt-1">₹{itineraryResult.budgetBreakdown.entryPassesAndActivities.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          title={itineraryResult?.planTitle}
          url={window.location.href}
        />

      </div>
    </div>
  );
}
