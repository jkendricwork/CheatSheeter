import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import sectionsRouter from './routes/sections';
import subsectionsRouter from './routes/subsections';
import codeBlocksRouter from './routes/codeBlocks';
import searchRouter from './routes/search';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/sections', sectionsRouter);
app.use('/api/subsections', subsectionsRouter);
app.use('/api/code-blocks', codeBlocksRouter);
app.use('/api/search', searchRouter);

// Error handling
app.use(errorHandler);

export default app;
