// routes/google.routes.js
import { Router } from 'express';
import { searchGoogleBooks } from '../controllers/google.controller.js';

const router = Router();

// GET /integrations/google/books?q=harry%20potter&maxResults=10
router.get('/books', searchGoogleBooks);

export default router;
