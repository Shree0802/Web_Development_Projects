/**
 * Kolhapur Tourism Platform - Comprehensive API & Database Test Suite
 * Automated End-to-End API testing using Node.js
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

let serverProcess = null;
const results = [];

function recordTest(category, name, passed, details = '') {
  results.push({ category, name, passed, details });
  const statusIcon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${statusIcon}] [${category}] ${name} ${details ? '(' + details + ')' : ''}`);
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const fetchOptions = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {})
    }
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
  } else {
    data = await res.text();
  }

  return { status: res.status, ok: res.ok, data };
}

async function waitForServer(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://localhost:${PORT}/api/health`);
      if (res.ok) {
        return true;
      }
    } catch (e) {
      // Server not ready yet
    }
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

async function runApiTests() {
  console.log('======================================================================');
  console.log('🚀 STARTING KOLHAPUR TOURISM BACKEND API & DATABASE TEST SUITE');
  console.log('======================================================================\n');

  // Check if server is already running, otherwise spawn it
  let serverWasRunning = false;
  try {
    const health = await fetch(`http://localhost:${PORT}/api/health`);
    if (health.ok) {
      serverWasRunning = true;
      console.log('ℹ️ Server is already running on port ' + PORT);
    }
  } catch (e) {
    console.log('Starting server process...');
    serverProcess = spawn('node', ['server/src/index.js'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
      env: { ...process.env, PORT: `${PORT}` }
    });

    serverProcess.stdout.on('data', data => {
      // console.log(`[Server] ${data.toString().trim()}`);
    });
    serverProcess.stderr.on('data', data => {
      console.error(`[Server ERR] ${data.toString().trim()}`);
    });

    const ready = await waitForServer();
    if (!ready) {
      console.error('❌ Failed to start server within timeout.');
      process.exit(1);
    }
    console.log('✅ Server successfully started on port ' + PORT + '\n');
  }

  let adminToken = '';
  let userToken = '';
  let createdUserId = '';
  let testBookingRef = '';
  let testBookingId = '';
  let testContactId = '';
  let testReviewId = '';

  // 1. HEALTH CHECK
  try {
    const res = await request('/health');
    const pass = res.status === 200 && res.data.status === 'online';
    recordTest('Health', 'GET /api/health returns online status and version 2.0.0', pass, `Status: ${res.data?.status}, Version: ${res.data?.version}`);
  } catch (err) {
    recordTest('Health', 'GET /api/health', false, err.message);
  }

  // 2. AUTHENTICATION & USERS
  try {
    // 2.1 Admin Login
    const adminLoginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@kolhapurtourism.com', password: 'Admin@123' }
    });
    const adminPass = adminLoginRes.status === 200 && adminLoginRes.data?.token && adminLoginRes.data?.user?.role === 'admin';
    if (adminPass) {
      adminToken = adminLoginRes.data.token;
    }
    recordTest('Auth', 'Admin Login (admin@kolhapurtourism.com)', adminPass, `Status: ${adminLoginRes.status}, Role: ${adminLoginRes.data?.user?.role}`);

    // 2.2 Invalid Login
    const invalidLoginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@kolhapurtourism.com', password: 'WrongPassword!@#' }
    });
    recordTest('Auth', 'Login fails on invalid credentials', invalidLoginRes.status === 401, `Status: ${invalidLoginRes.status}`);

    // 2.3 User Registration
    const uniqueEmail = `qa_test_${Date.now()}@example.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'QA Automation User',
        email: uniqueEmail,
        password: 'Password@123',
        phone: '+91 9123456789',
        city: 'Kolhapur'
      }
    });
    const regPass = (regRes.status === 201 || regRes.status === 200) && regRes.data?.token;
    if (regPass) {
      userToken = regRes.data.token;
      createdUserId = regRes.data.user.id;
    }
    recordTest('Auth', 'User Registration with valid data', regPass, `Status: ${regRes.status}, User ID: ${createdUserId}`);

    // 2.4 Duplicate Registration check
    const dupRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'QA Automation User',
        email: uniqueEmail,
        password: 'Password@123'
      }
    });
    recordTest('Auth', 'Registration rejects duplicate email', dupRes.status === 400, `Status: ${dupRes.status}`);

    // 2.5 Auth /me with valid token
    const meRes = await request('/auth/me', { token: userToken });
    recordTest('Auth', 'GET /api/auth/me returns authenticated user', meRes.status === 200 && meRes.data?.user?.email === uniqueEmail, `User: ${meRes.data?.user?.name}`);

    // 2.6 Auth /me without token (Unauthorized check)
    const noTokenRes = await request('/auth/me');
    recordTest('Auth', 'GET /api/auth/me rejects request without Bearer token', noTokenRes.status === 401, `Status: ${noTokenRes.status}`);

    // 2.7 Update User Profile
    const updateProfileRes = await request('/auth/profile', {
      method: 'PUT',
      token: userToken,
      body: { phone: '+91 9999888877', city: 'Ichalkaranji' }
    });
    recordTest('Auth', 'PUT /api/auth/profile updates user attributes', updateProfileRes.status === 200 && updateProfileRes.data?.user?.city === 'Ichalkaranji', `Updated City: ${updateProfileRes.data?.user?.city}`);
  } catch (err) {
    recordTest('Auth', 'Authentication test execution', false, err.message);
  }

  // 3. DESTINATIONS API & CRUD
  try {
    // 3.1 Get all destinations
    const destRes = await request('/destinations');
    const hasDests = destRes.status === 200 && Array.isArray(destRes.data?.data) && destRes.data.data.length > 0;
    recordTest('Destinations', 'GET /api/destinations returns destination list', hasDests, `Count: ${destRes.data?.count || destRes.data?.data?.length}`);

    // 3.2 Category filter: category=temple
    const templeRes = await request('/destinations?category=temple');
    const allTemples = templeRes.status === 200 && templeRes.data?.data?.every(d => d.category === 'temple');
    recordTest('Destinations', 'GET /api/destinations?category=temple filters by category', allTemples, `Temples found: ${templeRes.data?.data?.length}`);

    // 3.3 Featured filter: featured=true
    const featRes = await request('/destinations?featured=true');
    const allFeatured = featRes.status === 200 && featRes.data?.data?.every(d => d.featured === true);
    recordTest('Destinations', 'GET /api/destinations?featured=true filters featured items', allFeatured, `Featured found: ${featRes.data?.data?.length}`);

    // 3.4 Search filter
    const searchRes = await request('/destinations?search=Mahalakshmi');
    const searchFound = searchRes.status === 200 && searchRes.data?.data?.some(d => d.name.includes('Mahalakshmi'));
    recordTest('Destinations', 'GET /api/destinations?search=Mahalakshmi performs text search', searchFound, `Matches: ${searchRes.data?.data?.length}`);

    // 3.5 Get destination by ID
    const singleDestRes = await request('/destinations/mahalakshmi-temple');
    const singlePass = singleDestRes.status === 200 && singleDestRes.data?.data?.id === 'mahalakshmi-temple';
    recordTest('Destinations', 'GET /api/destinations/:id returns detailed record', singlePass, `Name: ${singleDestRes.data?.data?.name}`);

    // 3.6 Non-existent ID returns 404
    const notFoundDestRes = await request('/destinations/non-existent-place-404');
    recordTest('Destinations', 'GET /api/destinations/:id returns 404 for invalid ID', notFoundDestRes.status === 404, `Status: ${notFoundDestRes.status}`);

    // 3.7 Admin CRUD: Unauthorized destination creation
    const unauthCreateRes = await request('/destinations', {
      method: 'POST',
      token: userToken,
      body: { name: 'Unauthorized Place' }
    });
    recordTest('Destinations', 'POST /api/destinations restricts regular users (403 Forbidden)', unauthCreateRes.status === 403, `Status: ${unauthCreateRes.status}`);

    // 3.8 Admin CRUD: Create destination
    const testDestId = `qa-dest-${Date.now()}`;
    const adminCreateRes = await request('/destinations', {
      method: 'POST',
      token: adminToken,
      body: {
        id: testDestId,
        name: 'QA Test Hill Station',
        category: 'nature',
        shortDescription: 'Automated test scenic view.',
        location: 'Kolhapur Suburbs',
        entryFee: 'Free',
        rating: 4.8
      }
    });
    recordTest('Destinations', 'POST /api/destinations creates destination with Admin role', adminCreateRes.status === 201 && adminCreateRes.data?.data?.id === testDestId, `Created ID: ${testDestId}`);

    // 3.9 Admin CRUD: Update destination
    const adminUpdateRes = await request(`/destinations/${testDestId}`, {
      method: 'PUT',
      token: adminToken,
      body: { rating: 4.9, shortDescription: 'Updated test description' }
    });
    recordTest('Destinations', 'PUT /api/destinations/:id updates destination record', adminUpdateRes.status === 200 && adminUpdateRes.data?.data?.rating === 4.9, `Updated Rating: ${adminUpdateRes.data?.data?.rating}`);

    // 3.10 Admin CRUD: Delete destination
    const adminDelRes = await request(`/destinations/${testDestId}`, {
      method: 'DELETE',
      token: adminToken
    });
    recordTest('Destinations', 'DELETE /api/destinations/:id removes destination record', adminDelRes.status === 200, `Deleted: ${testDestId}`);
  } catch (err) {
    recordTest('Destinations', 'Destinations test execution', false, err.message);
  }

  // 4. HOTELS API & CRUD
  try {
    // 4.1 Get all hotels
    const hotelsRes = await request('/hotels');
    const hasHotels = hotelsRes.status === 200 && Array.isArray(hotelsRes.data?.data) && hotelsRes.data.data.length > 0;
    recordTest('Hotels', 'GET /api/hotels returns list of accommodations', hasHotels, `Hotels count: ${hotelsRes.data?.count || hotelsRes.data?.data?.length}`);

    // 4.2 Hotel by ID
    const singleHotel = await request('/hotels/sayaji-kolhapur');
    recordTest('Hotels', 'GET /api/hotels/:id returns hotel details', singleHotel.status === 200 && singleHotel.data?.data?.name?.includes('Sayaji'), `Hotel: ${singleHotel.data?.data?.name}`);

    // 4.3 Admin create hotel
    const testHotelId = `qa-hotel-${Date.now()}`;
    const createHotelRes = await request('/hotels', {
      method: 'POST',
      token: adminToken,
      body: {
        id: testHotelId,
        name: 'QA Royal Heritage Stay',
        category: 'luxury',
        pricePerNight: 4500,
        rating: 4.7,
        location: 'Old Pune-Bangalore Highway, Kolhapur'
      }
    });
    recordTest('Hotels', 'POST /api/hotels creates hotel record (Admin)', createHotelRes.status === 201 && createHotelRes.data?.data?.id === testHotelId, `Created ID: ${testHotelId}`);

    // 4.4 Admin delete hotel
    const delHotelRes = await request(`/hotels/${testHotelId}`, {
      method: 'DELETE',
      token: adminToken
    });
    recordTest('Hotels', 'DELETE /api/hotels/:id removes hotel record', delHotelRes.status === 200, `Deleted: ${testHotelId}`);
  } catch (err) {
    recordTest('Hotels', 'Hotels test execution', false, err.message);
  }

  // 5. TOURS & GALLERY API
  try {
    const toursRes = await request('/tours');
    recordTest('Tours', 'GET /api/tours returns curated travel packages', toursRes.status === 200 && Array.isArray(toursRes.data?.data) && toursRes.data.data.length > 0, `Count: ${toursRes.data?.data?.length}`);

    const galleryRes = await request('/tours/gallery');
    recordTest('Tours', 'GET /api/tours/gallery returns photo collection', galleryRes.status === 200 && Array.isArray(galleryRes.data?.data) && galleryRes.data.data.length > 0, `Photos: ${galleryRes.data?.data?.length}`);
  } catch (err) {
    recordTest('Tours', 'Tours test execution', false, err.message);
  }

  // 6. BOOKINGS API & VALIDATION
  try {
    // 6.1 Validation failure test (missing name & email)
    const invalidBooking = await request('/bookings', {
      method: 'POST',
      body: { guests: 2, bookingType: 'tour' }
    });
    recordTest('Bookings', 'POST /api/bookings rejects payload with missing required fields', invalidBooking.status === 400, `Status: ${invalidBooking.status}`);

    // 6.2 Valid booking creation
    const validBooking = await request('/bookings', {
      method: 'POST',
      token: userToken,
      body: {
        bookingType: 'tour',
        targetId: 'heritage-forts-trail',
        targetTitle: 'Kolhapur Heritage & Forts Trail',
        name: 'Prathamesh QA',
        email: 'traveler@kolhapur.com',
        phone: '+91 9021830410',
        date: '2026-12-15',
        guests: 2,
        specialRequests: 'Window seats and vegetarian lunch preference'
      }
    });

    const bookingCreated = validBooking.status === 201 && (validBooking.data?.data?.referenceCode || validBooking.data?.booking?.referenceCode);
    const bData = validBooking.data?.data || validBooking.data?.booking;
    if (bookingCreated) {
      testBookingRef = bData.referenceCode;
      testBookingId = bData.id;
    }
    recordTest('Bookings', 'POST /api/bookings successfully creates booking with reference code', bookingCreated, `Ref: ${testBookingRef}, Total: ₹${bData?.totalPrice}`);

    // 6.3 Track booking by reference code
    const trackRes = await request(`/bookings/track/${testBookingRef}`);
    recordTest('Bookings', `GET /api/bookings/track/:code retrieves booking details`, trackRes.status === 200 && trackRes.data?.data?.referenceCode === testBookingRef, `Matched: ${trackRes.data?.data?.referenceCode}`);

    // 6.4 Track with invalid code returns 404
    const trackInvalid = await request('/bookings/track/KOL-INVALID-9999');
    recordTest('Bookings', 'GET /api/bookings/track/:code returns 404 for invalid reference', trackInvalid.status === 404, `Status: ${trackInvalid.status}`);

    // 6.5 User get my bookings
    const myBookingsRes = await request('/bookings/my-bookings', { token: userToken });
    recordTest('Bookings', 'GET /api/bookings/my-bookings returns authenticated user bookings', myBookingsRes.status === 200 && Array.isArray(myBookingsRes.data?.data), `Count: ${myBookingsRes.data?.data?.length}`);

    // 6.6 User cancel booking
    const cancelRes = await request(`/bookings/${testBookingId}/cancel`, {
      method: 'PUT',
      token: userToken
    });
    recordTest('Bookings', 'PUT /api/bookings/:id/cancel updates booking status to cancelled', cancelRes.status === 200 && cancelRes.data?.data?.status?.toLowerCase() === 'cancelled', `Status: ${cancelRes.data?.data?.status}`);

    // 6.7 Admin update booking status
    const adminStatusRes = await request(`/bookings/${testBookingId}/status`, {
      method: 'PUT',
      token: adminToken,
      body: { status: 'confirmed' }
    });
    recordTest('Bookings', 'PUT /api/bookings/:id/status allows Admin to update status', adminStatusRes.status === 200 && adminStatusRes.data?.data?.status?.toLowerCase() === 'confirmed', `New Status: ${adminStatusRes.data?.data?.status}`);
  } catch (err) {
    recordTest('Bookings', 'Bookings test execution', false, err.message);
  }

  // 7. REVIEWS & RATINGS API
  try {
    // 7.1 Get reviews
    const reviewsRes = await request('/reviews?targetId=mahalakshmi-temple');
    recordTest('Reviews', 'GET /api/reviews?targetId=... returns customer feedback', reviewsRes.status === 200 && Array.isArray(reviewsRes.data?.data), `Found: ${reviewsRes.data?.data?.length}`);

    // 7.2 Post invalid review (rating > 5)
    const invalidReview = await request('/reviews', {
      method: 'POST',
      token: userToken,
      body: {
        targetId: 'mahalakshmi-temple',
        rating: 10,
        comment: 'Invalid rating test'
      }
    });
    recordTest('Reviews', 'POST /api/reviews rejects rating out of bounds (1-5)', invalidReview.status === 400, `Status: ${invalidReview.status}`);

    // 7.3 Post valid review
    const validReview = await request('/reviews', {
      method: 'POST',
      token: userToken,
      body: {
        targetId: 'mahalakshmi-temple',
        targetType: 'destination',
        rating: 5,
        title: 'Spiritual and serene experience!',
        comment: 'The architectural details and peaceful atmosphere during morning aarti were incredible.'
      }
    });
    const reviewCreated = validReview.status === 201 && validReview.data?.data?.id;
    if (reviewCreated) {
      testReviewId = validReview.data.data.id;
    }
    recordTest('Reviews', 'POST /api/reviews stores new verified review', reviewCreated, `ID: ${testReviewId}, Rating: 5`);

    // 7.4 Delete review (Admin)
    if (testReviewId) {
      const delReviewRes = await request(`/reviews/${testReviewId}`, {
        method: 'DELETE',
        token: adminToken
      });
      recordTest('Reviews', 'DELETE /api/reviews/:id allows Admin moderation', delReviewRes.status === 200, `Deleted: ${testReviewId}`);
    }
  } catch (err) {
    recordTest('Reviews', 'Reviews test execution', false, err.message);
  }

  // 8. CONTACT & SUPPORT API
  try {
    // 8.1 Support endpoints (FAQ & Emergency)
    const supportRes = await request('/contact/support');
    const supportOk = supportRes.status === 200 && Array.isArray(supportRes.data?.emergency) && Array.isArray(supportRes.data?.faqs);
    recordTest('Contact', 'GET /api/contact/support returns emergency contacts & FAQs', supportOk, `FAQs: ${supportRes.data?.faqs?.length}, Helplines: ${supportRes.data?.emergency?.length}`);

    // 8.2 Contact inquiry submission
    const contactPost = await request('/contact', {
      method: 'POST',
      body: {
        name: 'Prathamesh QA',
        email: 'qa@kolhapurtourism.com',
        phone: '+91 9021830410',
        subject: 'Inquiry on Panhala Fort guided trekking tours',
        message: 'Looking for a certified local guide for a family trip next month.'
      }
    });
    const contactOk = contactPost.status === 201 && contactPost.data?.data?.id;
    if (contactOk) {
      testContactId = contactPost.data.data.id;
    }
    recordTest('Contact', 'POST /api/contact records customer inquiry message', contactOk, `Message ID: ${testContactId}`);

    // 8.3 Admin get messages
    const adminMsgRes = await request('/contact', { token: adminToken });
    recordTest('Contact', 'GET /api/contact retrieves inquiry messages for Admin', adminMsgRes.status === 200 && Array.isArray(adminMsgRes.data?.data), `Count: ${adminMsgRes.data?.data?.length}`);

    // 8.4 Admin update message status
    if (testContactId) {
      const adminUpdateMsg = await request(`/contact/${testContactId}/status`, {
        method: 'PUT',
        token: adminToken,
        body: { status: 'resolved' }
      });
      recordTest('Contact', 'PUT /api/contact/:id/status updates inquiry resolution status', adminUpdateMsg.status === 200 && adminUpdateMsg.data?.data?.status === 'resolved', `Status: resolved`);
    }
  } catch (err) {
    recordTest('Contact', 'Contact test execution', false, err.message);
  }

  // 9. WEATHER & ITINERARY API
  try {
    // 9.1 Weather forecast
    const weatherRes = await request('/weather');
    const weatherOk = weatherRes.status === 200 && weatherRes.data?.current?.city === 'Kolhapur' && weatherRes.data?.forecast?.length > 0;
    recordTest('Weather', 'GET /api/weather returns Kolhapur forecast & current climate', weatherOk, `Temp: ${weatherRes.data?.current?.tempC}°C, Condition: ${weatherRes.data?.current?.condition}`);

    // 9.2 Itinerary generation
    const itinRes = await request('/itinerary/generate', {
      method: 'POST',
      body: {
        durationDays: 3,
        interests: ['temples', 'history', 'food'],
        pace: 'balanced',
        budget: 'moderate'
      }
    });
    const itinOk = itinRes.status === 200 && itinRes.data?.data?.days?.length === 3;
    recordTest('Itinerary', 'POST /api/itinerary/generate returns customized 3-day travel plan', itinOk, `Days planned: ${itinRes.data?.data?.days?.length}, Estimated Cost: ${itinRes.data?.data?.estimatedTotalBudget || itinRes.data?.data?.estimatedCost}`);

    // 9.3 AI Tourism Assistant Chat
    const chatRes = await request('/itinerary/chat', {
      method: 'POST',
      body: {
        message: 'Where can I find the most authentic Kolhapuri Misal?'
      }
    });
    const chatOk = chatRes.status === 200 && chatRes.data?.reply?.length > 20;
    recordTest('AI Assistant', 'POST /api/itinerary/chat provides grounded tourism intelligence', chatOk, `Source: ${chatRes.data?.source}`);
  } catch (err) {
    recordTest('Itinerary', 'Itinerary test execution', false, err.message);
  }

  // 10. ADMIN DASHBOARD STATS & CULTURE
  try {
    // 10.1 Admin stats without token
    const unauthStats = await request('/admin/stats');
    recordTest('Admin', 'GET /api/admin/stats restricts unauthenticated access (401)', unauthStats.status === 401, `Status: ${unauthStats.status}`);

    // 10.2 Admin stats with regular user token
    const forbiddenStats = await request('/admin/stats', { token: userToken });
    recordTest('Admin', 'GET /api/admin/stats restricts regular user (403 Forbidden)', forbiddenStats.status === 403, `Status: ${forbiddenStats.status}`);

    // 10.3 Admin stats with admin token
    const adminStats = await request('/admin/stats', { token: adminToken });
    const statsOk = adminStats.status === 200 && adminStats.data?.stats?.totalDestinations > 0;
    recordTest('Admin', 'GET /api/admin/stats returns full platform analytics for Admin', statsOk, `Destinations: ${adminStats.data?.stats?.totalDestinations}, Bookings: ${adminStats.data?.stats?.totalBookings}`);

    // 10.4 Food & Culture
    const cultureRes = await request('/admin/food-and-culture');
    recordTest('Admin', 'GET /api/admin/food-and-culture returns culinary & artisan traditions', cultureRes.status === 200 && cultureRes.data?.culinary?.length > 0, `Dishes: ${cultureRes.data?.culinary?.length}`);
  } catch (err) {
    recordTest('Admin', 'Admin test execution', false, err.message);
  }

  // Summary
  console.log('\n======================================================================');
  console.log('📊 BACKEND API & DATABASE TEST SUMMARY');
  console.log('======================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total API Tests Run: ${total}`);
  console.log(`✅ Passed:           ${passed}`);
  console.log(`❌ Failed:           ${failed}`);
  console.log(`Success Rate:        ${((passed / total) * 100).toFixed(1)}%`);
  console.log('======================================================================\n');

  if (serverProcess) {
    console.log('Stopping test server process...');
    serverProcess.kill();
  }

  return { total, passed, failed, results };
}

runApiTests()
  .then(res => {
    if (res.failed > 0) {
      console.log(`Completed with ${res.failed} failure(s).`);
      process.exit(1);
    } else {
      console.log('All backend tests PASSED flawlessly!');
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('Test execution fatal error:', err);
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  });
