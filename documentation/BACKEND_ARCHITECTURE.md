# 🏗️ Backend Architecture Documentation# 🏗️ Backend Architecture Documentation



## Overview## Overview



This backend follows **Enterprise-Grade 4-Layer Architecture** with clear separation of concerns:This backend follows **Enterprise-Grade 4-Layer Architecture** with clear separation of concerns:



``````

┌─────────────────────────────────────────────────────────┐┌─────────────────────────────────────────────────────────┐

│                     CLIENT (Frontend)                    ││                     CLIENT (Frontend)                    │

└─────────────────────────────────────────────────────────┘└─────────────────────────────────────────────────────────┘

                           ↓ HTTP Requests                           ↓ HTTP Requests

┌─────────────────────────────────────────────────────────┐┌─────────────────────────────────────────────────────────┐

│                 PRESENTATION LAYER (Routes)              ││                 PRESENTATION LAYER (Routes)              │

│  - Define API endpoints                                  ││  - Define API endpoints                                  │

│  - Route HTTP requests to controllers                    ││  - Route HTTP requests to controllers                    │

│  Files: folderRoutes.ts, documentRoutes.ts              ││  Files: folderRoutes.ts, documentRoutes.ts              │

└─────────────────────────────────────────────────────────┘└─────────────────────────────────────────────────────────┘

                           ↓                           ↓

┌─────────────────────────────────────────────────────────┐┌─────────────────────────────────────────────────────────┐

│              APPLICATION LAYER (Controllers)             ││              APPLICATION LAYER (Controllers)             │

│  - Handle HTTP requests/responses                        ││  - Handle HTTP requests/responses                        │

│  - Parse request data                                    ││  - Parse request data                                    │

│  - Call service layer                                    ││  - Call service layer                                    │

│  - Format responses                                      ││  - Format responses                                      │

│  Files: folderController.ts, documentController.ts      ││  Files: folderController.ts, documentController.ts      │

└─────────────────────────────────────────────────────────┘└─────────────────────────────────────────────────────────┘

                           ↓                           ↓

┌─────────────────────────────────────────────────────────┐┌─────────────────────────────────────────────────────────┐

│               BUSINESS LOGIC LAYER (Services)            ││               BUSINESS LOGIC LAYER (Services)            │

│  - Implement business rules                              ││  - Implement business rules                              │

│  - Validate input data                                   ││  - Validate input data                                   │

│  - Coordinate between DAOs                               ││  - Coordinate between DAOs                               │

│  - Handle business logic errors                          ││  - Handle business logic errors                          │

│  Files: folderService.ts, documentService.ts            ││  Files: folderService.ts, documentService.ts            │

└─────────────────────────────────────────────────────────┘└─────────────────────────────────────────────────────────┘

                           ↓                           ↓

┌─────────────────────────────────────────────────────────┐┌─────────────────────────────────────────────────────────┐

│              DATA ACCESS LAYER (DAOs & Mappers)          ││              DATA ACCESS LAYER (DAOs)                    │

│  - Execute database queries                              ││  - Execute database queries                              │

│  - Map database results to TypeScript types              ││  - Map database results to TypeScript types              │

│  - SQL query definitions (Mappers)                       ││  - No business logic                                     │

│  Files: folderDAO.ts, documentDAO.ts                    ││  Files: folderDAO.ts, documentDAO.ts                    │

│         folderMapper.ts, documentMapper.ts              │└─────────────────────────────────────────────────────────┘

└─────────────────────────────────────────────────────────┘                           ↓

                           ↓┌─────────────────────────────────────────────────────────┐

┌─────────────────────────────────────────────────────────┐│                   DATABASE (MySQL)                       │

│                   DATABASE (MySQL)                       ││  - Store data persistently                               │

│  - Store data persistently                               ││  - Enforce data integrity with constraints               │

│  - Enforce data integrity with constraints               │└─────────────────────────────────────────────────────────┘

└─────────────────────────────────────────────────────────┘```

```

---

---

## 📂 Project Structure

## 📊 Complete System Architecture Diagram

```

```backend/

┌────────────────────────────────────────────────────────────────┐├── src/

│                          CLIENT                                 ││   ├── config/

│                     (Next.js Frontend)                          ││   │   └── database.ts           # MySQL connection pool configuration

│                    http://localhost:3000                        ││   │

└────────────────────────────────────────────────────────────────┘│   ├── types/

                              ││   │   └── index.ts               # TypeScript interfaces and DTOs

                              │ HTTP/REST API│   │

                              ▼│   ├── dao/                       # DATA ACCESS LAYER

┌────────────────────────────────────────────────────────────────┐│   │   ├── folderDAO.ts           # Folder database operations

│                      BACKEND SERVER                             ││   │   └── documentDAO.ts         # Document database operations

│                    (Express + TypeScript)                       ││   │

│                    http://localhost:3001                        ││   ├── services/                  # BUSINESS LOGIC LAYER

│                                                                  ││   │   ├── folderService.ts       # Folder business logic

│  ┌──────────────────────────────────────────────────────────┐  ││   │   └── documentService.ts     # Document business logic

│  │              PRESENTATION LAYER (Routes)                  │  ││   │

│  │                                                            │  ││   ├── controllers/               # APPLICATION LAYER

│  │  folderRoutes.ts        documentRoutes.ts                 │  ││   │   ├── folderController.ts    # Folder HTTP handlers

│  │  ├─ GET /api/folders    ├─ GET /api/documents            │  ││   │   └── documentController.ts  # Document HTTP handlers

│  │  └─ POST /api/folders   ├─ POST /api/documents           │  ││   │

│  │                          ├─ GET /api/documents/folder/:id │  ││   ├── routes/                    # PRESENTATION LAYER

│  │                          └─ GET /api/documents/search     │  ││   │   ├── folderRoutes.ts        # Folder API endpoints

│  └──────────────────────────────────────────────────────────┘  ││   │   └── documentRoutes.ts      # Document API endpoints

│                              │                                   ││   │

│  ┌──────────────────────────────────────────────────────────┐  ││   └── server.ts                  # Express app setup and server start

│  │           APPLICATION LAYER (Controllers)                 │  ││

│  │                                                            │  │├── .env                           # Environment variables (NOT in git)

│  │  folderController.ts    documentController.ts             │  │├── .env.example                   # Environment template

│  │  ├─ getAllFolders()     ├─ getAllDocuments()             │  │├── tsconfig.json                  # TypeScript configuration

│  │  └─ createFolder()      ├─ getDocumentsByFolder()        │  │└── package.json                   # Dependencies and scripts

│  │                          ├─ createDocument()              │  │```

│  │                          └─ searchDocuments()             │  │

│  └──────────────────────────────────────────────────────────┘  │---

│                              │                                   │

│  ┌──────────────────────────────────────────────────────────┐  │## 🔄 Request Flow Example

│  │         BUSINESS LOGIC LAYER (Services)                   │  │

│  │                                                            │  │### Example: Creating a New Document

│  │  FolderService          DocumentService                   │  │

│  │  ├─ getAllFolders()     ├─ getAllDocuments()             │  │```

│  │  ├─ createFolder()      ├─ getByFolder()                 │  │1. CLIENT sends POST request:

│  │  ├─ folderExists()      ├─ createDocument()              │  │   POST http://localhost:3001/api/documents

│  │  └─ validateName()      ├─ searchDocuments()             │  │   Body: { name: "Report.pdf", folder_id: 1, file_type: "pdf", size: 2048 }

│  │                          └─ validateDocument()            │  │   

│  │                                                            │  │2. ROUTE (documentRoutes.ts)

│  │  • Validates input                                         │  │   router.post('/', createDocument)

│  │  • Applies business rules                                  │  │   → Routes request to controller

│  │  • Coordinates DAOs                                        │  │   

│  └──────────────────────────────────────────────────────────┘  │3. CONTROLLER (documentController.ts)

│                              │                                   │   export const createDocument = async (req, res) => {

│  ┌──────────────────────────────────────────────────────────┐  │     const { name, folder_id, file_type, size } = req.body;

│  │          DATA ACCESS LAYER (DAOs & Mappers)               │  │     const result = await documentService.createDocument({ ... });

│  │                                                            │  │     res.status(201).json(result);

│  │  FolderDAO              DocumentDAO                       │  │   }

│  │  ├─ findAll()           ├─ findAll()                      │  │   → Extracts data, calls service, sends response

│  │  ├─ findById()          ├─ findById()                     │  │   

│  │  ├─ create()            ├─ findByFolderId()              │  │4. SERVICE (documentService.ts)

│  │  └─ exists()            ├─ searchByName()                │  │   async createDocument(data) {

│  │                          └─ create()                       │  │     // Validate: name not empty

│  │                                                            │  │     // Validate: folder exists (calls folderDAO)

│  │  Mappers (SQL Queries)                                     │  │     // Validate: size > 0

│  │  • folderMapper.ts - SQL for folders                      │  │     // Sanitize: trim name, lowercase file_type

│  │  • documentMapper.ts - SQL for documents                  │  │     const id = await documentDAO.create(data);

│  │                                                            │  │     return { id, name };

│  │  • Executes SQL queries only                              │  │   }

│  │  • Maps DB results to TypeScript                          │  │   → Applies business rules, coordinates DAOs

│  └──────────────────────────────────────────────────────────┘  │   

│                              │                                   │5. DAO (documentDAO.ts)

│  ┌──────────────────────────────────────────────────────────┐  │   async create(data) {

│  │            DATABASE CONFIG (Connection Pool)              │  │     const [result] = await pool.query(

│  │                                                            │  │       'INSERT INTO documents (...) VALUES (...)',

│  │  database.ts - MySQL connection pool                      │  │       [data.name, data.folder_id, data.file_type, data.size]

│  │  • Host: localhost                                         │  │     );

│  │  • Port: 3300                                              │  │     return result.insertId;

│  │  • Pool size: 10 connections                               │  │   }

│  └──────────────────────────────────────────────────────────┘  │   → Executes SQL query, returns ID

└────────────────────────────────────────────────────────────────┘   

                              │6. DATABASE (MySQL)

                              ▼   → Stores document record

┌────────────────────────────────────────────────────────────────┐   → Returns insertId

│                      MySQL DATABASE                             │   

│                        Port 3300                                │7. Response flows back up the chain:

│                                                                  │   DAO → Service → Controller → Route → CLIENT

│  ┌─────────────┐                ┌──────────────┐               │   

│  │   folders   │                │  documents   │               │8. CLIENT receives:

│  ├─────────────┤                ├──────────────┤               │   Status: 201 Created

│  │ id (PK)     │◄───────────────│ id (PK)      │               │   Body: { id: 7, name: "Report.pdf", message: "Document created successfully" }

│  │ name        │ One-to-Many    │ name         │               │```

│  │ created_by  │                │ folder_id(FK)│               │

│  │ created_at  │                │ file_type    │               │---

│  └─────────────┘                │ size         │               │

│                                  │ created_by   │               │## 📋 Layer Responsibilities

│                                  │ created_at   │               │

│                                  └──────────────┘               │### **1. Routes (Presentation Layer)**

└────────────────────────────────────────────────────────────────┘

```**Purpose:** Define API endpoints and route requests



---**Responsibilities:**

- Map HTTP methods to controller functions

## 🔄 Request Flow Sequence Diagram- Define URL patterns

- Group related endpoints

### Example: POST /api/documents (Create Document)

**What it DOES:**

``````typescript

Client          Route          Controller        Service         DAO          Databaserouter.post('/', createDocument);  // POST /api/documents → createDocument()

  │               │                 │               │              │              │router.get('/', getAllDocuments);  // GET /api/documents → getAllDocuments()

  │─POST──────────>│                 │               │              │              │```

  │ /api/docs     │                 │               │              │              │

  │ {name,folder} │                 │               │              │              │**What it DOESN'T do:**

  │               │                 │               │              │              │- ❌ Validate input

  │               │─createDocument─>│               │              │              │- ❌ Execute business logic

  │               │                 │               │              │              │- ❌ Query database

  │               │                 │─validate──────>│              │              │- ❌ Handle errors

  │               │                 │ input         │              │              │

  │               │                 │               │              │              │---

  │               │                 │               │─exists()────>│              │

  │               │                 │               │ folder_id    │              │### **2. Controllers (Application Layer)**

  │               │                 │               │              │              │

  │               │                 │               │              │─SELECT───────>│**Purpose:** Handle HTTP requests and responses

  │               │                 │               │              │ FROM folders │

  │               │                 │               │              │              │**Responsibilities:**

  │               │                 │               │              │<─result──────│- Parse request data (body, params, query)

  │               │                 │               │              │ (true)       │- Call appropriate service methods

  │               │                 │               │<─true────────│              │- Format HTTP responses

  │               │                 │               │              │              │- Map errors to appropriate status codes

  │               │                 │               │─create()────>│              │- Log controller-level events

  │               │                 │               │ sanitized    │              │

  │               │                 │               │ data         │              │**What it DOES:**

  │               │                 │               │              │─INSERT───────>│```typescript

  │               │                 │               │              │ INTO docs    │export const createDocument = async (req: Request, res: Response) => {

  │               │                 │               │              │              │  try {

  │               │                 │               │              │<─insertId────│    const { name, folder_id, file_type, size } = req.body;

  │               │                 │               │              │ (7)          │    const result = await documentService.createDocument({ ... });

  │               │                 │               │<─7───────────│              │    res.status(201).json(result);

  │               │                 │<─{id,name}────│              │              │  } catch (error) {

  │               │<─result─────────│               │              │              │    const statusCode = /* determine from error */;

  │<─201 Created──│                 │               │              │              │    res.status(statusCode).json({ error: error.message });

  │ {id:7,msg}    │                 │               │              │              │  }

  │               │                 │               │              │              │};

``````



---**What it DOESN'T do:**

- ❌ Validate business rules

## 📂 Project Structure- ❌ Query database directly

- ❌ Implement complex logic

```

backend/---

├── src/

│   ├── config/### **3. Services (Business Logic Layer)**

│   │   └── database.ts           # MySQL connection pool configuration

│   │**Purpose:** Implement business rules and orchestrate operations

│   ├── models/

│   │   └── index.ts               # TypeScript interfaces and types**Responsibilities:**

│   │- Validate input according to business rules

│   ├── mappers/                   # SQL QUERY DEFINITIONS- Coordinate multiple DAO operations

│   │   ├── folderMapper.ts        # SQL queries for folders- Implement domain logic

│   │   ├── documentMapper.ts      # SQL queries for documents- Handle business-level errors

│   │   └── index.ts               # Mapper exports- Sanitize/transform data

│   │

│   ├── dao/                       # DATA ACCESS LAYER**What it DOES:**

│   │   ├── folderDAO.ts           # Folder database operations```typescript

│   │   └── documentDAO.ts         # Document database operationsasync createDocument(data: CreateDocumentDTO) {

│   │  // Business validation

│   ├── services/                  # BUSINESS LOGIC LAYER  if (!data.name || data.name.trim() === '') {

│   │   ├── folderService.ts       # Folder business logic    throw new Error('Document name is required');

│   │   └── documentService.ts     # Document business logic  }

│   │  

│   ├── controllers/               # APPLICATION LAYER  if (data.size > MAX_FILE_SIZE) {

│   │   ├── folderController.ts    # Folder HTTP handlers    throw new Error('File too large');

│   │   └── documentController.ts  # Document HTTP handlers  }

│   │  

│   ├── routes/                    # PRESENTATION LAYER  // Verify folder exists (cross-DAO coordination)

│   │   ├── folderRoutes.ts        # Folder API endpoints  const folderExists = await this.folderDAO.exists(data.folder_id);

│   │   └── documentRoutes.ts      # Document API endpoints  if (!folderExists) {

│   │    throw new Error('Folder not found');

│   └── server.ts                  # Express app setup and server start  }

│  

├── .env                           # Environment variables (NOT in git)  // Sanitize

├── .env.example                   # Environment template  const sanitized = { ...data, name: data.name.trim() };

├── tsconfig.json                  # TypeScript configuration  

└── package.json                   # Dependencies and scripts  // Create via DAO

```  return await this.documentDAO.create(sanitized);

}

---```



## 📋 Layer Responsibilities**What it DOESN'T do:**

- ❌ Handle HTTP requests/responses

### **1. Routes (Presentation Layer)**- ❌ Write SQL queries



**Purpose:** Define API endpoints and route requests---



**Responsibilities:**### **4. DAOs (Data Access Layer)**

- Map HTTP methods to controller functions

- Define URL patterns**Purpose:** Abstract database operations

- Group related endpoints

**Responsibilities:**

**Example:**- Execute SQL queries

```typescript- Map database results to TypeScript types

// documentRoutes.ts- Handle database-specific errors

router.get('/', getAllDocuments);- Provide CRUD methods

router.get('/folder/:id', getDocumentsByFolder);

router.get('/search', searchDocuments);**What it DOES:**

router.post('/', createDocument);```typescript

```async create(data: CreateDocumentDTO): Promise<number> {

  const [result] = await pool.query<ResultSetHeader>(

**What it DOESN'T do:**    'INSERT INTO documents (name, folder_id, file_type, size) VALUES (?, ?, ?, ?)',

- ❌ Validate input    [data.name, data.folder_id, data.file_type, data.size]

- ❌ Execute business logic  );

- ❌ Query database  return result.insertId;

}

---

async findById(id: number): Promise<Document | null> {

### **2. Controllers (Application Layer)**  const [rows] = await pool.query<RowDataPacket[]>(

    'SELECT * FROM documents WHERE id = ?',

**Purpose:** Handle HTTP requests and responses    [id]

  );

**Responsibilities:**  return rows.length > 0 ? rows[0] as Document : null;

- Parse request data (body, params, query)}

- Call appropriate service methods```

- Format HTTP responses

- Map errors to appropriate status codes**What it DOESN'T do:**

- ❌ Validate business rules

**Example:**- ❌ Check if folder exists (that's service's job)

```typescript- ❌ Transform/sanitize data (just execute queries)

// documentController.ts

export const createDocument = async (req: Request, res: Response) => {---

  try {

    const { name, folder_id, file_type, size, created_by } = req.body;## 🎯 Benefits of This Architecture

    const result = await documentService.createDocument({

      name,### **1. Separation of Concerns**

      folder_id,Each layer has a single, well-defined responsibility

      file_type,

      size,### **2. Testability**

      created_by- DAO: Mock database

    });- Service: Mock DAO

    res.status(201).json(result);- Controller: Mock service

  } catch (error: any) {

    const statusCode = error.message.includes('not found') ? 404 : 400;### **3. Maintainability**

    res.status(statusCode).json({ error: error.message });- Change database? Update DAOs only

  }- Change business rules? Update services only

};- Change API format? Update controllers only

```

### **4. Reusability**

**What it DOESN'T do:**Services can be used by:

- ❌ Validate business rules- HTTP controllers

- ❌ Query database directly- WebSocket handlers

- ❌ Implement complex logic- CLI commands

- Background jobs

---

### **5. Scalability**

### **3. Services (Business Logic Layer)**- Easy to add new features

- Clear where to add code

**Purpose:** Implement business rules and orchestrate operations- Team can work on different layers simultaneously



**Responsibilities:**---

- Validate input according to business rules

- Coordinate multiple DAO operations## 🔍 Code Examples

- Implement domain logic

- Sanitize/transform data### Complete Flow: Get All Folders



**Example:****Route (folderRoutes.ts):**

```typescript```typescript

// documentService.tsrouter.get('/', getAllFolders);

async createDocument(data: any) {```

  // Business validation

  if (!data.name?.trim()) {**Controller (folderController.ts):**

    throw new Error('Document name is required');```typescript

  }export const getAllFolders = async (req: Request, res: Response) => {

    try {

  if (data.size <= 0 || data.size > 100 * 1024 * 1024) {    const folders = await folderService.getAllFolders();

    throw new Error('Invalid file size');    res.status(200).json(folders);

  }  } catch (error) {

      res.status(500).json({ error: error.message });

  // Verify folder exists (cross-DAO coordination)  }

  const folderExists = await folderDAO.exists(data.folder_id);};

  if (!folderExists) {```

    throw new Error('Folder not found');

  }**Service (folderService.ts):**

  ```typescript

  // Sanitizeasync getAllFolders(): Promise<Folder[]> {

  const sanitized = {  try {

    ...data,    return await this.folderDAO.findAll();

    name: data.name.trim(),  } catch (error) {

    file_type: data.file_type.toLowerCase(),    console.error('Service error:', error);

    created_by: data.created_by || 'Unknown'    throw new Error('Failed to retrieve folders');

  };  }

  }

  // Create via DAO```

  const id = await documentDAO.create(sanitized);

  return { id, name: sanitized.name };**DAO (folderDAO.ts):**

}```typescript

```async findAll(): Promise<Folder[]> {

  const [rows] = await pool.query<RowDataPacket[]>(

**What it DOESN'T do:**    'SELECT id, name, created_at FROM folders ORDER BY created_at DESC'

- ❌ Handle HTTP requests/responses  );

- ❌ Write SQL queries  return rows as Folder[];

}

---```



### **4. DAOs & Mappers (Data Access Layer)**---



**Purpose:** Abstract database operations## 📚 Design Patterns Used



**Responsibilities:**### **1. Repository Pattern**

- Execute SQL queries (defined in Mappers)DAOs act as repositories providing abstraction over data storage

- Map database results to TypeScript types

- Handle database-specific errors### **2. Service Layer Pattern**

Services encapsulate business logic separate from presentation

**Example:**

```typescript### **3. Dependency Injection**

// documentDAO.tsServices receive DAO instances (via constructor)

import { documentMapper } from '../mappers';

### **4. DTO Pattern**

async create(data: any): Promise<number> {Data Transfer Objects define contracts between layers

  const [result] = await pool.query<ResultSetHeader>(

    documentMapper.CREATE,### **5. Single Responsibility Principle**

    [data.name, data.folder_id, data.file_type, data.size, data.created_by]Each class/function has one reason to change

  );

  return result.insertId;---

}

## 🔐 Error Handling Strategy

async findByFolderId(folderId: number): Promise<any[]> {

  const [rows] = await pool.query<RowDataPacket[]>(### **DAO Layer:**

    documentMapper.FIND_BY_FOLDER,- Throws database errors

    [folderId]- No error transformation

  );

  return rows;### **Service Layer:**

}- Catches DAO errors

```- Throws business-specific errors with meaningful messages

- Logs errors

```typescript

// documentMapper.ts### **Controller Layer:**

export const documentMapper = {- Catches service errors

  FIND_ALL: 'SELECT * FROM documents ORDER BY created_at DESC',- Maps to appropriate HTTP status codes:

  FIND_BY_FOLDER: 'SELECT * FROM documents WHERE folder_id = ? ORDER BY created_at DESC',  - 400: Validation errors (required, invalid, etc.)

  SEARCH: 'SELECT * FROM documents WHERE name LIKE ? ORDER BY created_at DESC',  - 404: Not found errors

  CREATE: 'INSERT INTO documents (name, folder_id, file_type, size, created_by) VALUES (?, ?, ?, ?, ?)'  - 500: Unexpected errors

};- Sends JSON error responses

```

---

**What it DOESN'T do:**

- ❌ Validate business rules## 📖 Type Definitions

- ❌ Transform/sanitize data (just execute queries)

All shared types are defined in `src/types/index.ts`:

---

```typescript

## 🎯 Benefits of This Architecture// Database entities

export interface Folder {

### **1. Separation of Concerns**  id: number;

Each layer has a single, well-defined responsibility  name: string;

  created_at: Date;

### **2. Testability**}

- Mappers: Test SQL syntax

- DAO: Mock databaseexport interface Document {

- Service: Mock DAO  id: number;

- Controller: Mock service  name: string;

  folder_id: number;

### **3. Maintainability**  file_type: string;

- Change database? Update DAOs & Mappers only  size: number;

- Change business rules? Update services only  created_at: Date;

- Change API format? Update controllers only}

- SQL changes? Update Mappers only

// DTOs for creating entities

### **4. Reusability**export interface CreateFolderDTO {

Services can be used by:  name: string;

- HTTP controllers}

- WebSocket handlers

- CLI commandsexport interface CreateDocumentDTO {

- Background jobs  name: string;

  folder_id: number;

### **5. Scalability**  file_type: string;

- Easy to add new features  size: number;

- Clear where to add code}

- Team can work on different layers simultaneously```



------



## 🔐 Error Handling Strategy## 🧪 Testing Strategy



### **Mapper Layer:**With this architecture, each layer can be tested independently:

- Defines SQL queries as constants

- No error handling (just query strings)### **Unit Tests:**

- **DAOs:** Mock database connection

### **DAO Layer:**- **Services:** Mock DAOs

- Throws database errors- **Controllers:** Mock services

- No error transformation

### **Integration Tests:**

### **Service Layer:**- Test complete flow from route to database

- Catches DAO errors

- Throws business-specific errors with meaningful messages### **Example (Service Test):**

- Validates all business rules```typescript

describe('DocumentService', () => {

### **Controller Layer:**  it('should create document when folder exists', async () => {

- Catches service errors    // Mock DAOs

- Maps to appropriate HTTP status codes:    const mockFolderDAO = { exists: jest.fn().mockResolvedValue(true) };

  - `400`: Validation errors    const mockDocumentDAO = { create: jest.fn().mockResolvedValue(1) };

  - `404`: Resource not found    

  - `500`: Unexpected errors    // Test service with mocked dependencies

- Sends JSON error responses    const service = new DocumentService();

    const result = await service.createDocument({ ... });

---    

    expect(result.id).toBe(1);

## 📖 Type Definitions  });

});

All shared types are defined in `src/models/index.ts`:```



```typescript---

export interface Folder {

  id: number;## 🎓 Learning Resources

  name: string;

  created_by: string;This architecture follows industry-standard patterns:

  created_at: string;

}- **Martin Fowler**: Patterns of Enterprise Application Architecture

- **Uncle Bob**: Clean Architecture

export interface Document {- **Microsoft**: .NET Architecture Guides

  id: number;- **Spring Framework**: Java Enterprise Patterns

  name: string;

  folder_id: number;---

  file_type: string;

  size: number;## ✅ Architecture Review Checklist

  created_by: string;

  created_at: string;- [x] Routes only define endpoints

}- [x] Controllers only handle HTTP

```- [x] Services contain all business logic

- [x] DAOs only execute SQL queries

---- [x] Types are clearly defined

- [x] Each layer properly documented with JSDoc

## ✅ Architecture Best Practices- [x] Error handling at each layer

- [x] Separation of concerns maintained

- ✅ Routes only define endpoints- [x] No business logic in controllers

- ✅ Controllers only handle HTTP- [x] No SQL in services

- ✅ Services contain all business logic
- ✅ DAOs only execute SQL queries
- ✅ Mappers separate SQL from code
- ✅ Types are clearly defined
- ✅ Error handling at each layer
- ✅ Separation of concerns maintained
- ✅ No business logic in controllers
- ✅ No SQL in services or controllers

---

## 🎓 Design Patterns Used

1. **Layered Architecture** - Clear separation into presentation, application, business, and data layers
2. **Repository Pattern** - DAOs act as repositories providing abstraction over data storage
3. **Service Layer Pattern** - Services encapsulate business logic separate from presentation
4. **Mapper Pattern** - SQL queries centralized in mapper files for maintainability
5. **Single Responsibility Principle** - Each class/function has one reason to change
