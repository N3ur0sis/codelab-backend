import express from 'express';
import session from 'express-session';
import passport from './auth/passport-config.js';
import cors from 'cors';
import { initializePassport } from './auth/passport-config.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
initializePassport(prisma);

const app = express();

app.use(express.json());

// Enable CORS for frontend requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'super-secret-key', // Ensure a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Cookies are secure in production
      httpOnly: true, // Prevent client-side JavaScript from accessing cookies
      sameSite: 'lax',
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Register routes
app.use(authRoutes);
app.use(userRoutes);

export default app;
