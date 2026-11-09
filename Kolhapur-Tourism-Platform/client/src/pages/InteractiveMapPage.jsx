import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Layers, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultPin = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function InteractiveMapPage() {
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // all, temple, historical, nature, hotel
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadMapData() {
      try {
        const [destRes, hotRes] = await Promise.all([
          api.getDestinations(),
          api.getHotels()
        ]);
        if (destRes.success && Array.isArray(destRes.data)) setDestinations(destRes.data);
        if (hotRes.success && Array.isArray(hotRes.data)) setHotels(hotRes.data);
      } catch (err) {
        console.error('Failed to load map data:', err);
      }
    }
    loadMapData();
  }, []);

  // Filter markers
  let markers = [];

  if (selectedCategory === 'all' || selectedCategory === 'temple') {
    destinations.filter(d => d.category === 'temple').forEach(d => {
      if (d.location?.lat) markers.push({ ...d, markerType: 'temple', lat: d.location.lat, lng: d.location.lng });
    });
  }

  if (selectedCategory === 'all' || selectedCategory === 'historical') {
    destinations.filter(d => d.category === 'historical').forEach(d => {
      if (d.location?.lat) markers.push({ ...d, markerType: 'historical', lat: d.location.lat, lng: d.location.lng });
    });
  }

  if (selectedCategory === 'all' || selectedCategory === 'nature') {
    destinations.filter(d => d.category === 'nature').forEach(d => {
      if (d.location?.lat) markers.push({ ...d, markerType: 'nature', lat: d.location.lat, lng: d.location.lng });
    });
  }

  if (selectedCategory === 'all' || selectedCategory === 'hotel') {
    hotels.forEach(h => {
      if (h.coordinates?.lat) markers.push({ ...h, markerType: 'hotel', lat: h.coordinates.lat, lng: h.coordinates.lng, category: 'hotel' });
    });
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    markers = markers.filter(m => m.name.toLowerCase().includes(q));
  }

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F5F8FC] p-6 rounded-3xl border border-[#E5E7EB]">
          <div>
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              GEOGRAPHIC GUIDE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
              Kolhapur Interactive Tourism Map
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Explore exact coordinates, distances, and direct directions across sacred temples, fortresses, lakes, and hotels.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Markers' },
              { id: 'temple', label: 'Temples' },
              { id: 'historical', label: 'Forts' },
              { id: 'nature', label: 'Nature' },
              { id: 'hotel', label: 'Hotels' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setSelectedCategory(btn.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === btn.id
                    ? 'bg-[#0878D1] text-white shadow-sm'
                    : 'bg-white text-[#6B7280] hover:text-[#17243A] border border-[#E5E7EB]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Map Box */}
        <div className="bg-white p-3 rounded-3xl shadow-card border border-[#E5E7EB] overflow-hidden relative">
          <div className="h-[580px] rounded-2xl overflow-hidden relative z-10">
            <MapContainer
              center={[16.7050, 74.2433]} // Kolhapur District Center
              zoom={11}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {markers.map((item, idx) => (
                <Marker key={idx} position={[item.lat, item.lng]} icon={defaultPin}>
                  <Popup>
                    <div className="p-1 max-w-[220px]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
                      />
                      <div className="font-bold text-xs text-[#17243A] mb-0.5">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#6B7280] mb-2 line-clamp-2">
                        {item.shortDescription || item.description}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] text-[11px]">
                        <Link
                          to={item.markerType === 'hotel' ? `/hotels/${item.id}` : `/destinations/${item.id}`}
                          className="text-[#0878D1] font-bold hover:underline"
                        >
                          Details
                        </Link>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF7900] font-bold hover:underline flex items-center gap-0.5"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
