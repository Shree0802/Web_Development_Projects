import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ShareModal from '../components/ShareModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Ticket, 
  Share2, 
  Heart, 
  Star, 
  Compass, 
  ShieldCheck, 
  Plane, 
  Train, 
  Car, 
  ChevronRight, 
  Lightbulb, 
  MessageSquarePlus, 
  ExternalLink,
  Building2,
  ArrowRight
} from 'lucide-react';

// Custom Map Marker Pin
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function DestinationDetailPage() {
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState('');
  const [shareOpen, setShareOpen] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTravelerType, setReviewTravelerType] = useState('Family');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    async function loadDestination() {
      setLoading(true);
      try {
        const res = await api.getDestinationById(id);
        if (res.success && res.data) {
          setDestination(res.data);
          setActivePhoto(res.data.image);
        }
      } catch (err) {
        console.error('Failed to load destination details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await api.createReview({
        targetType: 'destination',
        targetId: id,
        rating: reviewRating,
        title: reviewTitle || 'Memorable Visit',
        comment: reviewComment,
        travelerType: reviewTravelerType,
        userName: user ? user.name : 'Verified Visitor'
      });

      if (res.success) {
        setReviewSuccess('Your review has been submitted and recorded!');
        setReviewTitle('');
        setReviewComment('');
        // Reload destination to see review
        const updated = await api.getDestinationById(id);
        if (updated.success) setDestination(updated.data);
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#0878D1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#6B7280]">Loading destination guide...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#17243A] mb-3">Destination Not Found</h2>
        <p className="text-xs text-[#6B7280] mb-6">The requested landmark could not be retrieved from the database.</p>
        <Link to="/explore" className="bg-[#0878D1] text-white text-xs px-6 py-2.5 rounded-xl font-bold">
          Return to Destinations
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(destination.id);

  return (
    <div className="bg-white min-h-screen text-[#17243A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <Link to="/" className="hover:text-[#0878D1]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/explore" className="hover:text-[#0878D1]">Destinations</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#17243A] font-bold truncate">{destination.name}</span>
        </div>

        {/* Main Title & Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold bg-[#0878D1]/10 text-[#0878D1] px-3 py-0.5 rounded-full uppercase">
                {destination.category}
              </span>
              <span className="text-xs text-[#6B7280] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0878D1]" />
                <span>{destination.distanceKm ? `${destination.distanceKm} km from Kolhapur city` : 'Kolhapur District'}</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17243A]">
              {destination.name}
            </h1>
            {destination.marathiName && (
              <p className="text-sm font-semibold text-[#FF7900] mt-0.5">
                {destination.marathiName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => toggleWishlist(destination)}
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
              to={`/booking?type=destination_tour&target=${encodeURIComponent(destination.name)}`}
              className="bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Guided Visit</span>
            </Link>
          </div>
        </div>

        {/* Hero Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Display Image */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden aspect-[16/10] bg-gray-100 shadow-card border border-[#E5E7EB]">
            <img
              src={activePhoto}
              alt={destination.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
            />
          </div>

          {/* Thumbnail Selector */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
            {destination.gallery?.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhoto(imgUrl)}
                className={`rounded-xl overflow-hidden aspect-[16/10] w-24 lg:w-full shrink-0 border-2 transition-all ${
                  activePhoto === imgUrl ? 'border-[#0878D1]' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${destination.name} view ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-new-palace.jpg'; }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Narrative Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3">
              <h2 className="text-xl font-extrabold text-[#17243A] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#0878D1]" />
                <span>Overview</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                {destination.overview || destination.shortDescription}
              </p>
            </div>

            {/* Historical Significance */}
            {destination.history && (
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3">
                <h2 className="text-xl font-extrabold text-[#17243A] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0878D1]" />
                  <span>Historical Background</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
                  {destination.history}
                </p>
              </div>
            )}

            {/* Architecture & Structure */}
            {destination.architecture && (
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3">
                <h2 className="text-xl font-extrabold text-[#17243A] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#FF7900]" />
                  <span>Architectural Heritage</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
                  {destination.architecture}
                </p>
              </div>
            )}

            {/* How to Reach */}
            {destination.howToReach && (
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-4">
                <h2 className="text-xl font-extrabold text-[#17243A]">
                  How to Reach
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#17243A] mb-1">
                      <Plane className="w-4 h-4 text-[#0878D1]" />
                      <span>By Air</span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {destination.howToReach.air}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#17243A] mb-1">
                      <Train className="w-4 h-4 text-[#0878D1]" />
                      <span>By Train</span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {destination.howToReach.rail}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#F5F8FC] rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#17243A] mb-1">
                      <Car className="w-4 h-4 text-[#0878D1]" />
                      <span>By Road</span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {destination.howToReach.road}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Travel Tips & Etiquette */}
            {destination.travelTips && destination.travelTips.length > 0 && (
              <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 space-y-3">
                <h2 className="text-base font-bold text-[#17243A] flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span>Visitor Tips & Etiquette</span>
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  {destination.travelTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900] mt-2 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Visitor Reviews Section */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#17243A]">
                    Visitor Reviews & Ratings
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-amber-500 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#17243A]">{destination.rating || 4.8} / 5</span>
                    <span className="text-xs text-[#6B7280]">({destination.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-3">
                {destination.reviews && destination.reviews.length > 0 ? (
                  destination.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#F5F8FC] rounded-xl border border-[#E5E7EB] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#0878D1] text-white flex items-center justify-center text-xs font-bold">
                            {rev.userName ? rev.userName[0] : 'U'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#17243A]">{rev.userName}</div>
                            <div className="text-[10px] text-[#6B7280]">{rev.travelerType} Traveler • {rev.visitDate}</div>
                          </div>
                        </div>
                        <div className="flex text-amber-500 text-xs">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#6B7280] italic">No reviews submitted yet. Be the first to review!</p>
                )}
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-[#E5E7EB] space-y-3">
                <h3 className="text-xs font-bold text-[#17243A] uppercase tracking-wider">
                  Write a Review for {destination.name}
                </h3>

                {reviewSuccess && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                    {reviewSuccess}
                  </div>
                )}
                {reviewError && (
                  <div className="p-2.5 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
                    {reviewError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] mb-1">Your Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1]"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Average)</option>
                      <option value={2}>⭐⭐ (2 - Below Average)</option>
                      <option value={1}>⭐ (1 - Disappointing)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B7280] mb-1">Traveler Type</label>
                    <select
                      value={reviewTravelerType}
                      onChange={(e) => setReviewTravelerType(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1]"
                    >
                      <option value="Family">Family</option>
                      <option value="Couple">Couple</option>
                      <option value="Solo">Solo Traveler</option>
                      <option value="Friends">Friends Group</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B7280] mb-1">Review Experience</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share details on crowd timing, photography spots, or darshan queues..."
                    className="w-full text-xs p-2.5 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#0878D1] hover:bg-[#1267B0] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Public Review'}
                </button>
              </form>

            </div>

          </div>

          {/* Right Column: Key Details & Map */}
          <div className="space-y-6">
            
            {/* Key Quick Facts Card */}
            <div className="bg-[#F5F8FC] p-6 rounded-2xl border border-[#E5E7EB] shadow-card space-y-4">
              <h3 className="font-extrabold text-base text-[#17243A] border-b border-[#E5E7EB] pb-2">
                Essential Visiting Facts
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-[#6B7280] mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#0878D1]" />
                    <span className="font-bold text-[#17243A]">Opening Hours:</span>
                  </div>
                  <div className="text-[#17243A] font-medium ml-5">
                    {destination.openingHours || 'Sunrise to Sunset'}
                  </div>
                  {destination.isOpeningHoursVerified && (
                    <span className="ml-5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      Verified Schedule
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[#6B7280] mb-0.5">
                    <Ticket className="w-3.5 h-3.5 text-[#0878D1]" />
                    <span className="font-bold text-[#17243A]">Entry Fees:</span>
                  </div>
                  <div className="text-[#17243A] font-medium ml-5">
                    {destination.entryFee || 'Free General Entry'}
                  </div>
                  {destination.isEntryFeeVerified && (
                    <span className="ml-5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      Verified Ticket Rate
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[#6B7280] mb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0878D1]" />
                    <span className="font-bold text-[#17243A]">Best Time to Visit:</span>
                  </div>
                  <div className="text-[#17243A] font-medium ml-5">
                    {destination.bestTimeToVisit || 'October to March'}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[#6B7280] mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#0878D1]" />
                    <span className="font-bold text-[#17243A]">Suggested Duration:</span>
                  </div>
                  <div className="text-[#17243A] font-medium ml-5">
                    {destination.suggestedDuration || '2 - 3 Hours'}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/booking?type=destination_tour&target=${encodeURIComponent(destination.name)}`}
                  className="w-full block text-center bg-[#FF7900] hover:bg-[#E66D00] text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md transition-transform active:scale-95"
                >
                  Book Guided Experience
                </Link>
              </div>
            </div>

            {/* Interactive Location Map (Leaflet & OpenStreetMap) */}
            {destination.location && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#17243A] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#0878D1]" />
                    <span>Geographic Location</span>
                  </h3>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${destination.location.lat},${destination.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#0878D1] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="h-48 rounded-xl overflow-hidden border border-[#E5E7EB]">
                  <MapContainer
                    center={[destination.location.lat, destination.location.lng]}
                    zoom={14}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[destination.location.lat, destination.location.lng]} icon={customIcon}>
                      <Popup>
                        <div className="text-xs font-bold text-[#17243A]">
                          {destination.name}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                <p className="text-[11px] text-[#6B7280] leading-relaxed">
                  {destination.location.address}
                </p>
              </div>
            )}

            {/* Nearby Attractions */}
            {destination.nearbyAttractions && destination.nearbyAttractions.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-card space-y-2">
                <h3 className="font-bold text-sm text-[#17243A]">
                  Nearby Attractions
                </h3>
                <ul className="space-y-1.5 text-xs text-[#6B7280]">
                  {destination.nearbyAttractions.map((attraction, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0878D1]" />
                      <span>{attraction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          title={destination.name}
          url={window.location.href}
        />

      </div>
    </div>
  );
}
