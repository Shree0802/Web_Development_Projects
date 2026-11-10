import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Utensils, Sparkles, Award, MapPin, CheckCircle, Flame, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FoodCulturePage() {
  const [foodItems, setFoodItems] = useState([]);
  const [cultureItems, setCultureItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFoodAndCulture() {
      try {
        const res = await api.getFoodAndCulture();
        if (res.success) {
          setFoodItems(res.foodItems || []);
          setCultureItems(res.culture || []);
        }
      } catch (err) {
        console.error('Failed to load food and culture data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFoodAndCulture();
  }, []);

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Page Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/kolhapuri-misal.jpg"
            alt="Food and Culture of Kolhapur"
            className="w-full h-full object-cover object-center opacity-30"
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Utensils className="w-3.5 h-3.5" />
              <span>Living Traditions & Royal Cuisine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Kolhapuri Food & Cultural Heritage
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Immerse yourself in the world-famed culinary spices of Kolhapur, handcrafted GI-tagged leather sandals, exquisite 21-element gold Saaj jewelry, and the legendary Kushti wrestling Taleems.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">

        {/* SECTION 1: CULINARY HERITAGE */}
        <section className="space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              ROYAL FLAVORS & FAMOUS BROTHS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
              Authentic Kolhapuri Cuisine
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Kolhapuri cuisine is not just heat; it is an intricate harmony of whole stone-ground spices, roasted desiccated coconut, sesame seeds, and centuries-old culinary wisdom.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {foodItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = '/images/hero.jpg'; }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-[#0878D1] shadow-sm uppercase tracking-wide">
                        {item.type || 'Authentic'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-base text-[#17243A]">
                        {item.name}
                      </h3>
                      {item.marathi && (
                        <p className="text-xs text-[#FF7900] font-semibold">
                          {item.marathi}
                        </p>
                      )}
                      <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {item.famousPlace && (
                      <div className="pt-2 text-[11px] text-[#0878D1] font-bold flex items-center gap-1 border-t border-[#E5E7EB]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>Best at: {item.famousPlace}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: LIVING CRAFTS & TRADITIONS */}
        <section id="culture" className="space-y-8 pt-8 border-t border-[#E5E7EB]">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              GI-TAGGED CRAFTS & HERITAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
              Living Culture & Artisanal Legacy
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              From the thunder of red-soil wrestling arenas to master cobblers crafting vegetable-tanned footwear on Mahadwar Road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cultureItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/hero.jpg'; }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-[#0878D1] shadow-sm uppercase tracking-wide">
                      {item.badge || 'Cultural Jewel'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-[#17243A]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.historicalNote && (
                    <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#E5E7EB] text-[11px] text-[#17243A]">
                      <strong className="text-[#0878D1] block mb-0.5">Heritage Significance:</strong>
                      {item.historicalNote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
