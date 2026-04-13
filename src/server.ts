import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB dynamically per request (Serverless model)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import auditRoutes from './routes/auditRoutes';
import teamRoutes from './routes/teamRoutes';

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/teams', teamRoutes);

// Start Server only if not running in a Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
