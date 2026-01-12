# 🚀 Backend Setup Guide (DAY 1-2)

## Overview
You'll build a RESTful API with Node.js + TypeScript + Express + MySQL

**What you're building:**
- Server running on `http://localhost:3001`
- Endpoints to create/read folders and documents
- Connection to MySQL database

---

## Step 1: Initialize Node.js Project

Open PowerShell in the `backend` folder:

```powershell
cd backend
```

Initialize npm:
```powershell
npm init -y
```

**What this does:**
- Creates `package.json` - lists all your project dependencies

---

## Step 2: Install Dependencies

Copy and paste this entire command:

```powershell
npm install express mysql2 cors dotenv
```

**What each package does:**
- `express` - Web framework for creating API routes
- `mysql2` - Connect and query MySQL database
- `cors` - Allow frontend to call backend (different ports)
- `dotenv` - Store sensitive info (passwords) safely

Now install TypeScript packages:

```powershell
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
```

**What each does:**
- `typescript` - Enables TypeScript
- `@types/*` - TypeScript definitions for packages
- `ts-node` - Run TypeScript directly without compiling
- `nodemon` - Auto-restart server when you save files

---

## Step 3: Configure TypeScript

Create a file `tsconfig.json` in the `backend` folder:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**What this does:**
- Tells TypeScript how to compile your code
- `src/` = where you write code
- `dist/` = where compiled JavaScript goes

---

## Step 4: Create Environment Variables

Create a file `.env` in the `backend` folder:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=documents_management
```

**⚠️ Important:**
- Replace `your_mysql_password_here` with your actual MySQL password
- This file should NEVER be committed to GitHub (add to `.gitignore`)

---

## Step 5: Create Folder Structure

Create these folders inside `backend`:

```powershell
mkdir src
mkdir src\config
mkdir src\controllers
mkdir src\routes
```

Your structure should look like:
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   └── routes/
├── .env
├── package.json
└── tsconfig.json
```

---

## Step 6: Create Database Connection

Create file: `src/config/database.ts`

```typescript
/**
 * Database Configuration
 * 
 * Manages MySQL database connection using connection pooling for better performance.
 * Connection pool reuses existing connections instead of creating new ones for each request.
 * 
 * @module config/database
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * MySQL connection pool
 * 
 * Connection pooling improves performance by:
 * - Reusing existing database connections
 * - Managing concurrent requests efficiently
 * - Limiting maximum simultaneous connections
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,    // Queue requests when all connections are busy
  connectionLimit: 10,          // Maximum 10 simultaneous connections
  queueLimit: 0                 // Unlimited queue size
});

/**
 * Tests database connectivity
 * 
 * Attempts to get a connection from the pool to verify:
 * - MySQL server is running
 * - Credentials are correct
 * - Database exists
 * 
 * @throws {Error} If connection fails, exits process with code 1
 */
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();  // Return connection to pool
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);  // Exit if database is not available
  }
}
```

**What this does:**
- Reads database credentials from `.env`
- Creates a pool of connections (efficient for multiple requests)
- `testConnection()` verifies MySQL is reachable

---

## Step 7: Create Folder Controller

Create file: `src/controllers/folderController.ts`

```typescript
/**
 * Folder Controller
 * 
 * Handles all folder-related business logic:
 * - Retrieving all folders
 * - Creating new folders
 * 
 * @module controllers/folderController
 */

import { Request, Response } from 'express';
import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Folder interface matching database schema
 */
interface Folder {
  id: number;
  name: string;
  created_at: Date;
}

/**
 * Get all folders from the database
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of folders ordered by creation date (newest first)
 * 
 * @example
 * GET /api/folders
 * Response: [{ id: 1, name: "Projects", created_at: "2026-01-07..." }]
 */
export const getAllFolders = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM folders ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
};

/**
 * Create a new folder
 * 
 * Validates input and inserts folder into database.
 * 
 * @param req - Express request object
 * @param req.body.name - Name of the folder (required, cannot be empty)
 * @param res - Express response object
 * @returns JSON object with created folder details
 * 
 * @throws {400} If folder name is missing or empty
 * @throws {500} If database operation fails
 * 
 * @example
 * POST /api/folders
 * Body: { "name": "Legal Documents" }
 * Response: { id: 4, name: "Legal Documents", message: "Folder created successfully" }
 */
export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    // Validation: Ensure folder name is provided and not empty
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    // Insert new folder into database
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO folders (name) VALUES (?)',
      [name]
    );

    // Return created folder details
    res.status(201).json({
      id: result.insertId,
      name,
      message: 'Folder created successfully'
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
};
```

**What this does:**
- `getAllFolders` - Fetches all folders from database
- `createFolder` - Inserts a new folder into database
- Validates input and handles errors

---

## Step 8: Create Document Controller

Create file: `src/controllers/documentController.ts`

```typescript
import { Request, Response } from 'express';
import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define TypeScript interface for Document
interface Document {
  id: number;
  name: string;
  folder_id: number;
  file_type: string;
  size: number;
  created_at: Date;
}

// GET all documents with folder info
export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        d.id,
        d.name,
        d.folder_id,
        d.file_type,
        d.size,
        d.created_at,
        f.name as folder_name
      FROM documents d
      JOIN folders f ON d.folder_id = f.id
      ORDER BY d.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// GET documents by folder
export const getDocumentsByFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM documents WHERE folder_id = ? ORDER BY created_at DESC',
      [folderId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// CREATE a new document
export const createDocument = async (req: Request, res: Response) => {
  try {
    const { name, folder_id, file_type, size } = req.body;
    
    // Validation
    if (!name || !folder_id || !file_type || !size) {
      return res.status(400).json({ 
        error: 'All fields are required: name, folder_id, file_type, size' 
      });
    }

    // Check if folder exists
    const [folders] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM folders WHERE id = ?',
      [folder_id]
    );

    if (folders.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO documents (name, folder_id, file_type, size) VALUES (?, ?, ?, ?)',
      [name, folder_id, file_type, size]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      folder_id,
      file_type,
      size,
      message: 'Document created successfully'
    });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
};

// SEARCH documents and folders (BONUS)
export const searchDocuments = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = `%${q}%`;
    
    const [documents] = await pool.query<RowDataPacket[]>(`
      SELECT 
        d.id,
        d.name,
        d.folder_id,
        d.file_type,
        d.size,
        d.created_at,
        f.name as folder_name
      FROM documents d
      JOIN folders f ON d.folder_id = f.id
      WHERE d.name LIKE ? OR f.name LIKE ?
      ORDER BY d.created_at DESC
    `, [searchTerm, searchTerm]);

    res.json(documents);
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: 'Failed to search documents' });
  }
};
```

**What this does:**
- `getAllDocuments` - Fetches all documents with folder names (JOIN query)
- `getDocumentsByFolder` - Fetches documents in specific folder
- `createDocument` - Inserts new document with validation
- `searchDocuments` - Searches by document or folder name (BONUS)

---

## Step 9: Create Routes

Create file: `src/routes/folderRoutes.ts`

```typescript
import express from 'express';
import { getAllFolders, createFolder } from '../controllers/folderController';

const router = express.Router();

// GET /api/folders - Get all folders
router.get('/', getAllFolders);

// POST /api/folders - Create new folder
router.post('/', createFolder);

export default router;
```

Create file: `src/routes/documentRoutes.ts`

```typescript
import express from 'express';
import { 
  getAllDocuments, 
  getDocumentsByFolder, 
  createDocument,
  searchDocuments 
} from '../controllers/documentController';

const router = express.Router();

// GET /api/documents - Get all documents
router.get('/', getAllDocuments);

// GET /api/documents/folder/:folderId - Get documents by folder
router.get('/folder/:folderId', getDocumentsByFolder);

// GET /api/documents/search?q=query - Search documents
router.get('/search', searchDocuments);

// POST /api/documents - Create new document
router.post('/', createDocument);

export default router;
```

**What this does:**
- Defines URL endpoints
- Maps URLs to controller functions
- Organizes routes by resource (folders, documents)

---

## Step 10: Create Main Server File

Create file: `src/server.ts`

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import folderRoutes from './routes/folderRoutes';
import documentRoutes from './routes/documentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/folders', folderRoutes);
app.use('/api/documents', documentRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints:`);
      console.log(`   GET  http://localhost:${PORT}/api/folders`);
      console.log(`   POST http://localhost:${PORT}/api/folders`);
      console.log(`   GET  http://localhost:${PORT}/api/documents`);
      console.log(`   POST http://localhost:${PORT}/api/documents`);
      console.log(`   GET  http://localhost:${PORT}/api/documents/search?q=query`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

**What this does:**
- Sets up Express server
- Configures middleware (CORS, JSON parsing)
- Registers all routes
- Tests database connection before starting
- Starts server on port 3001

---

## Step 11: Add Scripts to package.json

Open `package.json` and add these scripts:

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

**What each script does:**
- `npm run dev` - Start development server (auto-restarts on changes)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

---

## Step 12: Create .gitignore

Create file: `.gitignore`

```
node_modules/
dist/
.env
.DS_Store
```

**Why:**
- Don't commit dependencies, build files, or passwords to GitHub

---

## ✅ Testing Your Backend

### 1. Start the server:

```powershell
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:3001
```

### 2. Test with your browser:

Open: `http://localhost:3001/api/folders`

You should see JSON with your folders!

### 3. Test with PowerShell (or use Postman):

**Get all folders:**
```powershell
curl http://localhost:3001/api/folders
```

**Create a new folder:**
```powershell
curl -X POST http://localhost:3001/api/folders -H "Content-Type: application/json" -d '{"name":"New Folder"}'
```

**Get all documents:**
```powershell
curl http://localhost:3001/api/documents
```

**Create a new document:**
```powershell
curl -X POST http://localhost:3001/api/documents -H "Content-Type: application/json" -d '{\"name\":\"Test.pdf\",\"folder_id\":1,\"file_type\":\"pdf\",\"size\":1024}'
```

**Search:**
```powershell
curl "http://localhost:3001/api/documents/search?q=report"
```

---

## 📋 Your Complete File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── folderController.ts
│   │   └── documentController.ts
│   ├── routes/
│   │   ├── folderRoutes.ts
│   │   └── documentRoutes.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## ❓ Troubleshooting

**Port already in use:**
- Change PORT in `.env` to 3002 or another number

**Database connection failed:**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database `documents_management` exists

**TypeScript errors:**
- Make sure all dependencies are installed
- Check `tsconfig.json` is correct

**Cannot find module:**
- Run `npm install` again
- Delete `node_modules` and run `npm install`

---

## 🎉 What You've Accomplished

✅ Built a complete REST API
✅ Connected to MySQL database  
✅ Created endpoints for folders and documents
✅ Added validation and error handling
✅ Implemented search functionality (bonus!)

---

## 🎯 Next Steps

Once your backend is working and you've tested all endpoints:

**Continue to:** `../frontend/FRONTEND_GUIDE.md`

---

**Questions? Stuck somewhere? Let me know!**
