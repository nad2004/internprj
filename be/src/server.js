import cors from 'cors';
import './jobs/deleteUnverifiedUsers.js';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bookRoutes from './routes/book.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import authRoutes from './routes/auth.routes.js';
import googleRoutes from './routes/google.routes.js';
import loanRoutes from './routes/loan.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import notificationRoutes from './routes/notification.routes.js';
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
app.use('/api/book-instance', bookInstanceRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notify', notificationRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use(errorHandler);
