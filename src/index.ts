import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api/users', userRoutes);
