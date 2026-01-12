# Frontend Architecture Documentation

## Overview

The frontend is built with **Next.js 14** using the **App Router** architecture, featuring a component-based design with TypeScript and SCSS for styling.

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│                 http://localhost:3000                    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                NEXT.JS APP (React 18)                    │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │              LAYOUT (Root)                          │ │
│  │  • HTML structure                                   │ │
│  │  • Global metadata                                  │ │
│  │  • Global styles import                             │ │
│  └────────────────────────────────────────────────────┘ │
│                           ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │              PAGE (Main View)                       │ │
│  │  • Document/Folder table                            │ │
│  │  • Search functionality                             │ │
│  │  • Navigation logic                                 │ │
│  │  • State management (useState, useEffect)           │ │
│  └────────────────────────────────────────────────────┘ │
│                           ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │          COMPONENTS (Reusable UI)                   │ │
│  │  • AddFolderModal                                   │ │
│  │  • AddDocumentModal                                 │ │
│  │  • DeleteConfirmModal                               │ │
│  └────────────────────────────────────────────────────┘ │
│                           ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │          API COMMUNICATION (Fetch)                  │ │
│  │  • GET /api/folders                                 │ │
│  │  • POST /api/folders                                │ │
│  │  • GET /api/documents                               │ │
│  │  • POST /api/documents                              │ │
│  │  • GET /api/documents/search                        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                BACKEND API (Express)                     │
│                http://localhost:3001/api                 │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx                # Root layout (HTML, metadata)
│   ├── page.tsx                  # Main page (document management UI)
│   │
│   └── components/               # Reusable React components
│       ├── AddFolderModal.tsx    # Create folder modal
│       ├── AddDocumentModal.tsx  # Create document modal (2-step)
│       └── DeleteConfirmModal.tsx # Delete confirmation modal
│
├── styles/
│   └── globals.scss              # Global SCSS styles
│
├── public/                       # Static assets (if any)
│
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── next-env.d.ts                 # Next.js TypeScript definitions
```

---

## Component Architecture

### Component Hierarchy

```
┌──────────────────────────────────────────────────────────┐
│                    Root Layout                            │
│  • <html> & <head>                                        │
│  • Global styles                                          │
│  • Metadata (title, description)                          │
└──────────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────┐
│                     Main Page                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Header Section                                     │  │
│  │  • Title: "DocuMint - Document Management"         │  │
│  │  • Breadcrumb: "Root" or "Root > Folder Name"      │  │
│  │  • Action buttons (Add Folder, Upload Document)    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Search & Sort Section                              │  │
│  │  • Search input (min 2 chars)                       │  │
│  │  • Sort dropdown (Name: A-Z / Z-A)                  │  │
│  │  • Clear search button                              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Table Section                                       │  │
│  │  • Folder cards (when at root)                      │  │
│  │  • Document table (with folder name column)         │  │
│  │  • Pagination controls                              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Modals (Conditional rendering)                     │  │
│  │  • AddFolderModal (when isAddFolderModalOpen)      │  │
│  │  • AddDocumentModal (when isAddDocumentModalOpen)  │  │
│  │  • DeleteConfirmModal (when isDeleteModalOpen)     │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## State Management

### Main Page State

```typescript
// Data state
const [folders, setFolders] = useState<Folder[]>([])
const [documents, setDocuments] = useState<Document[]>([])

// UI state
const [searchQuery, setSearchQuery] = useState('')
const [currentPage, setCurrentPage] = useState(1)
const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)

// Modal state
const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false)
const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false)
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

// Delete state
const [deleteTarget, setDeleteTarget] = useState<{
  type: 'folder' | 'document',
  id: number,
  name: string
} | null>(null)
```

### State Flow Diagram

```
User Action
    ↓
┌─────────────────────────────────────────────────┐
│ User clicks "Add Folder"                        │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ setIsAddFolderModalOpen(true)                   │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ <AddFolderModal> renders                        │
│ User fills form and submits                     │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ POST /api/folders                               │
│ Server creates folder                           │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ onSuccess() callback                            │
│ - fetchFolders()                                │
│ - setIsAddFolderModalOpen(false)               │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ UI re-renders with new folder                   │
└─────────────────────────────────────────────────┘
```

---

## API Communication

### API Call Pattern

```typescript
// Fetch folders
const fetchFolders = async () => {
  try {
    const response = await fetch(`${API_URL}/folders`)
    const data = await response.json()
    setFolders(data)
  } catch (error) {
    console.error('Error fetching folders:', error)
  }
}

// Fetch documents (all or by folder)
const fetchDocuments = async () => {
  try {
    const response = await fetch(`${API_URL}/documents`)
    const data = await response.json()
    setDocuments(data)
  } catch (error) {
    console.error('Error fetching documents:', error)
  }
}

// Search documents
const searchDocuments = async (query: string) => {
  if (query.length < 2) return
  try {
    const response = await fetch(`${API_URL}/documents/search?query=${query}`)
    const data = await response.json()
    setDocuments(data)
  } catch (error) {
    console.error('Error searching:', error)
  }
}
```

### API Endpoints Used

| Method | Endpoint | Purpose | Triggered By |
|--------|----------|---------|--------------|
| GET | `/api/folders` | Fetch all folders | Page load, after folder creation |
| POST | `/api/folders` | Create new folder | AddFolderModal submit |
| GET | `/api/documents` | Fetch all documents | Page load, back to root |
| GET | `/api/documents?folder_id={id}` | Fetch documents in folder | Folder click |
| GET | `/api/documents/search?query={q}` | Search documents | Search input (min 2 chars) |
| POST | `/api/documents` | Create new document | AddDocumentModal submit |

---

## Component Details

### 1. AddFolderModal

**Purpose:** Create a new folder

**Props:**
```typescript
interface AddFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}
```

**Features:**
- Single-step form
- Input validation (required, max 255 chars)
- Error display
- Auto-populates `created_by` as "Unknown"

**Validation Rules:**
- Folder name: Required, max 255 characters
- No special characters validation (server-side)

---

### 2. AddDocumentModal

**Purpose:** Simulate document upload and create document metadata

**Props:**
```typescript
interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentFolderId: number | null
}
```

**Features:**
- **Two-step process:**
  1. Upload simulation (drag/drop or click)
  2. Form with document details
- Auto-extracts file type from filename
- File size input in bytes
- Supported file types: pdf, docx, xlsx, pptx, txt, jpg, png, zip

**Validation Rules:**
- Document name: Required, must have valid extension
- File size: Positive number, max 100 MB
- File type: Auto-extracted, validated against allowed types

---

### 3. DeleteConfirmModal

**Purpose:** Confirm deletion of folder or document

**Props:**
```typescript
interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  itemType: 'folder' | 'document'
}
```

**Features:**
- Warning message
- Displays item name and type
- Confirm/Cancel buttons
- Visual warning styling

---

## User Interactions & Flow

### Folder Navigation Flow

```
1. User at Root Level
   ├─ See: All folders + root-level documents
   ├─ Can: Click folder to view its contents
   └─ Can: Create new folder

2. User Clicks Folder
   ├─ currentFolderId = folder.id
   ├─ fetchDocumentsByFolder(folder.id)
   ├─ Breadcrumb: "Root > Folder Name"
   └─ See: Documents in that folder only

3. User Clicks "← Back"
   ├─ setCurrentFolderId(null)
   ├─ fetchDocuments()
   ├─ fetchFolders()
   └─ Return to root view
```

### Search Flow

```
1. User Types in Search Box
   ├─ If query.length < 2: Show all documents
   └─ If query.length >= 2:
       ├─ Call searchDocuments(query)
       ├─ Filter documents client-side
       └─ Display matching results

2. User Clicks "Clear Search"
   ├─ setSearchQuery('')
   ├─ Restore original view
   └─ Reset to page 1
```

### Document Creation Flow

```
1. User Clicks "📤 Upload files"
   └─ Open AddDocumentModal

2. Step 1: Upload Simulation
   └─ User drags file or clicks area
       └─ Proceed to Step 2

3. Step 2: Document Details Form
   ├─ User enters: filename (with extension), size in bytes
   ├─ File type auto-extracted from filename
   ├─ Folder_id = currentFolderId or 1 (root)
   └─ Submit

4. Validation
   ├─ Check: name has valid extension
   ├─ Check: size > 0 and <= 100MB
   └─ If valid: POST /api/documents

5. Success
   ├─ Close modal
   ├─ Refresh documents list
   └─ Show new document in table
```

---

## Key Features

### 1. Real-time UI Updates
- After creating folder/document, list refreshes automatically
- No page reload required

### 2. Client-side Filtering & Sorting
- Search filters documents by name
- Sort by name (A-Z or Z-A)
- Pagination (10 items per page)

### 3. Breadcrumb Navigation
- Always shows current location
- "Root" or "Root > Folder Name"
- Easy navigation back to root

### 4. Responsive Table
- Folder cards for folder view
- Document table with columns:
  - Name
  - Type (icon + extension)
  - Size (formatted: KB, MB)
  - Folder (when viewing all documents)
  - Created By
  - Created At
  - Actions (Delete)

---

## Styling Architecture

### SCSS Structure

```scss
// Global styles in globals.scss

// Color variables
$primary-color: #007bff
$danger-color: #dc3545
$background: #f5f7fa

// Layout
.container {
  max-width: 1200px
  margin: 0 auto
  padding: 2rem
}

// Components
.modal-overlay { ... }
.modal-content { ... }
.table { ... }
.folder-card { ... }
.btn { ... }
```

### Design Patterns
- **BEM-style naming** for clarity
- **Scoped styles** via component classes
- **CSS Variables** for theming
- **Mobile-first** responsive design

---

## Component Props & Interfaces

### TypeScript Interfaces

```typescript
interface Folder {
  id: number
  name: string
  created_by: string
  created_at: string
}

interface Document {
  id: number
  name: string
  file_type: string
  size: number
  folder_id: number
  created_by: string
  created_at: string
}
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         ↓
┌─────────────────┐     ┌──────────────┐
│   Event Handler │────→│ State Update │
└─────────────────┘     └──────┬───────┘
         ↓                      ↓
┌─────────────────┐     ┌──────────────┐
│   API Call      │     │  Re-render   │
└────────┬────────┘     └──────────────┘
         ↓
┌─────────────────┐
│ Backend Server  │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Database      │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Response      │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Update State    │
└────────┬────────┘
         ↓
┌─────────────────┐
│   UI Update     │
└─────────────────┘
```

---

## Frontend Best Practices

- **Component-based architecture** - Reusable, modular components
- **TypeScript** - Type safety throughout
- **State management** - Centralized in main page component
- **Error handling** - Try-catch on all API calls
- **Loading states** - Disable buttons during submission
- **Form validation** - Client-side + server-side
- **Responsive design** - Works on all screen sizes
- **Clean code** - Consistent formatting, meaningful names
- **SCSS organization** - Global styles, scoped components
- **Accessibility** - Semantic HTML, ARIA labels

---

## Next.js App Router Features Used

1. **Server Components** (default) - Optimized performance
2. **Client Components** (`'use client'`) - For interactivity
3. **File-based routing** - `app/page.tsx` = `/`
4. **Layout system** - `app/layout.tsx` wraps all pages
5. **TypeScript support** - Built-in, no extra config
6. **Fast Refresh** - Instant feedback during development

---

## Performance Optimizations

- **Pagination** - Only 10 items shown at once
- **Debounced search** - Could be added to reduce API calls
- **Conditional rendering** - Modals only render when open
- **useState for local state** - Fast, no external dependencies
- **Fetch API** - Native, no axios overhead
