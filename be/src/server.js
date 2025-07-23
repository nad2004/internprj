import cors from 'cors';
import './jobs/deleteUnverifiedUsers.js';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bookRoutes from './routes/book.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import authRoutes from './routes/auth.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import bookInstanceRoutes from './routes/bookInstance.routes.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

connectDB();

app.use('/api/book', bookRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/book-instances', bookInstanceRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use(errorHandler);
