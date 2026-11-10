import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { Landmark, Compass, Calendar, ShieldCheck, Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function TemplesPage() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemples() {
      try {
        const res = await api.getDestinations('category=temple');
        if (res.success && Array.isArray(res.data)) {
          setTemples(res.data);
        }
      } catch (err) {
        console.error('Failed to load temples:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTemples();
  }, []);

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/destination-1.jpg"
            alt="Sacred Temples of Kolhapur"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Landmark className="w-3.5 h-3.5" />
              <span>Spiritual & Sacred Tourism</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Sacred Temples of Kolhapur
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Revered across India as Dakshin Kashi, Kolhapur is blessed with centuries-old basalt stone shrines, the supreme Mahalakshmi Shaktipeeth, the vibrant pink-gulal Jyotiba hill shrine, and the celestial open-sky Kopeshwar temple.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        
        {/* Spotlight 1: Mahalakshmi Temple */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider">7th-Century Chalukyan Marvel</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">Maha Shaktipeeth</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
              Shri Mahalakshmi (Ambabai) Temple
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Constructed in Hemadpanthi style during the Chalukya and Shilahara eras, the temple sanctum features a monolithic black gemstone idol facing west (Pashchim), allowing the biannual 'Kiranotsav' sun-rays to bathe the deity.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-[#F5F8FC] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="font-bold text-[#17243A] block">Aarti Timings</span>
                <span className="text-[#6B7280]">Kakad (5:30 AM), Shej (10:00 PM)</span>
              </div>
              <div className="bg-[#F5F8FC] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="font-bold text-[#17243A] block">Dress Code</span>
                <span className="text-[#6B7280]">Traditional wear for Gabhara</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/destinations/mahalakshmi-temple"
                className="bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Read Complete Temple Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-md">
            <img
              src="/images/destination-1.jpg"
              alt="Mahalakshmi Temple"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
            />
          </div>
        </div>

        {/* Spotlight 2: Jyotiba & Kopeshwar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E7EB] shadow-card space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
                Wadi Ratnagiri Hilltop
              </span>
              <h3 className="text-xl font-extrabold text-[#17243A]">
                Jyotiba (Kedarling) Temple
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-2 leading-relaxed">
                Perched at 3,124 feet, this ancient shrine to Lord Jyotiba is famed across Maharashtra for the Chaitra Purnima Yatra, where lakhs of devotees scatter pink 'Gulal' powder, turning the hill into a sea of magenta.
              </p>
            </div>
            <Link
              to="/destinations/jyotiba-temple"
              className="text-[#0878D1] hover:text-[#1267B0] text-xs font-bold inline-flex items-center gap-1 group"
            >
              <span>Explore Jyotiba Temple Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E7EB] shadow-card space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
                Khidrapur • 12th Century
              </span>
              <h3 className="text-xl font-extrabold text-[#17243A]">
                Kopeshwar Temple
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-2 leading-relaxed">
                Renowned for its breathtaking celestial 'Swarga Mandap' with an open circular sky roof supported by 48 intricately carved stone pillars, Kopeshwar stands as one of India's finest architectural gems.
              </p>
            </div>
            <Link
              to="/destinations/kopeshwar-temple"
              className="text-[#0878D1] hover:text-[#1267B0] text-xs font-bold inline-flex items-center gap-1 group"
            >
              <span>Explore Kopeshwar Temple Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* All Temple Cards Grid */}
        <div className="pt-6">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              SACRED DIRECTORY
            </span>
            <h2 className="text-2xl font-extrabold text-[#17243A]">
              All Sacred Shrines in Kolhapur
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-2xl aspect-[4/5] bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {temples.map((temple) => (
                <DestinationCard key={temple.id} destination={temple} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
