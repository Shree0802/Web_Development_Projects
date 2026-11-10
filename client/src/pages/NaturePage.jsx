import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { TreePine, Droplets, Compass, Wind, ShieldCheck, ArrowRight, SunMedium, Sparkles } from 'lucide-react';

export default function NaturePage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNature() {
      try {
        const res = await api.getDestinations('category=nature');
        if (res.success && Array.isArray(res.data)) {
          setDestinations(res.data);
        }
      } catch (err) {
        console.error('Failed to load nature spots:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNature();
  }, []);

  const ecoGuidelines = [
    {
      title: "Preserve Western Ghats Flora & Fauna",
      desc: "Do not pluck wild orchids or disturb wildlife habitats in Radhanagari and Dajipur sanctuaries. Keep a safe distance from Indian Gaurs."
    },
    {
      title: "Leave No Trace / Zero Plastic",
      desc: "Carry back all plastic water bottles and food wrappers when visiting Kalammawadi Dam, Rankala lakeside, and Gaganbawda ghats."
    },
    {
      title: "Support Local Village Livelihoods",
      desc: "Purchase organic jaggery, local wild forest honey, and farm-fresh sugarcane juice directly from rural farmers and tribal self-help cooperatives."
    },
    {
      title: "Responsible Boating & Water Safety",
      desc: "Follow life-jacket regulations during boating on Rankala lake; avoid venturing into deep reservoir currents at dams during monsoons."
    }
  ];

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Rankala.jpg"
            alt="Nature and Lakes of Kolhapur"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <TreePine className="w-3.5 h-3.5" />
              <span>Nature, Lakes & Ecotourism</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Emerald Sahyadris, Lakes & Wildlife
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Surrounded by the biodiversity of the UNESCO Western Ghats, Kolhapur district is home to Maharashtra's oldest bison sanctuary, magnificent hydro gravity dams, and tranquil sunset promenades.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        
        {/* Spotlight: Rankala Lake */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider">City Oasis & Promenade</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">Boating & Sunsets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
              Rankala Lake & Shalini Palace
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Constructed by the legendary Chhatrapatis, Rankala Lake is the heartbeat of evening social life in Kolhapur. Lined by scenic walking promenades, beautiful garden pavilions, pedal boating, and the majestic stone facade of the Shalini Palace.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-[#F5F8FC] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="font-bold text-[#17243A] block">Best Time to Visit</span>
                <span className="text-[#6B7280]">5:00 PM – 8:00 PM (Sunset & Chaat)</span>
              </div>
              <div className="bg-[#F5F8FC] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="font-bold text-[#17243A] block">Activities</span>
                <span className="text-[#6B7280]">Pedal boats, Bhel-Puri, photography</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/destinations/rankala-lake"
                className="bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Explore Rankala Lake Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-md">
            <img
              src="/images/Rankala.jpg"
              alt="Rankala Lake Sunset"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
            />
          </div>
        </div>

        {/* Eco Guidelines */}
        <div className="bg-[#F5F8FC] rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              RESPONSIBLE TOURISM
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
              Western Ghats Eco Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ecoGuidelines.map((guideline, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card">
                <h3 className="font-bold text-base text-[#17243A] mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{guideline.title}</span>
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {guideline.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nature Spots Grid */}
        <div className="pt-4">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              NATURE DESTINATIONS
            </span>
            <h2 className="text-2xl font-extrabold text-[#17243A]">
              All Nature & Scenic Escapes
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
              {destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
