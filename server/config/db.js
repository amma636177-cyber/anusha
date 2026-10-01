import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      try {
        console.log('Connecting to provided MONGODB_URI...');
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`✅ MongoDB Connected via External URI: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn('⚠️ External MongoDB connection failed, falling back to embedded in-memory MongoDB...', err.message);
      }
    }

    console.log('🚀 Initializing Embedded High-Performance MongoDB Server...');
    mongodInstance = await MongoMemoryServer.create();
    const inMemoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(inMemoryUri);
    console.log(`✅ MongoDB Connected via In-Memory Engine: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
