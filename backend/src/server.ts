// Express Server Entry Point
// Configures middleware, routes, and starts the HTTP server
// Database connection is tested on startup via config/database.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import folderRoutes from './routes/folderRoutes';
import documentRoutes from './routes/documentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware: CORS for frontend access, JSON/URL-encoded body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint - returns API metadata and available endpoints
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Documents Management API',
    status: 'Server is running',
    endpoints: {
      folders: '/api/folders',
      documents: '/api/documents',
      search: '/api/documents/search'
    }
  });
});

// API Routes
app.use('/api/folders', folderRoutes);
app.use('/api/documents', documentRoutes);

// Start server and log endpoints

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
