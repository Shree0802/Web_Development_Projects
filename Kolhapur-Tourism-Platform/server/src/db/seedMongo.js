const mongoose = require('mongoose');
const initialData = require('../data/initialData');
const models = require('../models');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kolhapur_tourism';

async function seedMongo() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Seed Users
    if (initialData.users && initialData.users.length > 0) {
      console.log(`Seeding ${initialData.users.length} users...`);
      for (const u of initialData.users) {
        await models.User.findOneAndUpdate(
          { email: u.email },
          { ...u, id: u.id || `user_${Date.now()}` },
          { upsert: true, new: true }
        );
      }
    }

    // 2. Seed Destinations
    if (initialData.destinations && initialData.destinations.length > 0) {
      console.log(`Seeding ${initialData.destinations.length} destinations...`);
      for (const d of initialData.destinations) {
        await models.Destination.findOneAndUpdate(
          { id: d.id },
          d,
          { upsert: true, new: true }
        );
      }
    }

    // 3. Seed Hotels
    if (initialData.hotels && initialData.hotels.length > 0) {
      console.log(`Seeding ${initialData.hotels.length} hotels...`);
      for (const h of initialData.hotels) {
        await models.Hotel.findOneAndUpdate(
          { id: h.id },
          h,
          { upsert: true, new: true }
        );
      }
    }

    // 4. Seed Tours
    if (initialData.tours && initialData.tours.length > 0) {
      console.log(`Seeding ${initialData.tours.length} tours...`);
      for (const t of initialData.tours) {
        await models.Tour.findOneAndUpdate(
          { id: t.id },
          t,
          { upsert: true, new: true }
        );
      }
    }

    // 5. Seed Food Items
    if (initialData.foodItems && initialData.foodItems.length > 0) {
      console.log(`Seeding ${initialData.foodItems.length} food items...`);
      for (const f of initialData.foodItems) {
        // Use authentic local images
        let img = f.image;
        if (f.id === 'kolhapuri-misal') img = '/images/kolhapuri-misal.jpg';
        await models.FoodItem.findOneAndUpdate(
          { id: f.id },
          { ...f, image: img },
          { upsert: true, new: true }
        );
      }
    }

    // 6. Seed Culture Items
    if (initialData.culture && initialData.culture.length > 0) {
      console.log(`Seeding ${initialData.culture.length} culture items...`);
      for (const c of initialData.culture) {
        let img = c.image;
        if (c.id === 'kolhapuri-chappal') img = '/images/kolhapuri-chappal.jpg';
        if (c.id === 'kushti-tradition' || c.id === 'kushti') img = '/images/kolhapuri-kushti.jpg';
        await models.CultureItem.findOneAndUpdate(
          { id: c.id },
          { ...c, image: img },
          { upsert: true, new: true }
        );
      }
    }

    // 7. Seed Reviews
    if (initialData.reviews && initialData.reviews.length > 0) {
      console.log(`Seeding ${initialData.reviews.length} reviews...`);
      for (const r of initialData.reviews) {
        await models.Review.findOneAndUpdate(
          { id: r.id },
          r,
          { upsert: true, new: true }
        );
      }
    }

    console.log('✅ MongoDB database successfully seeded with all initial data!');
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

if (require.main === module) {
  seedMongo();
}

module.exports = seedMongo;
