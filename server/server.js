import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { initSocket } from './services/socket.service.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkExpiringGroups } from './services/group.service.js';
import Product from './models/Product.js';
import { seedDatabase } from './scripts/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import groupRoutes from './routes/group.routes.js';
import discountRoutes from './routes/discount.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
initSocket(io);

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Group Buying & Discount Management Platform API'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend assets from client/dist if built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to index.html for React SPA client routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Central error handler
app.use(errorHandler);

// Server startup & Database setup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Check if initial seeding is needed
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database empty. Running automated seeding...');
      await seedDatabase();
    } else {
      console.log(`Database ready with ${count} existing products.`);
    }

    // Schedule group expiry checks every minute
    setInterval(async () => {
      try {
        await checkExpiringGroups();
      } catch (err) {
        console.error('Group expiry worker check:', err.message);
      }
    }, 60000);

    server.listen(PORT, () => {
      console.log(`🚀 Premium Group Buying API Server running on port ${PORT}`);
      console.log(`📡 Real-time Socket.IO Gateway active`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Fatal Server Boot Error:', error);
    process.exit(1);
  }
};

startServer();
