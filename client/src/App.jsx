import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AIAssistantWidget from './components/AIAssistantWidget';
import { useWishlist } from './context/WishlistContext';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import ToursPage from './pages/ToursPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import TemplesPage from './pages/TemplesPage';
import HistoryPage from './pages/HistoryPage';
import NaturePage from './pages/NaturePage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import FoodCulturePage from './pages/FoodCulturePage';
import EventsPage from './pages/EventsPage';
import InteractiveMapPage from './pages/InteractiveMapPage';
import TravelPlannerPage from './pages/TravelPlannerPage';
import BookingPage from './pages/BookingPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper on route transition
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const { toastMessage } = useWishlist();

  const handleOpenAuth = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17243A] font-sans selection:bg-[#FF7900] selection:text-white">
      <ScrollToTop />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17243A] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#0878D1] text-xs font-semibold animate-fadeIn flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar onOpenAuthModal={handleOpenAuth} />

      {/* Main Content View */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/destinations" element={<ExplorePage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/temples" element={<TemplesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/nature" element={<NaturePage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/food-and-culture" element={<FoodCulturePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/map" element={<InteractiveMapPage />} />
          <Route path="/planner" element={<TravelPlannerPage />} />
          <Route path="/itinerary" element={<TravelPlannerPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/culture" element={<FoodCulturePage />} />
          <Route path="/experiences" element={<FoodCulturePage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* AI Tourism Assistant Widget */}
      <AIAssistantWidget />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authModalTab}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
