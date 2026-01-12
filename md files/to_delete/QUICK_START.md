# 🚀 Quick Start - Document Management System

## 📁 Project Overview

You're building a full-stack Document Management System with:
- **Backend**: Node.js + TypeScript + Express + MySQL (Port 3001)
- **Frontend**: Next.js + React + TypeScript + Tailwind CSS (Port 3000)

---

## 📚 Your Guides (Follow in Order)

### **Day 1-2: Backend & Database**

1. **SETUP_GUIDE.md** - Set up environment and database
   - Install Node.js, MySQL
   - Create database and tables
   - Add sample data

2. **backend/BACKEND_GUIDE.md** - Build complete backend API
   - Initialize Node.js project
   - Create all backend code files
   - Test API with browser/Postman

### **Day 3-4: Frontend**

3. **frontend/FRONTEND_GUIDE.md** - Build React/Next.js frontend
   - Initialize Next.js project
   - Create all components
   - Connect to backend
   - Test everything together

### **Day 5: Polish & Submit**

4. Final testing and documentation
   - Write README.md
   - Take screenshots
   - Push to GitHub

---

## ⚡ Quick Command Reference

### Backend Commands (in `backend/` folder):
```powershell
npm init -y                                    # Initialize project
npm install express mysql2 cors dotenv         # Install dependencies
npm install -D typescript @types/node ...      # Install dev dependencies
npm run dev                                    # Start development server
```

### Frontend Commands (in `frontend/` folder):
```powershell
npx create-next-app@latest frontend ...        # Create Next.js app
npm install axios                              # Install axios
npm run dev                                    # Start development server
```

### Database Commands (MySQL):
```sql
CREATE DATABASE documents_management;
USE documents_management;
-- (See SETUP_GUIDE.md for full SQL)
```

---

## 🎯 What You're Building

### API Endpoints (Backend):
```
GET  /api/folders              → Get all folders
POST /api/folders              → Create folder

GET  /api/documents            → Get all documents
POST /api/documents            → Create document
GET  /api/documents/folder/:id → Get documents by folder
GET  /api/documents/search?q=  → Search documents (bonus)
```

### Pages (Frontend):
```
http://localhost:3000          → Main page with everything
  - View folders (sidebar)
  - View documents (cards)
  - Add folder (form)
  - Add document (form)
  - Search bar (bonus)
```

---

## 📂 Final Project Structure

```
vis_tra/
├── SETUP_GUIDE.md           ← Start here!
├── QUICK_START.md           ← You're reading this
│
├── backend/
│   ├── BACKEND_GUIDE.md     ← Backend tutorial
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── folderController.ts
│   │   │   └── documentController.ts
│   │   ├── routes/
│   │   │   ├── folderRoutes.ts
│   │   │   └── documentRoutes.ts
│   │   └── server.ts
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── FRONTEND_GUIDE.md    ← Frontend tutorial
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
    ├── package.json
    └── tsconfig.json
```

---

## 🔥 Daily Checklist

### **DAY 1: Setup & Database**
- [ ] Install Node.js and MySQL
- [ ] Create database and tables
- [ ] Verify sample data exists
- [ ] Create `backend/` and `frontend/` folders

### **DAY 2: Backend**
- [ ] Initialize Node.js project
- [ ] Install all dependencies
- [ ] Create all backend files
- [ ] Test API with browser (http://localhost:3001/api/folders)
- [ ] Backend running successfully ✅

### **DAY 3: Frontend Setup**
- [ ] Create Next.js app
- [ ] Install axios
- [ ] Create type definitions
- [ ] Create API service
- [ ] Frontend starts without errors ✅

### **DAY 4: Frontend Components & Integration**
- [ ] Create all 5 components
- [ ] Build main page
- [ ] Connect frontend to backend
- [ ] Test adding folders
- [ ] Test adding documents
- [ ] Test filtering by folder
- [ ] Everything works end-to-end ✅

### **DAY 5: Polish & Submit**
- [ ] Test search functionality
- [ ] Improve UI/styling if needed
- [ ] Write README.md
- [ ] Take screenshots
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Submit GitHub link ✅

---

## 🆘 When You Get Stuck

### Backend not connecting to database?
→ Check `.env` file has correct password
→ Make sure MySQL is running
→ Check database name is `documents_management`

### Frontend can't reach backend?
→ Make sure backend is running (npm run dev in backend folder)
→ Check API URL is `http://localhost:3001/api`
→ Look at browser console for error messages

### TypeScript errors?
→ Make sure all dependencies are installed
→ Check imports are correct
→ Restart dev server

### Need help?
→ Read the error message carefully
→ Check which guide you're following
→ Google the error message
→ Ask me! I'm here to help!

---

## 💡 Pro Tips

1. **Keep both servers running:**
   - Terminal 1: `backend> npm run dev` (port 3001)
   - Terminal 2: `frontend> npm run dev` (port 3000)

2. **Save often:**
   - `nodemon` and Next.js auto-reload on file changes
   - Your changes appear instantly!

3. **Use browser DevTools:**
   - F12 to open
   - Console tab shows errors
   - Network tab shows API calls

4. **Test as you build:**
   - Don't wait until the end
   - Test each feature as you add it
   - Fix bugs immediately

5. **Copy-paste carefully:**
   - Double-check file paths
   - Make sure all imports are correct
   - Watch for typos in variable names

---

## 🎓 Key Concepts to Understand

### **Backend (Node.js):**
- **Express**: Creates web server and routes
- **Controllers**: Handle business logic
- **Routes**: Map URLs to functions
- **MySQL Pool**: Manages database connections

### **Frontend (Next.js/React):**
- **Components**: Reusable UI pieces
- **Props**: Pass data to components
- **State**: Data that can change (useState)
- **useEffect**: Run code when component loads
- **Tailwind**: Utility CSS classes

### **Full-Stack Flow:**
```
User clicks button
  → React component calls API function
  → axios sends HTTP request to backend
  → Express receives request
  → Controller queries MySQL
  → MySQL returns data
  → Controller sends JSON response
  → Frontend receives data
  → React updates UI
```

---

## 📸 What Your Final App Should Look Like

```
┌────────────────────────────────────────────────────┐
│  📄 Document Management System                     │
│  Manage your documents and folders efficiently     │
│                                                     │
│  [Search bar........................] [🔍 Search]  │
│                                                     │
│  [+ Add Folder]  [+ Add Document]                  │
│                                                     │
│  ┌─────────────┬──────────────────────────────┐   │
│  │ Folders     │ All Documents (6 documents)  │   │
│  ├─────────────┼──────────────────────────────┤   │
│  │ 📁 All Docs │  ┌──────┐ ┌──────┐ ┌──────┐ │   │
│  │ 📁 Projects │  │ Doc1 │ │ Doc2 │ │ Doc3 │ │   │
│  │ 📁 Reports  │  │ PDF  │ │ DOCX │ │ XLSX │ │   │
│  │ 📁 Invoices │  └──────┘ └──────┘ └──────┘ │   │
│  │             │  ┌──────┐ ┌──────┐ ┌──────┐ │   │
│  │             │  │ Doc4 │ │ Doc5 │ │ Doc6 │ │   │
│  │             │  │ PDF  │ │ PNG  │ │ TXT  │ │   │
│  │             │  └──────┘ └──────┘ └──────┘ │   │
│  └─────────────┴──────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

---

## ✅ Success Criteria

By the end, you should have:
- ✅ Working backend API with all endpoints
- ✅ Working frontend with all features
- ✅ Ability to create folders and documents
- ✅ Ability to filter documents by folder
- ✅ Search functionality (bonus)
- ✅ Clean, responsive UI
- ✅ Complete README.md
- ✅ Code on GitHub

---

## 🚀 Ready to Start?

### Your action items:

1. **Right now:** 
   - Open `SETUP_GUIDE.md`
   - Follow it step by step
   - Don't skip steps!

2. **When done with setup:**
   - Open `backend/BACKEND_GUIDE.md`
   - Build the backend

3. **When backend works:**
   - Open `frontend/FRONTEND_GUIDE.md`
   - Build the frontend

4. **When everything works:**
   - Test thoroughly
   - Write README.md
   - Push to GitHub
   - Submit!

---

## 📞 Need Help?

At any point, just tell me:
- Where you are (which guide, which step)
- What error you're seeing
- What you've tried

I'll help you debug and move forward! 💪

**Let's build this! 🚀**
