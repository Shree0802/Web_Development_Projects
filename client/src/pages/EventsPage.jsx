import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar, MapPin, Sparkles, ShieldCheck, Check, Clock } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.getEvents();
        if (res.success && Array.isArray(res.data)) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/destination-1.jpg"
            alt="Events and Festivals of Kolhapur"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Festivals & Celebrations</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Events & Festivals in Kolhapur
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              From the grand 10-day Ambabai Navratri Rathotsav to the joyous pink gulal rain of the Jyotiba Yatra and lakeside carnivals on Rankala.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-card flex flex-col lg:flex-row gap-6 lg:items-center justify-between"
              >
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider">
                      {evt.dateDescription}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {evt.verifiedStatus}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#17243A]">
                      {evt.title}
                    </h2>
                    {evt.marathiTitle && (
                      <p className="text-xs text-[#FF7900] font-semibold mt-0.5">
                        {evt.marathiTitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <MapPin className="w-4 h-4 text-[#0878D1]" />
                    <span>{evt.location}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-[#17243A] block mb-1">
                      Festival Highlights:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6B7280]">
                      {evt.highlights?.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E5E7EB]">
                  <div className="bg-[#F5F8FC] p-5 rounded-2xl border border-[#E5E7EB] text-center min-w-[160px]">
                    <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Occurrence</span>
                    <span className="text-lg font-extrabold text-[#0878D1] mt-0.5 block">{evt.month}</span>
                    <span className="text-[11px] text-[#6B7280] block">Annual Calendar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
