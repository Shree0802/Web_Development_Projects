const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://localhost:27017/shopsphere';
const ATLAS_URI = 'mongodb+srv://shreepatil0802_db_user:ObfTOOM0ggPKaWy2@shopsphere-cluster.hndf0tu.mongodb.net/shopsphere?retryWrites=true&w=majority';

async function migrate() {
  console.log('Connecting to Local MongoDB...');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('Connected to Local MongoDB!');

  console.log('Connecting to MongoDB Atlas...');
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('Connected to MongoDB Atlas!');

  const localDb = localConn.db;
  const atlasDb = atlasConn.db;

  const collections = await localDb.listCollections().toArray();
  console.log(`Found ${collections.length} collections locally.`);

  for (const col of collections) {
    const colName = col.name;
    const docs = await localDb.collection(colName).find({}).toArray();
    console.log(`Migrating collection '${colName}' (${docs.length} documents)...`);

    if (docs.length > 0) {
      const atlasCol = atlasDb.collection(colName);
      // Clean target collection first to avoid duplicates
      await atlasCol.deleteMany({});
      await atlasCol.insertMany(docs);
      console.log(`  -> Successfully transferred ${docs.length} documents to Atlas collection '${colName}'.`);
    }
  }

  console.log('\n=============================================');
  console.log('MIGRATION COMPLETE! All data copied to Atlas.');
  console.log('=============================================');

  await localConn.close();
  await atlasConn.close();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
