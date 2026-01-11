# 🎨 Frontend Setup Guide (DAY 3-4)

## Overview
You'll build a Next.js app with React components that talks to your backend API

**What you're building:**
- Website running on `http://localhost:3000`
- View all documents and folders
- Forms to add new documents and folders
- Search functionality (bonus)
- Styled with Tailwind CSS

---

## Step 1: Initialize Next.js Project

Open PowerShell in the `vis_tra` folder (parent of backend):

```powershell
cd ..
# You should now be in vis_tra folder
```

Create Next.js app with TypeScript and Tailwind:

```powershell
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

**When prompted, answer:**
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **No**
- App Router: **Yes**
- Import alias: **Yes** (default @/*)

**What this does:**
- Creates a complete Next.js project with TypeScript
- Sets up Tailwind CSS for styling
- Uses the new App Router (file-based routing)

---

## Step 2: Install Additional Dependencies

Navigate to frontend folder:

```powershell
cd frontend
```

Install axios for API calls:

```powershell
npm install axios
```

**Why axios:**
- Makes HTTP requests to backend easier
- Better error handling than fetch
- Cleaner syntax

---

## Step 3: Understanding Next.js Structure

Your `frontend` folder now has:

```
frontend/
├── app/
│   ├── layout.tsx       ← Main layout (wraps all pages)
│   ├── page.tsx         ← Home page (/)
│   └── globals.css      ← Global styles
├── public/              ← Static files (images, etc.)
├── next.config.js       ← Next.js configuration
├── tailwind.config.ts   ← Tailwind configuration
└── package.json
```

**Key concept:**
- Files in `app/` folder = routes
- `app/page.tsx` = http://localhost:3000/
- `app/about/page.tsx` = http://localhost:3000/about

---

## Step 4: Create TypeScript Types

Create file: `app/types.ts`

```typescript
// Define data structures for type safety

export interface Folder {
  id: number;
  name: string;
  created_at: string;
}

export interface Document {
  id: number;
  name: string;
  folder_id: number;
  folder_name?: string; // From JOIN query
  file_type: string;
  size: number;
  created_at: string;
}

export interface NewDocument {
  name: string;
  folder_id: number;
  file_type: string;
  size: number;
}

export interface NewFolder {
  name: string;
}
```

**What this does:**
- Defines the shape of your data
- TypeScript will warn you if you use wrong property names
- Intellisense will show available properties

---

## Step 5: Create API Service

Create file: `app/services/api.ts`

```typescript
import axios from 'axios';
import { Folder, Document, NewDocument, NewFolder } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Folder API calls
export const folderAPI = {
  // Get all folders
  getAll: async (): Promise<Folder[]> => {
    const response = await api.get('/folders');
    return response.data;
  },

  // Create new folder
  create: async (folder: NewFolder): Promise<Folder> => {
    const response = await api.post('/folders', folder);
    return response.data;
  },
};

// Document API calls
export const documentAPI = {
  // Get all documents
  getAll: async (): Promise<Document[]> => {
    const response = await api.get('/documents');
    return response.data;
  },

  // Get documents by folder
  getByFolder: async (folderId: number): Promise<Document[]> => {
    const response = await api.get(`/documents/folder/${folderId}`);
    return response.data;
  },

  // Create new document
  create: async (document: NewDocument): Promise<Document> => {
    const response = await api.post('/documents', document);
    return response.data;
  },

  // Search documents
  search: async (query: string): Promise<Document[]> => {
    const response = await api.get(`/documents/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
```

**What this does:**
- Centralizes all API calls in one place
- Provides clean functions like `folderAPI.getAll()`
- Handles typing for requests and responses

---

## Step 6: Create Reusable Components

### A. Create Components Folder

```powershell
mkdir app\components
```

### B. Create Document Card Component

Create file: `app/components/DocumentCard.tsx`

```typescript
import { Document } from '../types';

interface DocumentCardProps {
  document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{document.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Folder: {document.folder_name || 'Unknown'}
          </p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {document.file_type.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span>{formatSize(document.size)}</span>
        <span>•</span>
        <span>{formatDate(document.created_at)}</span>
      </div>
    </div>
  );
}
```

**What this does:**
- Displays a single document as a card
- Shows name, folder, file type, size, and date
- Uses Tailwind CSS classes for styling
- Formats size (bytes → KB/MB) and date

### C. Create Folder List Component

Create file: `app/components/FolderList.tsx`

```typescript
'use client';

import { Folder } from '../types';

interface FolderListProps {
  folders: Folder[];
  selectedFolderId: number | null;
  onSelectFolder: (folderId: number | null) => void;
}

export default function FolderList({ 
  folders, 
  selectedFolderId, 
  onSelectFolder 
}: FolderListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4">Folders</h2>
      
      {/* "All Documents" option */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`w-full text-left px-4 py-2 rounded mb-2 transition-colors ${
          selectedFolderId === null
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        📁 All Documents
      </button>

      {/* Folder list */}
      {folders.map((folder) => (
        <button
          key={folder.id}
          onClick={() => onSelectFolder(folder.id)}
          className={`w-full text-left px-4 py-2 rounded mb-2 transition-colors ${
            selectedFolderId === folder.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          📁 {folder.name}
        </button>
      ))}

      {folders.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          No folders yet
        </p>
      )}
    </div>
  );
}
```

**What this does:**
- Displays list of folders
- Highlights selected folder
- Includes "All Documents" option to show everything
- `'use client'` directive makes it interactive (React hooks)

### D. Create Add Document Form

Create file: `app/components/AddDocumentForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Folder, NewDocument } from '../types';

interface AddDocumentFormProps {
  folders: Folder[];
  onAdd: (document: NewDocument) => Promise<void>;
}

export default function AddDocumentForm({ folders, onAdd }: AddDocumentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    folder_id: '',
    file_type: '',
    size: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Document name is required';
    }
    if (!formData.folder_id) {
      newErrors.folder_id = 'Please select a folder';
    }
    if (!formData.file_type.trim()) {
      newErrors.file_type = 'File type is required';
    }
    if (!formData.size || parseInt(formData.size) <= 0) {
      newErrors.size = 'Size must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onAdd({
        name: formData.name,
        folder_id: parseInt(formData.folder_id),
        file_type: formData.file_type,
        size: parseInt(formData.size),
      });

      // Reset form
      setFormData({ name: '', folder_id: '', file_type: '', size: '' });
      setErrors({});
      setIsOpen(false);
    } catch (error) {
      setErrors({ submit: 'Failed to add document. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        + Add Document
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Add New Document</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Document Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Report.pdf"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Folder Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Folder</label>
          <select
            value={formData.folder_id}
            onChange={(e) => setFormData({ ...formData, folder_id: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          {errors.folder_id && <p className="text-red-500 text-sm mt-1">{errors.folder_id}</p>}
        </div>

        {/* File Type */}
        <div>
          <label className="block text-sm font-medium mb-1">File Type</label>
          <input
            type="text"
            value={formData.file_type}
            onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., pdf, docx, xlsx"
          />
          {errors.file_type && <p className="text-red-500 text-sm mt-1">{errors.file_type}</p>}
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium mb-1">Size (bytes)</label>
          <input
            type="number"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2048"
          />
          {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <p className="text-red-500 text-sm">{errors.submit}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Document'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setFormData({ name: '', folder_id: '', file_type: '', size: '' });
              setErrors({});
            }}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

**What this does:**
- Form to add new documents
- Validates all inputs before submitting
- Shows error messages for invalid inputs
- Toggles between button and form view
- Disables submit button while processing

### E. Create Add Folder Form

Create file: `app/components/AddFolderForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { NewFolder } from '../types';

interface AddFolderFormProps {
  onAdd: (folder: NewFolder) => Promise<void>;
}

export default function AddFolderForm({ onAdd }: AddFolderFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAdd({ name });
      setName('');
      setIsOpen(false);
    } catch (err) {
      setError('Failed to create folder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        + Add Folder
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Add New Folder</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Folder Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Contracts"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Folder'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
              setError('');
            }}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

**What this does:**
- Simpler form for adding folders (only needs name)
- Same pattern as document form
- Green color to differentiate from document form

### F. Create Search Bar Component

Create file: `app/components/SearchBar.tsx`

```typescript
'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents and folders..."
        className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        🔍 Search
      </button>
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}
```

**What this does:**
- Search input with submit button
- Shows "Clear" button when there's a search query
- Calls parent's `onSearch` function

---

## Step 7: Create Main Page

Replace contents of `app/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Folder, Document, NewDocument, NewFolder } from './types';
import { folderAPI, documentAPI } from './services/api';
import FolderList from './components/FolderList';
import DocumentCard from './components/DocumentCard';
import AddDocumentForm from './components/AddDocumentForm';
import AddFolderForm from './components/AddFolderForm';
import SearchBar from './components/SearchBar';

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load folders and documents on mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter documents when folder selection changes
  useEffect(() => {
    if (selectedFolderId !== null) {
      loadDocumentsByFolder(selectedFolderId);
    } else if (searchQuery) {
      // Keep search results
    } else {
      loadDocuments();
    }
  }, [selectedFolderId]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [foldersData, documentsData] = await Promise.all([
        folderAPI.getAll(),
        documentAPI.getAll(),
      ]);
      setFolders(foldersData);
      setDocuments(documentsData);
    } catch (err) {
      setError('Failed to load data. Make sure backend is running on port 3001.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await documentAPI.getAll();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const loadDocumentsByFolder = async (folderId: number) => {
    try {
      const data = await documentAPI.getByFolder(folderId);
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents by folder:', err);
    }
  };

  const handleAddDocument = async (newDoc: NewDocument) => {
    await documentAPI.create(newDoc);
    await loadData(); // Reload everything
  };

  const handleAddFolder = async (newFolder: NewFolder) => {
    await folderAPI.create(newFolder);
    await loadData(); // Reload everything
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSelectedFolderId(null); // Clear folder filter

    if (!query.trim()) {
      await loadDocuments();
      return;
    }

    try {
      const results = await documentAPI.search(query);
      setDocuments(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📄 Document Management System
          </h1>
          <p className="text-gray-600">
            Manage your documents and folders efficiently
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <AddFolderForm onAdd={handleAddFolder} />
          <AddDocumentForm folders={folders} onAdd={handleAddDocument} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar: Folders */}
          <div className="md:col-span-1">
            <FolderList
              folders={folders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
            />
          </div>

          {/* Main: Documents */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : selectedFolderId
                    ? `Documents in ${folders.find((f) => f.id === selectedFolderId)?.name}`
                    : 'All Documents'}
                </h2>
                <span className="text-sm text-gray-500">
                  {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                </span>
              </div>

              {documents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {searchQuery
                    ? 'No documents found matching your search.'
                    : 'No documents yet. Add your first document above!'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**What this does:**
- Main page that ties everything together
- Loads folders and documents when page loads
- Handles folder selection to filter documents
- Handles adding new folders and documents
- Handles search functionality
- Shows loading and error states
- Responsive grid layout

---

## Step 8: Update Layout (Optional)

Update `app/layout.tsx` to add metadata:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Document Management System',
  description: 'Manage your documents and folders efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## ✅ Testing Your Frontend

### 1. Make sure backend is running:

In backend terminal:
```powershell
npm run dev
```

### 2. Start frontend:

In a NEW PowerShell window, navigate to frontend:
```powershell
cd frontend
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3000
```

### 3. Open in browser:

Visit: `http://localhost:3000`

You should see:
- List of folders on the left
- Documents in cards on the right
- "Add Folder" and "Add Document" buttons
- Search bar at top

### 4. Test functionality:

✅ Click on a folder → documents filter by folder
✅ Click "All Documents" → shows all documents
✅ Click "Add Folder" → form appears → add a folder
✅ Click "Add Document" → form appears → add a document
✅ Type in search bar → hit search → see filtered results

---

## 📋 Your Complete File Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── AddDocumentForm.tsx
│   │   ├── AddFolderForm.tsx
│   │   ├── DocumentCard.tsx
│   │   ├── FolderList.tsx
│   │   └── SearchBar.tsx
│   ├── services/
│   │   └── api.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── types.ts
├── public/
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Customizing Styles

All components use Tailwind CSS. To customize:

**Change colors:**
```typescript
// Instead of bg-blue-500
className="bg-purple-500"

// Instead of text-gray-600
className="text-slate-600"
```

**Change spacing:**
```typescript
// Instead of p-4 (padding)
className="p-6"

// Instead of mb-4 (margin-bottom)
className="mb-8"
```

**Tailwind color scale:**
- 50 = lightest
- 500 = medium
- 900 = darkest

---

## ❓ Troubleshooting

**Cannot connect to backend:**
- Make sure backend is running on port 3001
- Check `app/services/api.ts` has correct URL
- Check browser console for CORS errors

**Components not showing:**
- Check browser console for errors
- Verify all imports are correct
- Make sure `'use client'` is at top of interactive components

**Tailwind styles not working:**
- Restart dev server: `npm run dev`
- Check `tailwind.config.ts` includes `app/**/*.{ts,tsx}`

**TypeScript errors:**
- Make sure all types are imported
- Check type definitions in `types.ts`

---

## 🎉 What You've Accomplished

✅ Built a complete Next.js frontend with React
✅ Created reusable components
✅ Integrated with backend API
✅ Added form validation
✅ Implemented search functionality
✅ Made it responsive with Tailwind CSS

---

## 🎯 Next Steps

1. **Test Everything:**
   - Add multiple folders
   - Add documents to different folders
   - Test search with various queries
   - Try filtering by folder

2. **Improve UI (Optional):**
   - Add delete functionality
   - Add edit functionality
   - Add sorting options
   - Add pagination if many documents

3. **Documentation:**
   - Write README.md (I'll help with this)
   - Add screenshots
   - Document setup steps

4. **Deploy (Optional):**
   - Push to GitHub
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel

---

**Questions? Need help with anything? Let me know!**
