# 🗄️ Database Schema Visualization

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FOLDERS TABLE                           │
├──────────────┬──────────────────┬───────────────────────────────┤
│ Column Name  │ Data Type        │ Constraints                   │
├──────────────┼──────────────────┼───────────────────────────────┤
│ id           │ INT              │ PRIMARY KEY, AUTO_INCREMENT   │
│ name         │ VARCHAR(255)     │ NOT NULL                      │
│ created_at   │ TIMESTAMP        │ DEFAULT CURRENT_TIMESTAMP     │
└──────────────┴──────────────────┴───────────────────────────────┘
                          │
                          │ One-to-Many Relationship
                          │ (One folder has many documents)
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DOCUMENTS TABLE                           │
├──────────────┬──────────────────┬───────────────────────────────┤
│ Column Name  │ Data Type        │ Constraints                   │
├──────────────┼──────────────────┼───────────────────────────────┤
│ id           │ INT              │ PRIMARY KEY, AUTO_INCREMENT   │
│ name         │ VARCHAR(255)     │ NOT NULL                      │
│ folder_id    │ INT              │ NOT NULL, FOREIGN KEY ───────┐│
│ file_type    │ VARCHAR(50)      │ NOT NULL                      ││
│ size         │ INT              │ NOT NULL (bytes)              ││
│ created_at   │ TIMESTAMP        │ DEFAULT CURRENT_TIMESTAMP     ││
└──────────────┴──────────────────┴───────────────────────────────┘│
                                                                   │
                                   References folders(id) ◄───────┘
                                   ON DELETE CASCADE
```

---

## 📊 Visual Representation with Sample Data

### FOLDERS Table (Parent)
```
┌────┬─────────────┬─────────────────────┐
│ id │ name        │ created_at          │
├────┼─────────────┼─────────────────────┤
│ 1  │ Projects    │ 2026-01-07 10:00:00 │
│ 2  │ Reports     │ 2026-01-07 10:00:00 │
│ 3  │ Invoices    │ 2026-01-07 10:00:00 │
└────┴─────────────┴─────────────────────┘
  ▲       ▲            ▲
  │       │            │
  │       │            └─── Documents in this folder
  │       └──────────────── Documents in this folder
  └──────────────────────── Documents in this folder
```

### DOCUMENTS Table (Child)
```
┌────┬────────────────────────┬───────────┬───────────┬──────┬─────────────────────┐
│ id │ name                   │ folder_id │ file_type │ size │ created_at          │
├────┼────────────────────────┼───────────┼───────────┼──────┼─────────────────────┤
│ 1  │ Project Plan.pdf       │     1  ───┼─► pdf     │ 2048 │ 2026-01-07 10:01:00 │
│ 2  │ Tech Spec.docx         │     1  ───┼─► docx    │ 4096 │ 2026-01-07 10:02:00 │
│ 3  │ Budget Report.xlsx     │     2  ───┼─► xlsx    │ 1024 │ 2026-01-07 10:03:00 │
│ 4  │ Monthly Summary.pdf    │     2  ───┼─► pdf     │ 3072 │ 2026-01-07 10:04:00 │
│ 5  │ Invoice_Jan.pdf        │     3  ───┼─► pdf     │  512 │ 2026-01-07 10:05:00 │
│ 6  │ Invoice_Feb.pdf        │     3  ───┼─► pdf     │  768 │ 2026-01-07 10:06:00 │
└────┴────────────────────────┴───────────┴───────────┴──────┴─────────────────────┘
        │                           │
        │                           └──── Foreign Key points to folders.id
        └──────────────────────────────── Each document belongs to ONE folder
```

---

## 🔗 Relationship Explained

### One-to-Many (1:N)
```
    FOLDERS                    DOCUMENTS
┌──────────────┐          ┌─────────────────────┐
│ id: 1        │◄─────────│ Project Plan.pdf    │
│ Projects     │          │ folder_id: 1        │
│              │◄─────────│ Tech Spec.docx      │
└──────────────┘          │ folder_id: 1        │
                          └─────────────────────┘

┌──────────────┐          ┌─────────────────────┐
│ id: 2        │◄─────────│ Budget Report.xlsx  │
│ Reports      │          │ folder_id: 2        │
│              │◄─────────│ Monthly Summary.pdf │
└──────────────┘          │ folder_id: 2        │
                          └─────────────────────┘

┌──────────────┐          ┌─────────────────────┐
│ id: 3        │◄─────────│ Invoice_Jan.pdf     │
│ Invoices     │          │ folder_id: 3        │
│              │◄─────────│ Invoice_Feb.pdf     │
└──────────────┘          │ folder_id: 3        │
                          └─────────────────────┘
```

---

## 🔑 Key Features

### Primary Keys
- **folders.id** - Unique identifier for each folder
- **documents.id** - Unique identifier for each document

### Foreign Key
- **documents.folder_id** → **folders.id**
  - Links each document to its parent folder
  - Enforces referential integrity
  - `ON DELETE CASCADE` means if you delete a folder, all its documents are deleted too

### Indexes (for fast queries)
- `idx_name` on folders.name - Fast folder name lookups
- `idx_folder_id` on documents.folder_id - Fast filtering by folder
- `idx_name` on documents.name - Fast document name searches

---

## 📐 Schema Rules & Constraints

### FOLDERS Table Rules
```
✅ Must have: id (auto-generated), name
✅ Name cannot be empty (NOT NULL)
✅ Created timestamp is automatic
✅ Each folder can have 0 or many documents
```

### DOCUMENTS Table Rules
```
✅ Must have: id, name, folder_id, file_type, size
✅ All fields required (NOT NULL)
✅ folder_id MUST reference an existing folder
❌ Cannot create a document with invalid folder_id
❌ Cannot have orphaned documents (folder must exist)
✅ If folder is deleted, its documents are deleted too (CASCADE)
```

---

## 💡 Real-World Example

### Creating Data Flow:
```
Step 1: Create a folder
INSERT INTO folders (name) VALUES ('Legal');
Result: { id: 4, name: 'Legal', created_at: '2026-01-07 11:00:00' }

Step 2: Add documents to that folder
INSERT INTO documents (name, folder_id, file_type, size) 
VALUES ('Contract.pdf', 4, 'pdf', 5120);
Result: Document linked to folder id=4

Step 3: Query documents in folder
SELECT * FROM documents WHERE folder_id = 4;
Result: Returns 'Contract.pdf'

Step 4: Delete folder
DELETE FROM folders WHERE id = 4;
Result: Folder AND its documents are deleted (CASCADE)
```

---

## 🎯 Common Queries

### Get all documents with folder names
```sql
SELECT 
  d.id,
  d.name AS document_name,
  f.name AS folder_name,
  d.file_type,
  d.size,
  d.created_at
FROM documents d
JOIN folders f ON d.folder_id = f.id
ORDER BY d.created_at DESC;
```

### Get documents in specific folder
```sql
SELECT * FROM documents 
WHERE folder_id = 1 
ORDER BY name;
```

### Count documents per folder
```sql
SELECT 
  f.id,
  f.name AS folder_name,
  COUNT(d.id) AS document_count
FROM folders f
LEFT JOIN documents d ON f.id = d.folder_id
GROUP BY f.id, f.name;
```

### Search documents by name
```sql
SELECT d.*, f.name AS folder_name
FROM documents d
JOIN folders f ON d.folder_id = f.id
WHERE d.name LIKE '%report%'
   OR f.name LIKE '%report%';
```

---

## 🏗️ Database Design Principles Used

### ✅ Normalization
- No duplicate data
- Each table has a single purpose
- Folders and Documents are separate entities

### ✅ Referential Integrity
- Foreign key ensures every document has a valid folder
- Can't create orphaned documents

### ✅ Performance
- Indexes on frequently queried columns
- Efficient JOIN operations

### ✅ Data Types
- INT for IDs (numeric, efficient)
- VARCHAR for text (flexible length)
- TIMESTAMP for dates (automatic timezone handling)

---

## 📊 Visual Summary

```
Database: documents_management
│
├─ TABLE: folders (3 rows)
│  Purpose: Store folder information
│  Size: Small (only metadata)
│  
└─ TABLE: documents (6 rows)
   Purpose: Store document metadata (no actual files)
   Size: Small (only text data)
   Link: Each row links to a folder via folder_id
```

**Total Storage:** Minimal (just metadata, no actual files!)

---

## 🎨 How This Looks in Your App

```
Frontend Display:
├─ 📁 Projects (folder.id = 1)
│   ├─ 📄 Project Plan.pdf (doc.folder_id = 1)
│   └─ 📄 Tech Spec.docx (doc.folder_id = 1)
│
├─ 📁 Reports (folder.id = 2)
│   ├─ 📄 Budget Report.xlsx (doc.folder_id = 2)
│   └─ 📄 Monthly Summary.pdf (doc.folder_id = 2)
│
└─ 📁 Invoices (folder.id = 3)
    ├─ 📄 Invoice_Jan.pdf (doc.folder_id = 3)
    └─ 📄 Invoice_Feb.pdf (doc.folder_id = 3)
```

---

## 🔍 Why This Design?

**Simple & Effective:**
- Easy to understand
- Easy to query
- Scales well (can handle thousands of documents)
- Industry standard pattern

**Flexible:**
- Add new folders anytime
- Add documents to any folder
- Search across everything
- Filter by folder easily

**Safe:**
- Can't create invalid data (constraints)
- Automatic timestamps
- Cascade deletes prevent orphans

---

**This schema is exactly what professional document management systems use!** ✨
