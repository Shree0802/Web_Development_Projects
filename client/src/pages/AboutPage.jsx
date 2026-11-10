import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Landmark, 
  ShieldCheck, 
  Award, 
  Heart, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Sparkles,
  TreePine,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Recorded Heritage', value: '1,000+ Yrs' },
    { label: 'Supreme Shaktipeetha', value: 'Rank 18' },
    { label: 'District Monuments', value: '50+ Sites' },
    { label: 'Annual Visitors', value: '5M+ Pilgrims' }
  ];

  const pillars = [
    {
      title: 'Spiritual Dakshin Kashi',
      desc: 'Revered as the eternal dwelling place of Shri Mahalakshmi (Ambabai). It is said that pilgrimage to Kashi is completed only after seeking blessings at Karveer.',
      icon: <Landmark className="w-6 h-6 text-[#0878D1]" />
    },
    {
      title: 'Maratha Fortresses & Valor',
      desc: 'Home to Panhala, Vishalgad, and legendary battlegrounds immortalized by the valor of Chhatrapati Shivaji Maharaj and Veer Shiva Kashid.',
      icon: <ShieldCheck className="w-6 h-6 text-[#0878D1]" />
    },
    {
      title: 'Rajarshi Shahu Maharaj Vision',
      desc: 'A progressive kingdom that introduced India’s first reservations for backward classes, free primary education, sports patronage, and the Bhogawati dam.',
      icon: <Award className="w-6 h-6 text-[#0878D1]" />
    },
    {
      title: 'Western Ghats Biodiversity',
      desc: 'Bordering UNESCO World Heritage evergreen rainforests, Radhanagari wildlife sanctuary, and crystal mountain reservoirs.',
      icon: <TreePine className="w-6 h-6 text-[#0878D1]" />
    }
  ];

  return (
    <div className="bg-white text-[#17243A]">
      {/* Hero Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-20 sm:py-24 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="About Kolhapur"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Heritage & Legacy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              About Kolhapur Tourism
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Welcome to the official digital portal for Kolhapur—a land where profound spirituality, legendary Maratha history, scenic Western Ghats, and authentic royal hospitality merge.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-[#F5F8FC] border-b border-[#E5E7EB] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0878D1] block mb-1">
                  {s.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#6B7280]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story of Kolhapur */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
                OUR HERITAGE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A]">
                The Royal Capital of Culture & Devotion
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
              Situated on the serene banks of the river Panchganga, Kolhapur (historically known as <strong className="text-[#17243A]">Karveer</strong>) traces its roots across millennia. It was praised in the Puranas and by ancient Roman traders who traded gold and brass coins with the thriving Satavahana dynasty.
            </p>

            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
              In the modern era, Kolhapur shone brightest under the enlightened rule of <strong className="text-[#17243A]">Rajarshi Chhatrapati Shahu Maharaj</strong> (1874–1922). A visionary social reformer, he abolished caste discrimination in schools, established world-class wrestling akhadas (taleems), fostered artists and musicians, and constructed the visionary Radhanagari irrigation dam.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="bg-[#FF7900] hover:bg-[#E66D00] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Explore Top Sites</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/food-and-culture"
                className="bg-[#F5F8FC] hover:bg-gray-200 text-[#17243A] border border-[#E5E7EB] px-6 py-3 rounded-xl font-bold text-sm transition-all"
              >
                <span>Discover Local Food & Crafts</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-elevated border border-[#E5E7EB]">
              <img
                src="/images/panhala-fort.jpg"
                alt="Panhala Fort Ramparts"
                className="w-full h-[420px] object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-[#E5E7EB] hidden sm:block max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#17243A]">Historic Fortresses</h4>
                  <p className="text-xs text-[#6B7280]">Panhala, Vishalgad & Maratha Citadel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-[#F5F8FC] py-16 sm:py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-widest block mb-1">
              WHAT DEFINES US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A]">
              The Four Pillars of Kolhapur
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {pillars.map((p, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0878D1]/10 flex items-center justify-center mb-4">
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#17243A] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="bg-gradient-to-r from-[#17243A] to-[#103B30] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#FF7900] uppercase tracking-widest block">
              OUR MISSION
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Empowering Every Traveler with Accurate, Authentic Kolhapur Guidance
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              This platform was created to provide transparent, verified, and complete travel intelligence for visitors from across India and the globe. We bridge traditional heritage with modern convenience—offering curated itineraries, verified hotel partners, accurate temple darshan guides, and direct emergency traveler assistance.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/planner"
                className="bg-[#FF7900] hover:bg-[#E66D00] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Plan Your Visit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
              >
                <span>Contact Travel Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
