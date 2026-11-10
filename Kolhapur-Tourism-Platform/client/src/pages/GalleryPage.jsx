import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ImageLightbox from '../components/ImageLightbox';
import { Camera, Sparkles, Filter, Eye } from 'lucide-react';

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const res = await api.getGallery();
        if (res.success && Array.isArray(res.data)) {
          setPhotos(res.data);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = [
    'All',
    'Temples & Shrines',
    'Forts & Heritage',
    'Lakes & Nature',
    'Culture & Food'
  ];

  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter((p) => {
        const cat = p.category?.toLowerCase() || '';
        const target = selectedCategory.toLowerCase();
        if (target.includes('temple') && (cat.includes('temple') || cat.includes('spiritual') || cat.includes('shrine'))) return true;
        if (target.includes('fort') && (cat.includes('fort') || cat.includes('heritage') || cat.includes('palace'))) return true;
        if (target.includes('nature') && (cat.includes('lake') || cat.includes('nature') || cat.includes('wildlife') || cat.includes('dam'))) return true;
        if (target.includes('culture') && (cat.includes('food') || cat.includes('culture') || cat.includes('craft') || cat.includes('sport'))) return true;
        return cat.includes(target);
      });

  const openLightbox = (index) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      {/* Hero Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Rankala.jpg"
            alt="Kolhapur Visual Gallery"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <Camera className="w-3.5 h-3.5" />
              <span>Visual Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Kolhapur Photo Gallery
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Experience the visual splendor of Kolhapur—from ancient sacred stones and misty hill forts to picturesque lakeside sunsets and vibrant royal traditions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#E5E7EB]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0878D1] text-white shadow-md'
                  : 'bg-[#F5F8FC] text-[#6B7280] hover:text-[#17243A] hover:bg-gray-200/70 border border-[#E5E7EB]'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#6B7280] font-semibold">
            Showing {filteredPhotos.length} photos
          </span>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="rounded-2xl bg-gray-200 aspect-[4/3]" />
            ))}
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={photo.url || photo.image}
                  alt={photo.title || 'Kolhapur Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/images/hero.jpg';
                  }}
                />

                {/* Gradient and Hover Information */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF7900] block mb-0.5">
                      {photo.category}
                    </span>
                    <h4 className="font-bold text-sm leading-snug">
                      {photo.title}
                    </h4>
                    {photo.caption && (
                      <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F5F8FC] rounded-2xl border border-dashed border-[#E5E7EB]">
            <Camera className="w-12 h-12 text-[#6B7280] mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-[#17243A]">No photos found in this category</h3>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 bg-[#0878D1] text-white px-5 py-2 rounded-xl text-xs font-bold"
            >
              View All Photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredPhotos}
        initialIndex={activePhotoIndex}
      />
    </div>
  );
}
