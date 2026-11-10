import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Sparkles, 
  ArrowRight,
  PhoneCall,
  Mail,
  Compass
} from 'lucide-react';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(0);

  const faqItems = [
    {
      category: 'Temple & Darshan',
      q: 'What are the darshan timings and dress codes at Shri Mahalakshmi Temple?',
      a: 'The temple is open every day from 5:00 AM to 10:30 PM. Kakad Aarti starts at 5:30 AM, Mahapuja at 8:00 AM, and Shej Aarti at 10:00 PM. Modest traditional attire (dhoti/kurta for men, saree/salwar for women) is strongly recommended when entering the main inner sanctum (Gabhara).'
    },
    {
      category: 'Temple & Darshan',
      q: 'When does the celestial Kiranotsav (Sun Ray Festival) take place?',
      a: 'Kiranotsav occurs twice a year: from 31st January to 3rd February, and from 9th November to 12th November. During these dates at sunset, the setting sun’s rays penetrate the temple corridors and sequentially bathe the feet, chest, and face of the deity.'
    },
    {
      category: 'Forts & Sightseeing',
      q: 'How far is Panhala Fort from Kolhapur and how do I travel there?',
      a: 'Panhala Fort is located approximately 20 km northwest of Kolhapur city center. You can easily reach it in 35–45 minutes via the Panhala-Kolhapur highway by state transport bus (from CBS bus stand), private cab, or two-wheeler. Key spots to visit include Sajja Kothi, Ambarkhana, and Teen Darwaza.'
    },
    {
      category: 'Forts & Sightseeing',
      q: 'Can we spot Indian Bisons (Gaur) at Radhanagari Wildlife Sanctuary?',
      a: 'Yes, Radhanagari Wildlife Sanctuary is renowned for its population of the Indian Bison (Gaur), along with leopards, sambars, and rare butterflies. The best sighting time is early morning or late afternoon near the Rautwadi and Laxmi Talav waterholes, especially between October and April.'
    },
    {
      category: 'Best Season & Weather',
      q: 'What is the best season to plan a trip to Kolhapur?',
      a: 'October to March offers ideal, pleasant weather (15°C to 28°C) for temple pilgrimages, fort trekking, and city walking tours. The Monsoon season (July to September) transforms Panhala and the Western Ghats into a lush, misty green wonderland with cascading waterfalls.'
    },
    {
      category: 'Food & Cuisine',
      q: 'What is the difference between Kolhapuri Tambda and Pandhra Rassa?',
      a: 'Tambda Rassa is a fiery, aromatic red mutton broth infused with traditional Kolhapuri Lavangi chillies and special masala. Pandhra Rassa is a soothing, velvety white broth made with coconut milk, poppy seeds, and delicate spices. Both are traditionally served alongside mutton sukkha and bhakri.'
    },
    {
      category: 'Food & Cuisine',
      q: 'Where can I purchase authentic GI-tagged Kolhapuri Chappals?',
      a: 'Authentic handcrafted leather chappals bearing the Geographical Indication (GI) certification are available around Mahadwar Road, Bhausinghji Road, and near the Central Bus Stand. Look for vegetable-tanned, unlacquered buffalo leather sandals stitched with traditional braided leather cords.'
    },
    {
      category: 'Hotels & Transport',
      q: 'How is Kolhapur connected by flight, train, and road?',
      a: 'Kolhapur Airport (Ujlaiwadi - KLH) operates direct flights to Mumbai, Hyderabad, Bangalore, and Tirupati. Chhatrapati Shahu Maharaj Terminus (KOP) has direct daily trains to Mumbai (Mahalaxmi Express), Pune, Delhi, and Bangalore. By road, Kolhapur sits right on National Highway 48 (Pune-Bangalore highway).'
    },
    {
      category: 'Booking & Safety',
      q: 'How do bookings and reservations work on this tourism portal?',
      a: 'You can submit booking enquiries and reservations directly through our Tour Packages or Hotel pages. Each booking generates an instant 8-character Booking Reference Code that you can track anytime under the "Track Booking" section on your dashboard.'
    },
    {
      category: 'Booking & Safety',
      q: 'What are the emergency helpline numbers in Kolhapur for travelers?',
      a: 'In case of assistance: Tourist Police Helpline: 112 / +91 231 2662333; CPR Civil Government Hospital: +91 231 2641151; Central Bus Stand (MSRTC): +91 231 2651477; Railway Enquiries: 139.'
    }
  ];

  const categories = [
    'All',
    'Temple & Darshan',
    'Forts & Sightseeing',
    'Best Season & Weather',
    'Food & Cuisine',
    'Hotels & Transport',
    'Booking & Safety'
  ];

  const filteredFaqs = faqItems.filter((item) => {
    // Category check
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchQ = item.q.toLowerCase().includes(q);
      const matchA = item.a.toLowerCase().includes(q);
      if (!matchQ && !matchA) return false;
    }
    return true;
  });

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      {/* Hero Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/destination-1.jpg"
            alt="Kolhapur FAQs"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Traveler Knowledge Base</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Find answers to commonly asked questions about temple darshan rules, transport, local cuisine, hotel bookings, and fort visits in Kolhapur.
            </p>

            {/* Quick Search */}
            <div className="pt-2 max-w-md relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs (e.g. Darshan, Misal, Panhala)..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/95 rounded-xl text-sm text-[#17243A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0878D1]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-3 border-b border-[#E5E7EB]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#0878D1] text-white shadow-sm'
                  : 'bg-[#F5F8FC] text-[#6B7280] hover:text-[#17243A] border border-[#E5E7EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-card transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-[#F5F8FC]/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0878D1]">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-base sm:text-lg text-[#17243A] leading-snug">
                        {faq.q}
                      </h3>
                    </div>
                    <div className={`p-1.5 rounded-full bg-[#F5F8FC] text-[#0878D1] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-[#0878D1] text-white' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#6B7280] leading-relaxed border-t border-[#F5F8FC]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F5F8FC] rounded-2xl border border-dashed border-[#E5E7EB]">
            <HelpCircle className="w-10 h-10 text-[#6B7280] mx-auto mb-2 opacity-50" />
            <h4 className="font-bold text-[#17243A]">No answers match your search</h4>
            <p className="text-xs text-[#6B7280] mt-1">
              Try searching with another word or browse all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-3 text-xs font-bold text-[#0878D1] hover:underline"
            >
              Reset Search
            </button>
          </div>
        )}

        {/* Still Have Questions Card */}
        <div className="mt-14 bg-[#F5F8FC] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-extrabold text-lg text-[#17243A]">
              Still have questions about your Kolhapur visit?
            </h4>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Our traveler helpdesk is available every day to assist with itinerary planning and inquiries.
            </p>
          </div>

          <Link
            to="/contact"
            className="bg-[#FF7900] hover:bg-[#E66D00] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contact Helpdesk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
