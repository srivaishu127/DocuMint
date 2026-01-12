# ⚡ Quick Setup Guide for Assessors

This is a condensed setup guide to get the application running quickly.

---

## 📋 Prerequisites Check

✅ Node.js v18+ installed: `node --version`  
✅ npm installed: `npm --version`  
✅ MySQL 8+ installed and **running**

---

## 🚀 3-Step Setup

### **STEP 1: Database Setup (2 minutes)**

1. **Open MySQL Workbench** (or MySQL Command Line)
2. **Connect to your MySQL server**
3. **Run the database setup:**
   - MySQL Workbench: File → Open SQL Script → Select `database.sql` → Execute (⚡ icon)
   - Command Line: `mysql -u root -p < database.sql`
4. **Verify:** Run `USE documents_management; SELECT COUNT(*) FROM folders;` → Should return 3

---

### **STEP 2: Backend Setup (1 minute)**

```bash
cd backend
npm install
```

**Create `.env` file** in the `backend` folder with your MySQL credentials:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=documents_management
```

⚠️ **IMPORTANT:** 
- Replace `your_mysql_password_here` with your actual MySQL password
- If your MySQL uses a different port, check MySQL Workbench connection settings and update `DB_PORT`

**Start backend:**
```bash
npm run dev
```

✅ **Success indicators:**
- `🚀 Server running on http://localhost:3001`
- `✅ Database connected successfully`

❌ **If you see "Database connection failed":**
- Check MySQL service is running (Windows: Services → MySQL80 → Start)
- Verify password in `.env` is correct
- Check if MySQL port is 3306 or different (update `DB_PORT` if needed)

---

### **STEP 3: Frontend Setup (1 minute)**

**Open a NEW terminal** (keep backend running):

```bash
cd frontend
npm install
npm run dev
```

✅ **Success:** Open browser → `http://localhost:3000`

---

## 🧪 Quick Test

1. **Browser:** Visit `http://localhost:3000` → Should see Document Management interface
2. **API Test:** Visit `http://localhost:3001/api/folders` → Should see JSON with 3 folders
3. **Add Folder:** Click "Add Folder" → Enter "Test" → Should create successfully
4. **Filter:** Click a folder name → Should filter documents

---

## ⚠️ Common Issues

| Error | Solution |
|-------|----------|
| Database connection failed | Start MySQL service, check `.env` password |
| ECONNREFUSED on port 3306 | MySQL not running OR wrong port (check Workbench, add `DB_PORT` to `.env`) |
| Access denied for user 'root' | Wrong password in `.env` file |
| Unknown database | Run `database.sql` first |
| Cannot connect to backend (frontend) | Ensure backend is running on port 3001 |
| Port 3000/3001 already in use | Change port in `.env` or kill existing process |

---

## 📁 What You Should See

**Database:**
- `documents_management` database
- `folders` table with 3 rows
- `documents` table with 6 rows

**Backend Running:**
```
🚀 Server running on http://localhost:3001
📡 API endpoints available at http://localhost:3001/api
✅ Database connected successfully
```

**Frontend Running:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

---

## 🔗 Useful URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Get Folders:** http://localhost:3001/api/folders
- **Get Documents:** http://localhost:3001/api/documents

---

## 📞 Need Help?

Check the full `README.md` for:
- Detailed troubleshooting
- API endpoint documentation
- Project structure explanation
- Development notes
