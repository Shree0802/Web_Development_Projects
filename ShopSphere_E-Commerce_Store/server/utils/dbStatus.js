const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';

async function checkDatabase() {
  console.log('====================================================');
  console.log('🍃 SHOPSPHERE MONGODB DATABASE STATUS');
  console.log('====================================================');
  console.log(`📍 Connecting to: ${uri}\n`);

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ [CONNECTED]: Host = ${conn.connection.host}, Database = ${conn.connection.name}\n`);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log('📊 COLLECTIONS OVERVIEW:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   • ${col.name.padEnd(16)} : ${count} record(s)`);
    }

    // Customer Users
    const users = await db.collection('users').find({}).project({ password: 0 }).toArray();
    console.log(`\n👤 CUSTOMER RECORDS (${users.length} registered):`);
    users.forEach((u, i) => {
      const date = u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : 'N/A';
      console.log(`   [${i + 1}] Name: ${u.name.padEnd(20)} | Email: ${u.email.padEnd(28)} | Role: ${(u.role || 'user').padEnd(6)} | Registered: ${date}`);
    });

    // Orders
    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(10).toArray();
    console.log(`\n📦 RECENT ORDERS (${orders.length} showing):`);
    orders.forEach((o, i) => {
      const total = '₹' + Math.round(o.totalPrice || 0).toLocaleString('en-IN');
      const itemsCount = o.orderItems ? o.orderItems.length : 0;
      const date = o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : 'N/A';
      console.log(`   [${i + 1}] ID: ${o._id} | Total: ${total.padEnd(10)} | Status: ${(o.status || 'Processing').padEnd(12)} | Items: ${itemsCount} | Placed: ${date}`);
    });

    // Products
    const productsCount = await db.collection('products').countDocuments();
    console.log(`\n🛍️ PRODUCT CATALOG: ${productsCount} active products in MongoDB.`);

    console.log('\n====================================================');
    console.log('🎉 MongoDB is connected and actively storing all records!');
    console.log('====================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}

checkDatabase();
