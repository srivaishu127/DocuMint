# 📄 Document Management System

A full-stack web application for managing documents and folders, built with Next.js, Node.js, TypeScript, and MySQL.

## 🎯 Features

- ✅ View all documents and folders
- ✅ Create new folders
- ✅ Add documents to folders
- ✅ Filter documents by folder
- ✅ Search documents and folders by name
- ✅ Responsive design with Tailwind CSS
- ✅ Form validation
- ✅ RESTful API backend

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MySQL** - Database
- **mysql2** - MySQL driver

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (v8 or higher)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd vis_tra
```

### 2. Set up the Database

**Option A: Using the provided SQL file (Recommended)**

1. Open MySQL Workbench or MySQL Command Line
2. Run the database setup file:

**Using MySQL Workbench:**
- Open MySQL Workbench
- Connect to your MySQL server
- Go to File → Open SQL Script
- Select `database.sql` from the project root
- Click the Execute button (⚡ lightning bolt icon)

**Using MySQL Command Line:**
```bash
mysql -u root -p < database.sql
```
Enter your MySQL password when prompted.

**Option B: Manual setup**

If you prefer to run commands manually, open MySQL and execute:

```sql
CREATE DATABASE documents_management;
USE documents_management;

CREATE TABLE folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  folder_id INT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  size INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO folders (name) VALUES 
  ('Projects'),
  ('Reports'),
  ('Invoices');

INSERT INTO documents (name, folder_id, file_type, size) VALUES 
  ('Project Plan.pdf', 1, 'pdf', 2048),
  ('Budget Report.xlsx', 2, 'xlsx', 1024),
  ('Invoice_Jan.pdf', 3, 'pdf', 512);
```

**Verify the setup:**
```sql
SELECT COUNT(*) FROM folders;    -- Should return 3
SELECT COUNT(*) FROM documents;  -- Should return 6
```

### 3. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=documents_management
```

**Important Configuration Notes:**

1. **DB_PASSWORD**: Replace `your_mysql_password` with your actual MySQL password
2. **DB_PORT**: Default is `3306`. If your MySQL runs on a different port (check your MySQL Workbench connection settings), update this value. For example:
   ```env
   DB_PORT=3300  # If your MySQL uses port 3300
   ```
3. **DB_USER**: Default is `root`. Change if you use a different MySQL user

**How to find your MySQL port:**
- Open MySQL Workbench
- Click the wrench icon (⚙️) on your connection
- Look for the "Port" field in the connection settings

Start the backend server:

```bash
npm run dev
```

The backend should now be running on `http://localhost:3001`

### 4. Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

## 🎮 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. You'll see the Document Management System interface with:
   - **Folders sidebar** - Click to filter documents by folder
   - **Documents grid** - View all documents as cards
   - **Add Folder button** - Create new folders
   - **Add Document button** - Add documents to folders
   - **Search bar** - Search across all documents and folders

### Adding a Folder
1. Click "Add Folder"
2. Enter folder name
3. Click "Create Folder"

### Adding a Document
1. Click "Add Document"
2. Fill in the form:
   - Document name (e.g., "Report.pdf")
   - Select a folder
   - File type (e.g., "pdf", "docx", "xlsx")
   - Size in bytes (e.g., 2048)
3. Click "Add Document"

### Filtering by Folder
- Click on any folder in the sidebar to view only documents in that folder
- Click "All Documents" to view all documents

### Searching
- Type your search query in the search bar
- Click "Search" or press Enter
- Results will show documents matching your query
- Click "Clear" to reset

## 📁 Project Structure

```
vis_tra/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MySQL connection
│   │   ├── controllers/
│   │   │   ├── folderController.ts  # Folder logic
│   │   │   └── documentController.ts # Document logic
│   │   ├── routes/
│   │   │   ├── folderRoutes.ts      # Folder endpoints
│   │   │   └── documentRoutes.ts    # Document endpoints
│   │   └── server.ts                # Express server
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── components/
    │   │   ├── AddDocumentForm.tsx   # Add document form
    │   │   ├── AddFolderForm.tsx     # Add folder form
    │   │   ├── DocumentCard.tsx      # Document display card
    │   │   ├── FolderList.tsx        # Folder sidebar
    │   │   └── SearchBar.tsx         # Search component
    │   ├── services/
    │   │   └── api.ts                # API client
    │   ├── layout.tsx                # Root layout
    │   ├── page.tsx                  # Main page
    │   └── types.ts                  # TypeScript types
    ├── package.json
    └── tsconfig.json
```

## 🔌 API Endpoints

### Folders
- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create a new folder

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/folder/:folderId` - Get documents by folder
- `POST /api/documents` - Create a new document
- `GET /api/documents/search?q=query` - Search documents

## 🗄️ Database Schema

### `folders` Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| name | VARCHAR(255) | Folder name |
| created_at | TIMESTAMP | Creation timestamp |

### `documents` Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| name | VARCHAR(255) | Document name |
| folder_id | INT | Foreign key to folders |
| file_type | VARCHAR(50) | File extension |
| size | INT | File size in bytes |
| created_at | TIMESTAMP | Creation timestamp |

## 🧪 Testing

### Backend Testing

Test endpoints using curl or Postman:

```bash
# Get all folders
curl http://localhost:3001/api/folders

# Create a folder
curl -X POST http://localhost:3001/api/folders \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Folder"}'

# Get all documents
curl http://localhost:3001/api/documents

# Search
curl "http://localhost:3001/api/documents/search?q=report"
```

### Frontend Testing

1. Start both backend and frontend servers
2. Open `http://localhost:3000`
3. Test all features:
   - Add folders
   - Add documents
   - Filter by folder
   - Search functionality

## 🚧 Troubleshooting

### Backend Issues

**Error: "Database connection failed" with code ECONNREFUSED:**
- **Cause**: MySQL Server is not running
- **Solution**: 
  - Windows: Open Services (Win+R → `services.msc`) → Find "MySQL80" → Start service
  - Mac/Linux: Run `sudo systemctl start mysql`
- **Alternative**: Check if MySQL is running on a different port in MySQL Workbench connection settings

**Error: "Access denied for user 'root'@'localhost'":**
- **Cause**: Incorrect password in `.env` file
- **Solution**: Update `DB_PASSWORD` in `backend/.env` with your correct MySQL password

**Error: "Unknown database 'documents_management'":**
- **Cause**: Database not created
- **Solution**: Run the `database.sql` file using MySQL Workbench or command line

**Error: "connect ECONNREFUSED ::1:3306" or "connect ECONNREFUSED 127.0.0.1:3306":**
- **Cause**: Wrong MySQL port configured
- **Solution**: 
  1. Check your MySQL port in Workbench (connection settings)
  2. Add `DB_PORT=<your_port>` to `backend/.env` (e.g., `DB_PORT=3300`)
  3. Restart the backend server

**Backend starts but shows "❌ Database connection failed":**
- Verify all values in `.env` are correct (no quotes, no spaces)
- Check MySQL service is running
- Try connecting via MySQL Workbench with same credentials

**Port already in use:**
- Change `PORT` in `.env` to another port (e.g., 3002)
- Update frontend API base URL accordingly

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API URL in `app/services/api.ts`

**Page shows "Loading..." forever:**
- Check backend is running
- Open browser DevTools (F12) and check Console tab
- Check Network tab for failed requests

## 📝 Development Notes

- The application simulates file uploads by storing document metadata only
- No actual files are uploaded or stored
- File size is entered manually in bytes
- Document operations are immediate (no confirmation dialogs)

## 🔐 Security Considerations

For production deployment, consider:
- Environment variables for sensitive data (already implemented)
- Input validation and sanitization (basic validation implemented)
- SQL injection prevention (using parameterized queries)
- Rate limiting for API endpoints
- Authentication and authorization
- HTTPS for secure communication

## 🚀 Future Enhancements

Potential improvements:
- [ ] Delete documents and folders
- [ ] Edit document/folder names
- [ ] Move documents between folders
- [ ] Nested folders (folders within folders)
- [ ] Actual file upload and storage
- [ ] User authentication
- [ ] Document preview
- [ ] Pagination for large datasets
- [ ] Sorting options
- [ ] Advanced filters

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 📄 License

This project is for educational purposes as part of the Vistra Platform Coding Assignment.

---

**Built with ❤️ using Next.js, Node.js, and MySQL**
