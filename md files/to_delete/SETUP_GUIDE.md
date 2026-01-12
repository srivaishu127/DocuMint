# 📚 Documents Management System - Setup Guide

## 🎯 DAY 1: Environment & Database Setup

### Step 1: Check Prerequisites

Open PowerShell and run these commands:

```powershell
node --version
# Should show v18.x.x or higher

npm --version
# Should show 9.x.x or higher
```

**If Node.js is not installed:**
- Download from: https://nodejs.org/
- Install the LTS version
- Restart PowerShell after installation

---

### Step 2: Install MySQL

**Option A: MySQL Community Server**
1. Download from: https://dev.mysql.com/downloads/mysql/
2. Run installer
3. During setup:
   - Choose "Developer Default"
   - Set root password (remember this!)
   - Default port: 3306

**Option B: XAMPP (Easier)**
1. Download from: https://www.apachefriends.org/
2. Install XAMPP
3. Start MySQL from XAMPP Control Panel

**Verify MySQL is running:**
```powershell
mysql --version
```

---

### Step 3: Create Project Structure

In your current folder, create this structure:

```
vis_tra/
├── backend/          ← You'll create this
├── frontend/         ← You'll create this
└── SETUP_GUIDE.md    ← You're reading this!
```

**Commands to run:**
```powershell
# You're already in vis_tra folder
mkdir backend
mkdir frontend
```

---

### Step 4: Set Up Database

#### A. Connect to MySQL

```powershell
# Option 1: If mysql command works
mysql -u root -p
# Enter your password when prompted

# Option 2: If using XAMPP, open phpMyAdmin
# Go to: http://localhost/phpmyadmin
```

#### B. Create Database & Tables

Copy and paste these SQL commands one by one:

```sql
-- Create the database
CREATE DATABASE documents_management;

-- Use the database
USE documents_management;

-- Create folders table
CREATE TABLE folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  folder_id INT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  size INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Insert some sample folders
INSERT INTO folders (name) VALUES 
  ('Projects'),
  ('Reports'),
  ('Invoices');

-- Insert some sample documents
INSERT INTO documents (name, folder_id, file_type, size) VALUES 
  ('Project Plan.pdf', 1, 'pdf', 2048),
  ('Budget Report.xlsx', 2, 'xlsx', 1024),
  ('Invoice_Jan.pdf', 3, 'pdf', 512);
```

#### C. Verify Data

```sql
-- Check folders
SELECT * FROM folders;

-- Check documents
SELECT * FROM documents;

-- You should see 3 folders and 3 documents
```

---

### Step 5: Database Schema Explained

**Why two tables?**

```
folders (Parent)
├── id: 1, name: "Projects"
├── id: 2, name: "Reports"
└── id: 3, name: "Invoices"

documents (Child)
├── id: 1, name: "Project Plan.pdf", folder_id: 1 → belongs to "Projects"
├── id: 2, name: "Budget Report.xlsx", folder_id: 2 → belongs to "Reports"
└── id: 3, name: "Invoice_Jan.pdf", folder_id: 3 → belongs to "Invoices"
```

**Relationship:**
- One folder can have many documents
- Each document belongs to one folder
- `folder_id` in documents links to `id` in folders

---

## ✅ Checkpoint

At this point you should have:
- [x] Node.js and npm installed
- [x] MySQL installed and running
- [x] Database `documents_management` created
- [x] Tables `folders` and `documents` created with sample data
- [x] Folder structure: `backend/` and `frontend/`

---

## 🎯 Next: Initialize Backend Project

Continue to: `backend/BACKEND_GUIDE.md` (I'll create this next)

---

## ❓ Troubleshooting

**MySQL won't connect:**
- Check if MySQL service is running
- For XAMPP: Start MySQL in control panel
- Check port 3306 is not blocked

**Node.js not found:**
- Restart PowerShell after installation
- Add Node.js to PATH environment variable

**Permission errors:**
- Run PowerShell as Administrator
- Or use regular PowerShell and avoid system folders

---

**Questions? Let me know where you got stuck and I'll help!**
