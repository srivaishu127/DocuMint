# 📝 Code Documentation Guide

This guide shows you how to write excellent documentation for your code.

## 🎯 What "Well-Documented Code" Means

Good documentation includes:
1. ✅ **README.md** - Setup instructions and project overview
2. ✅ **Code Comments** - Explain WHY, not just WHAT
3. ✅ **Function Documentation** - JSDoc/TSDoc comments
4. ✅ **API Documentation** - Endpoint descriptions
5. ✅ **Inline Comments** - For complex logic
6. ✅ **Type Definitions** - Clear TypeScript interfaces

---

## 📚 1. README.md (Main Documentation)

Your README should have these sections:

### Required Sections:
```markdown
# Project Title

## Overview
Brief description of what the project does

## Features
List of main features

## Tech Stack
Technologies used

## Prerequisites
What needs to be installed first

## Installation
Step-by-step setup instructions

## Usage
How to use the application

## Project Structure
Folder and file organization

## API Endpoints
List of all API routes

## Database Schema
Tables and relationships

## Troubleshooting
Common issues and solutions

## Author
Your name and contact
```

---

## 💻 2. Code Comments Best Practices

### ✅ Good Comments (Explain WHY)
```typescript
// Use connection pool to reuse database connections and improve performance
export const pool = mysql.createPool({...});

// Validate folder exists before creating document to prevent orphaned records
const [folders] = await pool.query('SELECT id FROM folders WHERE id = ?', [folder_id]);

// Search uses LIKE with wildcards for partial matching
const searchTerm = `%${q}%`;
```

### ❌ Bad Comments (Explain WHAT - code already shows this)
```typescript
// Create a pool
export const pool = mysql.createPool({...});

// Check if folders length is 0
if (folders.length === 0) {...}

// Add percent signs
const searchTerm = `%${q}%`;
```

### 📋 When to Comment:
- ✅ Complex business logic
- ✅ Non-obvious decisions
- ✅ Workarounds or hacks
- ✅ TODO items
- ❌ Self-explanatory code
- ❌ Repeating what code says

---

## 📖 3. Function Documentation (JSDoc/TSDoc)

### Backend Controller Example:
```typescript
/**
 * Retrieves all folders from the database
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON array of folder objects with id, name, and created_at
 * 
 * @example
 * GET /api/folders
 * Response: [{ id: 1, name: "Projects", created_at: "2026-01-07..." }]
 */
export const getAllFolders = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM folders ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
};

/**
 * Creates a new folder in the database
 * 
 * @param req - Express request object containing folder name in body
 * @param req.body.name - Name of the folder to create (required)
 * @param res - Express response object
 * @returns JSON object with created folder details
 * 
 * @throws {400} If folder name is missing or empty
 * @throws {500} If database operation fails
 * 
 * @example
 * POST /api/folders
 * Body: { "name": "Legal" }
 * Response: { id: 4, name: "Legal", message: "Folder created successfully" }
 */
export const createFolder = async (req: Request, res: Response) => {
  // Implementation...
};
```

### Frontend Component Example:
```typescript
/**
 * DocumentCard Component
 * 
 * Displays a single document as a card with name, folder, file type, size, and date.
 * 
 * @component
 * @param {DocumentCardProps} props - Component props
 * @param {Document} props.document - Document object to display
 * 
 * @example
 * <DocumentCard document={{ 
 *   id: 1, 
 *   name: "Report.pdf", 
 *   folder_name: "Projects",
 *   file_type: "pdf",
 *   size: 2048,
 *   created_at: "2026-01-07..."
 * }} />
 */
export default function DocumentCard({ document }: DocumentCardProps) {
  // Implementation...
}
```

---

## 🗂️ 4. File Header Comments

Add at the top of each file:

### Backend Files:
```typescript
/**
 * Folder Controller
 * 
 * Handles all folder-related operations including:
 * - Fetching all folders
 * - Creating new folders
 * 
 * @module controllers/folderController
 * @requires express
 * @requires ../config/database
 */

import { Request, Response } from 'express';
import { pool } from '../config/database';
```

### Frontend Files:
```typescript
/**
 * API Service
 * 
 * Centralizes all HTTP requests to the backend API.
 * Provides typed functions for folder and document operations.
 * 
 * @module services/api
 * @requires axios
 */

import axios from 'axios';
import { Folder, Document, NewDocument, NewFolder } from '../types';
```

---

## 🎨 5. TypeScript Interface Documentation

```typescript
/**
 * Represents a folder in the document management system
 */
export interface Folder {
  /** Unique identifier for the folder */
  id: number;
  
  /** Display name of the folder */
  name: string;
  
  /** Timestamp when folder was created */
  created_at: string;
}

/**
 * Represents a document with associated folder information
 */
export interface Document {
  /** Unique identifier for the document */
  id: number;
  
  /** Display name of the document (including extension) */
  name: string;
  
  /** ID of the folder this document belongs to */
  folder_id: number;
  
  /** Name of the parent folder (from JOIN query) */
  folder_name?: string;
  
  /** File extension/type (e.g., 'pdf', 'docx', 'xlsx') */
  file_type: string;
  
  /** File size in bytes (simulated, not actual file) */
  size: number;
  
  /** Timestamp when document was created */
  created_at: string;
}

/**
 * Data structure for creating a new document
 * Omits auto-generated fields (id, created_at)
 */
export interface NewDocument {
  name: string;
  folder_id: number;
  file_type: string;
  size: number;
}
```

---

## 📋 6. API Endpoint Documentation

Create `API_DOCUMENTATION.md`:

```markdown
# API Documentation

Base URL: `http://localhost:3001/api`

## Folders

### Get All Folders
**GET** `/folders`

Returns a list of all folders.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Projects",
    "created_at": "2026-01-07T10:00:00.000Z"
  }
]
```

### Create Folder
**POST** `/folders`

Creates a new folder.

**Request Body:**
```json
{
  "name": "Legal"
}
```

**Response:**
```json
{
  "id": 4,
  "name": "Legal",
  "message": "Folder created successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Folder name is required
- `500 Internal Server Error` - Database error
```

---

## 🔧 7. Complex Logic Documentation

For complex algorithms or business logic:

```typescript
export const searchDocuments = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    // Validate search query exists
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Add wildcards for partial matching
    // Example: "report" becomes "%report%" to match:
    // - "Budget Report.pdf"
    // - "report_2024.xlsx"
    // - "Monthly_report.docx"
    const searchTerm = `%${q}%`;
    
    // Search across both document names AND folder names
    // Uses JOIN to include folder information in results
    // LIKE operator performs case-insensitive partial matching
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

---

## 📝 8. TODO Comments

For incomplete features or future improvements:

```typescript
// TODO: Add pagination when document count exceeds 100
export const getAllDocuments = async (req: Request, res: Response) => {
  // Implementation...
};

// TODO: Implement document editing functionality
// export const updateDocument = async (req: Request, res: Response) => {
//   // Coming in v2
// };

// FIXME: Add rate limiting to prevent API abuse
app.use('/api', routes);
```

---

## 🎯 9. Error Handling Documentation

```typescript
/**
 * Creates a new document with validation
 * 
 * Validation Rules:
 * - All fields are required (name, folder_id, file_type, size)
 * - folder_id must reference an existing folder
 * - size must be a positive integer (bytes)
 * 
 * @throws {400} Missing required fields
 * @throws {404} Folder not found
 * @throws {500} Database error
 */
export const createDocument = async (req: Request, res: Response) => {
  try {
    const { name, folder_id, file_type, size } = req.body;
    
    // Validation: Check all required fields are present
    if (!name || !folder_id || !file_type || !size) {
      return res.status(400).json({ 
        error: 'All fields are required: name, folder_id, file_type, size' 
      });
    }

    // Validation: Verify folder exists before creating document
    // Prevents orphaned documents (referential integrity)
    const [folders] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM folders WHERE id = ?',
      [folder_id]
    );

    if (folders.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Insert document into database
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
```

---

## 📊 10. Documentation Checklist

Before submission, ensure you have:

### README.md
- [ ] Project title and description
- [ ] Features list
- [ ] Tech stack
- [ ] Prerequisites
- [ ] Installation steps (tested)
- [ ] Usage instructions
- [ ] Project structure
- [ ] API endpoints
- [ ] Troubleshooting section
- [ ] Author information

### Code Comments
- [ ] File headers for all files
- [ ] Function documentation (JSDoc)
- [ ] Complex logic explained
- [ ] TypeScript interfaces documented
- [ ] Error handling explained

### Additional Documentation
- [ ] API_DOCUMENTATION.md (optional but impressive)
- [ ] DATABASE_SCHEMA.md (you already have this!)
- [ ] CONTRIBUTING.md (if making it open source)

### Code Quality
- [ ] Consistent naming conventions
- [ ] Meaningful variable names
- [ ] DRY principle (Don't Repeat Yourself)
- [ ] Single Responsibility Principle
- [ ] Error handling on all async operations

---

## 🌟 Documentation Best Practices Summary

### DO:
✅ Explain WHY, not WHAT
✅ Document complex logic
✅ Keep comments up-to-date
✅ Use JSDoc for functions
✅ Provide examples
✅ Document error cases
✅ Keep README current

### DON'T:
❌ Comment obvious code
❌ Leave outdated comments
❌ Use vague descriptions
❌ Document everything (over-commenting)
❌ Forget to update docs when code changes

---

## 💡 Pro Tips

1. **Write README First** - Helps plan your project
2. **Update as You Code** - Don't leave docs for the end
3. **Test Your Instructions** - Follow your own README
4. **Use Examples** - Show, don't just tell
5. **Think Like a New User** - What would confuse you?

---

## 📸 Visual Documentation

Consider adding to your README:
- Screenshots of the UI
- GIF of key features in action
- Architecture diagrams (like DATABASE_SCHEMA.md)
- Flowcharts for complex processes

Tools:
- Screenshots: Windows Snipping Tool (Win + Shift + S)
- GIFs: ScreenToGif (free)
- Diagrams: draw.io or excalidraw.com

---

**Well-documented code is a sign of a professional developer!** 🚀

The time you spend on documentation makes your project:
- Easier for assessors to evaluate
- Easier for you to maintain
- More impressive in your portfolio
- Better for collaboration

**Documentation is not extra work - it's part of the work!** ✨
