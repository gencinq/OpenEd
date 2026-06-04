import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes, { adminRouter } from './modules/users/users.routes';
import notesRoutes from './modules/notes/notes.routes';
import studyGuidesRoutes from './modules/studyGuides/studyGuides.routes';
import questionsRoutes from './modules/questions/questions.routes';
import answersRoutes from './modules/answers/answers.routes';
import pdfRoutes from './modules/pdf/pdf.routes';
import searchRoutes from './modules/search/search.routes';

const app = express();

// Middlewares
app.use(
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/guides', studyGuidesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRouter);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Central Error Handler
app.use(errorHandler);

export default app;
