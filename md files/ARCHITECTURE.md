# 🏗️ System Architecture Overview

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                        │
│                    http://localhost:3000                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │ (GET, POST)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js/React)                    │
│                       Port 3000                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Components (UI)                                     │   │
│  │  - FolderList.tsx                                    │   │
│  │  - DocumentCard.tsx                                  │   │
│  │  - AddFolderForm.tsx                                 │   │
│  │  - AddDocumentForm.tsx                               │   │
│  │  - SearchBar.tsx                                     │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │  API Service (services/api.ts)                       │   │
│  │  - folderAPI.getAll()                                │   │
│  │  - folderAPI.create()                                │   │
│  │  - documentAPI.getAll()                              │   │
│  │  - documentAPI.create()                              │   │
│  │  - documentAPI.search()                              │   │
│  └────────────────────┬─────────────────────────────────┘   │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         │ HTTP Requests (axios)
                         │ http://localhost:3001/api/...
                         ↓
┌─────────────────────────────────────────────────────────────┐
│             BACKEND (Node.js/Express)                        │
│                    Port 3001                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Routes (URL Mapping)                                │   │
│  │  GET  /api/folders         → getAllFolders()        │   │
│  │  POST /api/folders         → createFolder()         │   │
│  │  GET  /api/documents       → getAllDocuments()      │   │
│  │  POST /api/documents       → createDocument()       │   │
│  │  GET  /api/documents/search → searchDocuments()     │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │  Controllers (Business Logic)                        │   │
│  │  - folderController.ts                               │   │
│  │  - documentController.ts                             │   │
│  │    • Validate input                                  │   │
│  │    • Query database                                  │   │
│  │    • Return JSON response                            │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │  Database Config (config/database.ts)                │   │
│  │  - Connection pool to MySQL                          │   │
│  │  - Query execution                                   │   │
│  └────────────────────┬─────────────────────────────────┘   │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         │ SQL Queries
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                          │
│                    Port 3306                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Database: documents_management                      │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  folders                                     │    │   │
│  │  │  - id (PK)                                   │    │   │
│  │  │  - name                                      │    │   │
│  │  │  - created_at                                │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  documents                                   │    │   │
│  │  │  - id (PK)                                   │    │   │
│  │  │  - name                                      │    │   │
│  │  │  - folder_id (FK → folders.id)              │    │   │
│  │  │  - file_type                                 │    │   │
│  │  │  - size                                      │    │   │
│  │  │  - created_at                                │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### Example 1: Loading Documents on Page Load

```
1. User opens http://localhost:3000
   ↓
2. Next.js page.tsx loads
   ↓
3. useEffect() hook runs → calls documentAPI.getAll()
   ↓
4. axios sends: GET http://localhost:3001/api/documents
   ↓
5. Express receives request → routes to documentController.getAllDocuments()
   ↓
6. Controller executes: SELECT * FROM documents JOIN folders...
   ↓
7. MySQL returns rows
   ↓
8. Controller sends: res.json(rows)
   ↓
9. Frontend receives JSON array
   ↓
10. setDocuments(data) updates state
    ↓
11. React re-renders → DocumentCard components display
    ↓
12. User sees documents on screen!
```

### Example 2: Adding a New Folder

```
1. User clicks "Add Folder" button
   ↓
2. Form appears (AddFolderForm component)
   ↓
3. User types "Contracts" and clicks "Create Folder"
   ↓
4. Form calls: onAdd({ name: "Contracts" })
   ↓
5. Page calls: folderAPI.create({ name: "Contracts" })
   ↓
6. axios sends: POST http://localhost:3001/api/folders
                with body: {"name":"Contracts"}
   ↓
7. Express receives → routes to folderController.createFolder()
   ↓
8. Controller validates: name is not empty ✓
   ↓
9. Controller executes: INSERT INTO folders (name) VALUES ('Contracts')
   ↓
10. MySQL inserts row, returns insertId (e.g., 4)
    ↓
11. Controller sends: res.json({ id: 4, name: "Contracts", message: "..." })
    ↓
12. Frontend receives response
    ↓
13. Form closes, page reloads data
    ↓
14. New folder appears in sidebar!
```

### Example 3: Searching Documents

```
1. User types "report" in search bar
   ↓
2. User clicks "Search" button
   ↓
3. SearchBar calls: onSearch("report")
   ↓
4. Page calls: documentAPI.search("report")
   ↓
5. axios sends: GET http://localhost:3001/api/documents/search?q=report
   ↓
6. Express receives → routes to documentController.searchDocuments()
   ↓
7. Controller executes: SELECT ... WHERE d.name LIKE '%report%' OR f.name LIKE '%report%'
   ↓
8. MySQL returns matching rows
   ↓
9. Controller sends: res.json(matchingDocuments)
   ↓
10. Frontend receives filtered results
    ↓
11. setDocuments(results) updates state
    ↓
12. React re-renders with filtered documents
    ↓
13. User sees only matching documents!
```

---

## 🗂️ File Relationships

### Backend Files Work Together

```
server.ts (Main Entry Point)
    │
    ├─→ Imports: database.ts (connection)
    ├─→ Imports: folderRoutes.ts
    └─→ Imports: documentRoutes.ts
         │
         ├─→ folderRoutes.ts
         │       │
         │       └─→ Imports: folderController.ts
         │               │
         │               └─→ Uses: database.ts pool
         │
         └─→ documentRoutes.ts
                 │
                 └─→ Imports: documentController.ts
                         │
                         └─→ Uses: database.ts pool
```

### Frontend Files Work Together

```
page.tsx (Main Page)
    │
    ├─→ Imports: types.ts (TypeScript interfaces)
    ├─→ Imports: api.ts (API functions)
    └─→ Imports: All Components
         │
         ├─→ FolderList.tsx
         │       └─→ Uses: Folder type from types.ts
         │
         ├─→ DocumentCard.tsx
         │       └─→ Uses: Document type from types.ts
         │
         ├─→ AddFolderForm.tsx
         │       ├─→ Uses: NewFolder type from types.ts
         │       └─→ Calls: folderAPI.create() from api.ts
         │
         ├─→ AddDocumentForm.tsx
         │       ├─→ Uses: NewDocument, Folder types from types.ts
         │       └─→ Calls: documentAPI.create() from api.ts
         │
         └─→ SearchBar.tsx
                 └─→ Calls: documentAPI.search() from api.ts
```

---

## 🔐 Technology Layers

```
┌────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (What user sees)               │
│  - React Components (JSX/TSX)                      │
│  - Tailwind CSS Styling                            │
│  - User interactions (clicks, forms)               │
└────────────────┬───────────────────────────────────┘
                 │
                 │ Props, State, Events
                 ↓
┌────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Business logic)                │
│  - Next.js (React framework)                       │
│  - State management (useState, useEffect)          │
│  - API calls (axios)                               │
│  - Client-side routing                             │
└────────────────┬───────────────────────────────────┘
                 │
                 │ HTTP/REST API
                 ↓
┌────────────────────────────────────────────────────┐
│  API LAYER (Server endpoints)                      │
│  - Express.js routes                               │
│  - Request handling                                │
│  - Response formatting (JSON)                      │
│  - CORS middleware                                 │
└────────────────┬───────────────────────────────────┘
                 │
                 │ Function calls
                 ↓
┌────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                              │
│  - Controllers (validation, logic)                 │
│  - Error handling                                  │
│  - Data transformation                             │
└────────────────┬───────────────────────────────────┘
                 │
                 │ SQL queries
                 ↓
┌────────────────────────────────────────────────────┐
│  DATA ACCESS LAYER                                 │
│  - mysql2 connection pool                          │
│  - Query execution                                 │
│  - Result mapping                                  │
└────────────────┬───────────────────────────────────┘
                 │
                 │ TCP/IP connection
                 ↓
┌────────────────────────────────────────────────────┐
│  DATABASE LAYER (Persistent storage)               │
│  - MySQL Server                                    │
│  - Tables (folders, documents)                     │
│  - Indexes, Foreign Keys                           │
└────────────────────────────────────────────────────┘
```

---

## 🌐 Network Communication

### Ports Used

```
Port 3000  ←  Frontend (Next.js dev server)
Port 3001  ←  Backend (Express API server)
Port 3306  ←  Database (MySQL server)
```

### HTTP Methods Used

```
GET    → Retrieve data (read-only)
         - GET /api/folders
         - GET /api/documents
         - GET /api/documents/search?q=...

POST   → Create new data
         - POST /api/folders
         - POST /api/documents
```

---

## 🧩 How TypeScript Helps

### Type Safety Flow

```
Frontend types.ts defines:
    interface Document { id: number, name: string, ... }

    ↓

Frontend api.ts promises:
    getAll(): Promise<Document[]>

    ↓

Frontend page.tsx expects:
    const [documents, setDocuments] = useState<Document[]>([])

    ↓

If you try: document.invalidProperty
    ❌ TypeScript error: Property 'invalidProperty' does not exist

    ✅ Catches errors BEFORE running code!
```

---

## 💾 Data Persistence

```
User Action → Frontend State → API Call → Database

Example:
User adds folder "Legal"
    ↓
React state: [... , { id: ?, name: "Legal" }]
    ↓
API call: POST /api/folders { name: "Legal" }
    ↓
MySQL: INSERT INTO folders (name) VALUES ('Legal')
    ↓
Database now has: id=5, name="Legal", created_at=2026-01-07
    ↓
Even if server restarts, data persists in MySQL!
```

---

This architecture follows **separation of concerns** principle:
- Frontend: UI and user interaction
- Backend: Business logic and validation
- Database: Data persistence

Each layer has a specific job, making the code:
- ✅ Easier to understand
- ✅ Easier to test
- ✅ Easier to maintain
- ✅ Easier to scale
