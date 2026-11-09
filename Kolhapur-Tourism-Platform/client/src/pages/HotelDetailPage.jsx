import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ShareModal from '../components/ShareModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  Building2, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Check, 
  ChevronRight, 
  CalendarCheck,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function HotelDetailPage() {
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState('');
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    async function loadHotel() {
      setLoading(true);
      try {
        const res = await api.getHotelById(id);
        if (res.success && res.data) {
          setHotel(res.data);
          setActivePhoto(res.data.image);
        }
      } catch (err) {
        console.error('Failed to load hotel:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHotel();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#0878D1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#6B7280]">Loading hotel property details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#17243A] mb-2">Hotel Not Found</h2>
        <p className="text-xs text-[#6B7280] mb-6">The requested hotel property is unavailable.</p>
        <Link to="/hotels" className="bg-[#0878D1] text-white text-xs px-6 py-2.5 rounded-xl font-bold">
          Return to Hotels
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(hotel.id);

  return (
    <div className="bg-white min-h-screen text-[#17243A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <Link to="/" className="hover:text-[#0878D1]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/hotels" className="hover:text-[#0878D1]">Hotels</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#17243A] font-bold truncate">{hotel.name}</span>
        </div>

        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold bg-[#0878D1]/10 text-[#0878D1] px-3 py-0.5 rounded-full uppercase">
                {hotel.type}
              </span>
              <div className="flex text-amber-500 text-xs items-center gap-1">
                {[...Array(hotel.stars || 3)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[#17243A] font-bold ml-1">{hotel.rating || 4.5}</span>
              </div>
              {hotel.verified && (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Property</span>
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17243A]">
              {hotel.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-[#0878D1]" />
              <span>{hotel.location} • {hotel.distanceStation}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => toggleWishlist(hotel)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-[#E5E7EB] text-[#17243A] hover:bg-[#F5F8FC]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => setShareOpen(true)}
              className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#17243A] hover:bg-[#F5F8FC] transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <Link
              to={`/booking?type=hotel&target=${encodeURIComponent(hotel.name)}`}
              className="bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Enquire / Book</span>
            </Link>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 rounded-2xl overflow-hidden aspect-[16/10] bg-gray-100 shadow-card border border-[#E5E7EB]">
            <img
              src={activePhoto}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/hotel-1.jpg'; }}
            />
          </div>
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
            {hotel.gallery?.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhoto(imgUrl)}
                className={`rounded-xl overflow-hidden aspect-[16/10] w-24 lg:w-full shrink-0 border-2 transition-all ${
                  activePhoto === imgUrl ? 'border-[#0878D1]' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${hotel.name} view ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/hotel-1.jpg'; }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Info & Rooms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3">
              <h2 className="text-xl font-extrabold text-[#17243A]">About {hotel.name}</h2>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                {hotel.description}
              </p>
              {hotel.ambiance && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-[#0878D1] uppercase tracking-wider mb-1">
                    Ambiance & Atmosphere
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                    {hotel.ambiance}
                  </p>
                </div>
              )}
            </div>

            {/* Famous For */}
            {hotel.famousFor && (
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3">
                <h2 className="text-xl font-extrabold text-[#17243A]">
                  Property Highlights
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-[#6B7280]">
                  {hotel.famousFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Room Categories */}
            {hotel.rooms && hotel.rooms.length > 0 && (
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-4">
                <h2 className="text-xl font-extrabold text-[#17243A]">
                  Available Room Types
                </h2>
                <div className="space-y-3">
                  {hotel.rooms.map((room, idx) => (
                    <div key={idx} className="p-4 bg-[#F5F8FC] rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-[#17243A]">{room.type}</h3>
                        <p className="text-xs text-[#6B7280] mt-0.5">Capacity: {room.capacity}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{room.description}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-base font-extrabold text-[#0878D1]">₹{room.price.toLocaleString()}</div>
                        <div className="text-[10px] text-[#6B7280]">per night + taxes</div>
                        <Link
                          to={`/booking?type=hotel&target=${encodeURIComponent(hotel.name)}&room=${encodeURIComponent(room.type)}&price=${room.price}`}
                          className="inline-flex items-center gap-1 mt-2 bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm"
                        >
                          <span>Enquire Room</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-4">
              <h2 className="text-xl font-extrabold text-[#17243A]">Amenities & Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities?.map((amenity, idx) => (
                  <div key={idx} className="p-3 bg-[#F5F8FC] rounded-xl border border-[#E5E7EB] flex items-center gap-2 text-xs font-medium text-[#17243A]">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contact, Price & Map */}
          <div className="space-y-6">
            
            {/* Price Range & Booking Action Card */}
            <div className="bg-[#F5F8FC] p-6 rounded-2xl border border-[#E5E7EB] shadow-card space-y-4">
              <div>
                <span className="text-xs text-[#6B7280] font-semibold">Tariff Range:</span>
                <div className="text-2xl font-extrabold text-[#0878D1] mt-0.5">
                  {hotel.priceRange}
                </div>
                <span className="text-[11px] text-[#6B7280]">Verified published seasonal rate brackets</span>
              </div>

              <Link
                to={`/booking?type=hotel&target=${encodeURIComponent(hotel.name)}`}
                className="w-full block text-center bg-[#FF7900] hover:bg-[#E66D00] text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                Request Booking Enquiry
              </Link>

              <div className="pt-3 border-t border-[#E5E7EB] space-y-2.5 text-xs text-[#6B7280]">
                {hotel.contact?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0878D1]" />
                    <span>{hotel.contact.phone}</span>
                  </div>
                )}
                {hotel.contact?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0878D1]" />
                    <span>{hotel.contact.email}</span>
                  </div>
                )}
                {hotel.contact?.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#0878D1] shrink-0 mt-0.5" />
                    <span>{hotel.contact.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location Map */}
            {hotel.coordinates && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3">
                <h3 className="font-bold text-sm text-[#17243A] flex items-center justify-between">
                  <span>Location Map</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${hotel.coordinates.lat},${hotel.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#0878D1] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </h3>

                <div className="h-48 rounded-xl overflow-hidden border border-[#E5E7EB]">
                  <MapContainer
                    center={[hotel.coordinates.lat, hotel.coordinates.lng]}
                    zoom={14}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[hotel.coordinates.lat, hotel.coordinates.lng]} icon={customIcon}>
                      <Popup>
                        <div className="text-xs font-bold text-[#17243A]">{hotel.name}</div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

          </div>

        </div>

        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          title={hotel.name}
          url={window.location.href}
        />

      </div>
    </div>
  );
}
