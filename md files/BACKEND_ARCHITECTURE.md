# 🏗️ Backend Architecture Documentation

## Overview

This backend follows **Enterprise-Grade 3-Tier Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Frontend)                    │
└─────────────────────────────────────────────────────────┘
                           ↓ HTTP Requests
┌─────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER (Routes)              │
│  - Define API endpoints                                  │
│  - Route HTTP requests to controllers                    │
│  Files: folderRoutes.ts, documentRoutes.ts              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (Controllers)             │
│  - Handle HTTP requests/responses                        │
│  - Parse request data                                    │
│  - Call service layer                                    │
│  - Format responses                                      │
│  Files: folderController.ts, documentController.ts      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│               BUSINESS LOGIC LAYER (Services)            │
│  - Implement business rules                              │
│  - Validate input data                                   │
│  - Coordinate between DAOs                               │
│  - Handle business logic errors                          │
│  Files: folderService.ts, documentService.ts            │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              DATA ACCESS LAYER (DAOs)                    │
│  - Execute database queries                              │
│  - Map database results to TypeScript types              │
│  - No business logic                                     │
│  Files: folderDAO.ts, documentDAO.ts                    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   DATABASE (MySQL)                       │
│  - Store data persistently                               │
│  - Enforce data integrity with constraints               │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts           # MySQL connection pool configuration
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces and DTOs
│   │
│   ├── dao/                       # DATA ACCESS LAYER
│   │   ├── folderDAO.ts           # Folder database operations
│   │   └── documentDAO.ts         # Document database operations
│   │
│   ├── services/                  # BUSINESS LOGIC LAYER
│   │   ├── folderService.ts       # Folder business logic
│   │   └── documentService.ts     # Document business logic
│   │
│   ├── controllers/               # APPLICATION LAYER
│   │   ├── folderController.ts    # Folder HTTP handlers
│   │   └── documentController.ts  # Document HTTP handlers
│   │
│   ├── routes/                    # PRESENTATION LAYER
│   │   ├── folderRoutes.ts        # Folder API endpoints
│   │   └── documentRoutes.ts      # Document API endpoints
│   │
│   └── server.ts                  # Express app setup and server start
│
├── .env                           # Environment variables (NOT in git)
├── .env.example                   # Environment template
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

---

## 🔄 Request Flow Example

### Example: Creating a New Document

```
1. CLIENT sends POST request:
   POST http://localhost:3001/api/documents
   Body: { name: "Report.pdf", folder_id: 1, file_type: "pdf", size: 2048 }
   
2. ROUTE (documentRoutes.ts)
   router.post('/', createDocument)
   → Routes request to controller
   
3. CONTROLLER (documentController.ts)
   export const createDocument = async (req, res) => {
     const { name, folder_id, file_type, size } = req.body;
     const result = await documentService.createDocument({ ... });
     res.status(201).json(result);
   }
   → Extracts data, calls service, sends response
   
4. SERVICE (documentService.ts)
   async createDocument(data) {
     // Validate: name not empty
     // Validate: folder exists (calls folderDAO)
     // Validate: size > 0
     // Sanitize: trim name, lowercase file_type
     const id = await documentDAO.create(data);
     return { id, name };
   }
   → Applies business rules, coordinates DAOs
   
5. DAO (documentDAO.ts)
   async create(data) {
     const [result] = await pool.query(
       'INSERT INTO documents (...) VALUES (...)',
       [data.name, data.folder_id, data.file_type, data.size]
     );
     return result.insertId;
   }
   → Executes SQL query, returns ID
   
6. DATABASE (MySQL)
   → Stores document record
   → Returns insertId
   
7. Response flows back up the chain:
   DAO → Service → Controller → Route → CLIENT
   
8. CLIENT receives:
   Status: 201 Created
   Body: { id: 7, name: "Report.pdf", message: "Document created successfully" }
```

---

## 📋 Layer Responsibilities

### **1. Routes (Presentation Layer)**

**Purpose:** Define API endpoints and route requests

**Responsibilities:**
- Map HTTP methods to controller functions
- Define URL patterns
- Group related endpoints

**What it DOES:**
```typescript
router.post('/', createDocument);  // POST /api/documents → createDocument()
router.get('/', getAllDocuments);  // GET /api/documents → getAllDocuments()
```

**What it DOESN'T do:**
- ❌ Validate input
- ❌ Execute business logic
- ❌ Query database
- ❌ Handle errors

---

### **2. Controllers (Application Layer)**

**Purpose:** Handle HTTP requests and responses

**Responsibilities:**
- Parse request data (body, params, query)
- Call appropriate service methods
- Format HTTP responses
- Map errors to appropriate status codes
- Log controller-level events

**What it DOES:**
```typescript
export const createDocument = async (req: Request, res: Response) => {
  try {
    const { name, folder_id, file_type, size } = req.body;
    const result = await documentService.createDocument({ ... });
    res.status(201).json(result);
  } catch (error) {
    const statusCode = /* determine from error */;
    res.status(statusCode).json({ error: error.message });
  }
};
```

**What it DOESN'T do:**
- ❌ Validate business rules
- ❌ Query database directly
- ❌ Implement complex logic

---

### **3. Services (Business Logic Layer)**

**Purpose:** Implement business rules and orchestrate operations

**Responsibilities:**
- Validate input according to business rules
- Coordinate multiple DAO operations
- Implement domain logic
- Handle business-level errors
- Sanitize/transform data

**What it DOES:**
```typescript
async createDocument(data: CreateDocumentDTO) {
  // Business validation
  if (!data.name || data.name.trim() === '') {
    throw new Error('Document name is required');
  }
  
  if (data.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  
  // Verify folder exists (cross-DAO coordination)
  const folderExists = await this.folderDAO.exists(data.folder_id);
  if (!folderExists) {
    throw new Error('Folder not found');
  }
  
  // Sanitize
  const sanitized = { ...data, name: data.name.trim() };
  
  // Create via DAO
  return await this.documentDAO.create(sanitized);
}
```

**What it DOESN'T do:**
- ❌ Handle HTTP requests/responses
- ❌ Write SQL queries

---

### **4. DAOs (Data Access Layer)**

**Purpose:** Abstract database operations

**Responsibilities:**
- Execute SQL queries
- Map database results to TypeScript types
- Handle database-specific errors
- Provide CRUD methods

**What it DOES:**
```typescript
async create(data: CreateDocumentDTO): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO documents (name, folder_id, file_type, size) VALUES (?, ?, ?, ?)',
    [data.name, data.folder_id, data.file_type, data.size]
  );
  return result.insertId;
}

async findById(id: number): Promise<Document | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM documents WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] as Document : null;
}
```

**What it DOESN'T do:**
- ❌ Validate business rules
- ❌ Check if folder exists (that's service's job)
- ❌ Transform/sanitize data (just execute queries)

---

## 🎯 Benefits of This Architecture

### **1. Separation of Concerns**
Each layer has a single, well-defined responsibility

### **2. Testability**
- DAO: Mock database
- Service: Mock DAO
- Controller: Mock service

### **3. Maintainability**
- Change database? Update DAOs only
- Change business rules? Update services only
- Change API format? Update controllers only

### **4. Reusability**
Services can be used by:
- HTTP controllers
- WebSocket handlers
- CLI commands
- Background jobs

### **5. Scalability**
- Easy to add new features
- Clear where to add code
- Team can work on different layers simultaneously

---

## 🔍 Code Examples

### Complete Flow: Get All Folders

**Route (folderRoutes.ts):**
```typescript
router.get('/', getAllFolders);
```

**Controller (folderController.ts):**
```typescript
export const getAllFolders = async (req: Request, res: Response) => {
  try {
    const folders = await folderService.getAllFolders();
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Service (folderService.ts):**
```typescript
async getAllFolders(): Promise<Folder[]> {
  try {
    return await this.folderDAO.findAll();
  } catch (error) {
    console.error('Service error:', error);
    throw new Error('Failed to retrieve folders');
  }
}
```

**DAO (folderDAO.ts):**
```typescript
async findAll(): Promise<Folder[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, created_at FROM folders ORDER BY created_at DESC'
  );
  return rows as Folder[];
}
```

---

## 📚 Design Patterns Used

### **1. Repository Pattern**
DAOs act as repositories providing abstraction over data storage

### **2. Service Layer Pattern**
Services encapsulate business logic separate from presentation

### **3. Dependency Injection**
Services receive DAO instances (via constructor)

### **4. DTO Pattern**
Data Transfer Objects define contracts between layers

### **5. Single Responsibility Principle**
Each class/function has one reason to change

---

## 🔐 Error Handling Strategy

### **DAO Layer:**
- Throws database errors
- No error transformation

### **Service Layer:**
- Catches DAO errors
- Throws business-specific errors with meaningful messages
- Logs errors

### **Controller Layer:**
- Catches service errors
- Maps to appropriate HTTP status codes:
  - 400: Validation errors (required, invalid, etc.)
  - 404: Not found errors
  - 500: Unexpected errors
- Sends JSON error responses

---

## 📖 Type Definitions

All shared types are defined in `src/types/index.ts`:

```typescript
// Database entities
export interface Folder {
  id: number;
  name: string;
  created_at: Date;
}

export interface Document {
  id: number;
  name: string;
  folder_id: number;
  file_type: string;
  size: number;
  created_at: Date;
}

// DTOs for creating entities
export interface CreateFolderDTO {
  name: string;
}

export interface CreateDocumentDTO {
  name: string;
  folder_id: number;
  file_type: string;
  size: number;
}
```

---

## 🧪 Testing Strategy

With this architecture, each layer can be tested independently:

### **Unit Tests:**
- **DAOs:** Mock database connection
- **Services:** Mock DAOs
- **Controllers:** Mock services

### **Integration Tests:**
- Test complete flow from route to database

### **Example (Service Test):**
```typescript
describe('DocumentService', () => {
  it('should create document when folder exists', async () => {
    // Mock DAOs
    const mockFolderDAO = { exists: jest.fn().mockResolvedValue(true) };
    const mockDocumentDAO = { create: jest.fn().mockResolvedValue(1) };
    
    // Test service with mocked dependencies
    const service = new DocumentService();
    const result = await service.createDocument({ ... });
    
    expect(result.id).toBe(1);
  });
});
```

---

## 🎓 Learning Resources

This architecture follows industry-standard patterns:

- **Martin Fowler**: Patterns of Enterprise Application Architecture
- **Uncle Bob**: Clean Architecture
- **Microsoft**: .NET Architecture Guides
- **Spring Framework**: Java Enterprise Patterns

---

## ✅ Architecture Review Checklist

- [x] Routes only define endpoints
- [x] Controllers only handle HTTP
- [x] Services contain all business logic
- [x] DAOs only execute SQL queries
- [x] Types are clearly defined
- [x] Each layer properly documented with JSDoc
- [x] Error handling at each layer
- [x] Separation of concerns maintained
- [x] No business logic in controllers
- [x] No SQL in services
