# API Documentation

Complete reference for all backend API endpoints.

**Base URL:** `http://localhost:3001/api`

---

## Folders Endpoints

### Get All Folders

Retrieves a list of all folders in the system.

**Endpoint:** `GET /api/folders`

**Request:**
```http
GET /api/folders HTTP/1.1
Host: localhost:3001
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Projects",
    "created_at": "2026-01-07T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Reports",
    "created_at": "2026-01-07T10:00:00.000Z"
  },
  {
    "id": 3,
    "name": "Invoices",
    "created_at": "2026-01-07T10:00:00.000Z"
  }
]
```

**Error Responses:**
- `500 Internal Server Error` - Database connection failed

---

### Create Folder

Creates a new folder in the system.

**Endpoint:** `POST /api/folders`

**Request:**
```http
POST /api/folders HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "name": "Legal Documents"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name  | string | Yes | Name of the folder (cannot be empty) |

**Success Response:** `201 Created`
```json
{
  "id": 4,
  "name": "Legal Documents",
  "message": "Folder created successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Folder name is missing or empty
```json
{
  "error": "Folder name is required"
}
```

- `500 Internal Server Error` - Database operation failed
```json
{
  "error": "Failed to create folder"
}
```

---

## Documents Endpoints

### Get All Documents

Retrieves all documents with their associated folder names.

**Endpoint:** `GET /api/documents`

**Request:**
```http
GET /api/documents HTTP/1.1
Host: localhost:3001
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Project Plan.pdf",
    "folder_id": 1,
    "file_type": "pdf",
    "size": 2048,
    "created_at": "2026-01-07T10:01:00.000Z",
    "folder_name": "Projects"
  },
  {
    "id": 2,
    "name": "Budget Report.xlsx",
    "folder_id": 2,
    "file_type": "xlsx",
    "size": 1024,
    "created_at": "2026-01-07T10:02:00.000Z",
    "folder_name": "Reports"
  }
]
```

**Notes:**
- Documents are ordered by creation date (newest first)
- `folder_name` is included via JOIN query
- `size` is in bytes

**Error Responses:**
- `500 Internal Server Error` - Database connection failed

---

### Get Documents by Folder

Retrieves all documents in a specific folder.

**Endpoint:** `GET /api/documents/folder/:folderId`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| folderId  | integer | ID of the folder |

**Request:**
```http
GET /api/documents/folder/1 HTTP/1.1
Host: localhost:3001
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Project Plan.pdf",
    "folder_id": 1,
    "file_type": "pdf",
    "size": 2048,
    "created_at": "2026-01-07T10:01:00.000Z"
  },
  {
    "id": 2,
    "name": "Technical Specification.docx",
    "folder_id": 1,
    "file_type": "docx",
    "size": 4096,
    "created_at": "2026-01-07T10:02:00.000Z"
  }
]
```

**Notes:**
- Returns empty array `[]` if folder has no documents
- Does not validate if folder exists

**Error Responses:**
- `500 Internal Server Error` - Database operation failed

---

### Create Document

Creates a new document in a specific folder.

**Endpoint:** `POST /api/documents`

**Request:**
```http
POST /api/documents HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "name": "Contract.pdf",
  "folder_id": 1,
  "file_type": "pdf",
  "size": 5120
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name  | string | Yes | Document name (e.g., "Report.pdf") |
| folder_id | integer | Yes | ID of the folder to store document in |
| file_type | string | Yes | File extension (e.g., "pdf", "docx", "xlsx") |
| size | integer | Yes | File size in bytes |

**Success Response:** `201 Created`
```json
{
  "id": 7,
  "name": "Contract.pdf",
  "folder_id": 1,
  "file_type": "pdf",
  "size": 5120,
  "message": "Document created successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Missing required fields
```json
{
  "error": "All fields are required: name, folder_id, file_type, size"
}
```

- `404 Not Found` - Folder does not exist
```json
{
  "error": "Folder not found"
}
```

- `500 Internal Server Error` - Database operation failed
```json
{
  "error": "Failed to create document"
}
```

**Notes:**
- Validates that the specified folder exists before creating document
- No actual file is uploaded (metadata only)
- Size should be a positive integer representing bytes

---

### Search Documents

Searches for documents by name or folder name.

**Endpoint:** `GET /api/documents/search`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (case-insensitive, partial matching) |

**Request:**
```http
GET /api/documents/search?q=report HTTP/1.1
Host: localhost:3001
```

**Response:** `200 OK`
```json
[
  {
    "id": 3,
    "name": "Budget Report.xlsx",
    "folder_id": 2,
    "file_type": "xlsx",
    "size": 1024,
    "created_at": "2026-01-07T10:03:00.000Z",
    "folder_name": "Reports"
  },
  {
    "id": 4,
    "name": "Monthly Summary.pdf",
    "folder_id": 2,
    "file_type": "pdf",
    "size": 3072,
    "created_at": "2026-01-07T10:04:00.000Z",
    "folder_name": "Reports"
  }
]
```

**Search Behavior:**
- Searches in document names AND folder names
- Case-insensitive
- Partial matching (e.g., "rep" matches "Report")
- Returns empty array `[]` if no matches found

**Error Responses:**

- `400 Bad Request` - Search query is missing
```json
{
  "error": "Search query is required"
}
```

- `500 Internal Server Error` - Database operation failed
```json
{
  "error": "Failed to search documents"
}
```

**Examples:**
```http
# Search for documents containing "invoice"
GET /api/documents/search?q=invoice

# Search for documents in folders containing "legal"
GET /api/documents/search?q=legal

# Search with URL encoding for spaces
GET /api/documents/search?q=project%20plan
```

---

## Testing with cURL

### Get All Folders
```bash
curl http://localhost:3001/api/folders
```

### Create a Folder
```bash
curl -X POST http://localhost:3001/api/folders \
  -H "Content-Type: application/json" \
  -d '{"name":"Marketing"}'
```

### Get All Documents
```bash
curl http://localhost:3001/api/documents
```

### Get Documents in Folder 1
```bash
curl http://localhost:3001/api/documents/folder/1
```

### Create a Document
```bash
curl -X POST http://localhost:3001/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Proposal.pdf",
    "folder_id":1,
    "file_type":"pdf",
    "size":3072
  }'
```

### Search for Documents
```bash
curl "http://localhost:3001/api/documents/search?q=report"
```

---

## CORS Configuration

The API includes CORS middleware to allow cross-origin requests from the frontend.

**Allowed Origins:** All (`*`)  
**Allowed Methods:** GET, POST  
**Allowed Headers:** Content-Type

---

## HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET request |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid input or missing required fields |
| 404 | Not Found | Resource does not exist |
| 500 | Internal Server Error | Database or server error |

---

## Common Use Cases

### 1. Display all folders and documents on page load
```javascript
// Get folders for sidebar
const folders = await fetch('http://localhost:3001/api/folders').then(r => r.json());

// Get all documents for main view
const documents = await fetch('http://localhost:3001/api/documents').then(r => r.json());
```

### 2. Filter documents by folder
```javascript
// User clicks on folder with id=2
const documents = await fetch('http://localhost:3001/api/documents/folder/2').then(r => r.json());
```

### 3. Create a new folder
```javascript
const response = await fetch('http://localhost:3001/api/folders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'HR Documents' })
});
const result = await response.json();
```

### 4. Search for documents
```javascript
const query = 'budget';
const results = await fetch(`http://localhost:3001/api/documents/search?q=${query}`)
  .then(r => r.json());
```

---

## Development Notes

### Database Connection
- Uses connection pooling for performance
- Maximum 10 concurrent connections
- Connections are automatically released after each query

### Error Handling
- All endpoints have try-catch blocks
- Errors are logged to console
- User-friendly error messages returned
- Sensitive information (like stack traces) not exposed

### Validation
- Required fields validated before database operations
- Folder existence checked before creating documents
- Prevents SQL injection via parameterized queries

---

## Future Enhancements

Potential improvements for v2:
- [ ] Authentication (JWT tokens)
- [ ] Rate limiting
- [ ] Pagination for large datasets
- [ ] Document update/delete endpoints
- [ ] Folder update/delete endpoints
- [ ] Advanced filtering options
- [ ] File metadata validation
- [ ] Request logging middleware

---

**Last Updated:** January 7, 2026  
**API Version:** 1.0.0  
**Backend Framework:** Express.js with TypeScript
