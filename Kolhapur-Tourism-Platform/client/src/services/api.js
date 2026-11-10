// API Client Service for Kolhapur Tourism Platform

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('kolhapur_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API Error: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (updates) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }),

  // Destinations
  getDestinations: (params = '') => request(`/destinations${params ? '?' + params : ''}`),
  getDestinationById: (id) => request(`/destinations/${id}`),
  createDestination: (data) => request('/destinations', { method: 'POST', body: JSON.stringify(data) }),
  updateDestination: (id, data) => request(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDestination: (id) => request(`/destinations/${id}`, { method: 'DELETE' }),

  // Hotels
  getHotels: (params = '') => request(`/hotels${params ? '?' + params : ''}`),
  getHotelById: (id) => request(`/hotels/${id}`),
  createHotel: (data) => request('/hotels', { method: 'POST', body: JSON.stringify(data) }),
  updateHotel: (id, data) => request(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHotel: (id) => request(`/hotels/${id}`, { method: 'DELETE' }),

  // Bookings
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getMyBookings: () => request('/bookings/my-bookings'),
  trackBooking: (ref) => request(`/bookings/track/${ref}`),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PUT' }),
  getAllBookings: () => request('/bookings'),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Reviews
  getReviews: (params = '') => request(`/reviews${params ? '?' + params : ''}`),
  createReview: (reviewData) => request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),

  // Events
  getEvents: () => request('/events'),
  createEvent: (eventData) => request('/events', { method: 'POST', body: JSON.stringify(eventData) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Contact & Support
  submitContact: (formData) => request('/contact', { method: 'POST', body: JSON.stringify(formData) }),
  getSupportData: () => request('/contact/support'),
  getAllMessages: () => request('/contact'),
  updateMessageStatus: (id, status) => request(`/contact/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Weather
  getWeather: () => request('/weather'),

  // Itinerary & AI Assistant
  generateItinerary: (preferences) => request('/itinerary/generate', { method: 'POST', body: JSON.stringify(preferences) }),
  chatAI: (payload) => request('/itinerary/chat', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getFoodAndCulture: () => request('/admin/food-and-culture'),

  // Tours & Packages
  getTours: (params = '') => request(`/tours${params ? '?' + params : ''}`),
  getTourById: (id) => request(`/tours/${id}`),

  // Gallery
  getGallery: (params = '') => request(`/tours/gallery${params ? '?' + params : ''}`)
};
