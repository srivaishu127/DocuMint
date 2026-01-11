import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import folderRoutes from './routes/folderRoutes';
import documentRoutes from './routes/documentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Health check endpoint -> Verify server is running.

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

//API Routes

app.use('/api/folders', folderRoutes);
app.use('/api/documents', documentRoutes);

//Start Server

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
