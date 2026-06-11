import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import menuRoutes from './routes/menu.js';
import shiftRoutes from './routes/shifts.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './db/seed.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/shifts', shiftRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'NASHTY OS Backend is running' });
});

// Global error handler
app.use(errorHandler);

// Seed database and start server
(async () => {
  await seedDatabase();
  app.listen(port, () => {
    console.log(`🚀 NASHTY OS Backend running on http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
  });
})();
