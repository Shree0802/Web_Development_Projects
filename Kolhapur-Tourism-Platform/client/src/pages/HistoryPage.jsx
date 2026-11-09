import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { Shield, Landmark, Calendar, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function HistoryPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.getDestinations('category=historical');
        if (res.success && Array.isArray(res.data)) {
          setDestinations(res.data);
        }
      } catch (err) {
        console.error('Failed to load historical places:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const timelineEvents = [
    {
      year: "1178 - 1209 CE",
      title: "Raja Bhoja II constructs Panhala Fort",
      desc: "Shilahara King Bhoja II fortified Panhala with formidable basalt ramparts commanding vital trade passes between Deccan and Konkan."
    },
    {
      year: "1659 CE",
      title: "Chhatrapati Shivaji Maharaj captures Panhala",
      desc: "Following the victory over Afzal Khan, Shivaji Maharaj swiftly captured Panhala, establishing it as a key Maratha military bastion."
    },
    {
      year: "July 1660 CE",
      title: "The Legendary Siege Escape & Pavan Khind",
      desc: "Surrounded by Siddi Jauhar's armies, Shivaji Maharaj executed his daring midnight escape to Vishalgad while Baji Prabhu Deshpande held the pass."
    },
    {
      year: "1884 CE",
      title: "New Palace constructed by Major Charles Mant",
      desc: "Victorian Indo-Saracenic palace built in black polished stone, becoming the royal seat of the Kolhapur Chhatrapatis."
    },
    {
      year: "1894 - 1922 CE",
      title: "Rajarshi Chhatrapati Shahu Maharaj's Golden Age",
      desc: "A visionary ruler pioneered social justice, universal education, artistic patronage, jaggery trade, and founded modern wrestling (Kushti)."
    }
  ];

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/panhala-fort.jpg"
            alt="Historical Kolhapur"
            className="w-full h-full object-cover object-center opacity-30"
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Royal Maratha Heritage</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Historical Places & Forts of Kolhapur
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Walk in the footsteps of Chhatrapati Shivaji Maharaj and Rajarshi Shahu Maharaj. Explore hilltop bastions, royal palatial residences, and historic armories across Kolhapur.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        
        {/* Spotlight: Panhala Fort */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider">Strategic Maratha Bastion</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">Hilltop Citadel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
              Panhala Fort (पन्हाळगड)
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Rising dramatically over the Sahyadri ranges, Panhala is one of the largest fortresses in the Deccan, measuring over 14 kilometers in perimeter. It was the theater of Chhatrapati Shivaji Maharaj's thrilling midnight escape to Vishalgad through Pavan Khind.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-[#F5F8FC] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="font-bold text-[#17243A] block">Key Monuments</span>
                <span className="text-[#6B7280]">Sajja Kothi, Ambarkhana, Teen Darwaza</span>
              </div>
              <div className="bg-[#F5F8FC] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="font-bold text-[#17243A] block">Distance</span>
                <span className="text-[#6B7280]">20 km from Kolhapur (40 mins)</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/destinations/panhala-fort"
                className="bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Explore Panhala Fort Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-md">
            <img
              src="/images/panhala-fort.jpg"
              alt="Panhala Fort Ramparts"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
            />
          </div>
        </div>

        {/* Historical Timeline Section */}
        <div className="bg-[#F5F8FC] rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              CHRONOLOGY OF VALOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
              Historical Timeline of Kolhapur
            </h2>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto relative pl-6 border-l-2 border-[#0878D1]/40 ml-4 sm:ml-auto">
            {timelineEvents.map((ev, i) => (
              <div key={i} className="relative space-y-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#0878D1] border-2 border-white absolute -left-[31px] top-1 shadow-sm" />
                <span className="text-xs font-bold text-[#FF7900] block">{ev.year}</span>
                <h3 className="font-bold text-base text-[#17243A]">{ev.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Destinations Grid */}
        <div className="pt-4">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              HERITAGE SITES
            </span>
            <h2 className="text-2xl font-extrabold text-[#17243A]">
              All Historical Monuments in Kolhapur
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
