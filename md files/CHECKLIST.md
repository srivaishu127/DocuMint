# ✅ 5-Day Implementation Checklist

Print this out or keep it open while working!

---

## DAY 1: Environment & Database Setup (3-4 hours)

### ☐ Prerequisites
- [ ] Node.js installed (run: `node --version`)
- [ ] npm installed (run: `npm --version`)
- [ ] MySQL installed and running
- [ ] Can connect to MySQL

### ☐ Database Setup
- [ ] Created database `documents_management`
- [ ] Created `folders` table
- [ ] Created `documents` table
- [ ] Inserted sample folders (3 folders)
- [ ] Inserted sample documents (3 documents)
- [ ] Verified data with `SELECT * FROM folders` and `SELECT * FROM documents`

### ☐ Project Structure
- [ ] Created `backend/` folder
- [ ] Created `frontend/` folder
- [ ] All guide files are in place

**✅ Day 1 Complete when:** Database has sample data and folders exist

---

## DAY 2: Backend Complete (5-6 hours)

### ☐ Backend Project Init
- [ ] Ran `npm init -y` in backend folder
- [ ] Installed production dependencies: express, mysql2, cors, dotenv
- [ ] Installed dev dependencies: typescript, @types packages, ts-node, nodemon
- [ ] Created `tsconfig.json`
- [ ] Created `.env` file with database credentials
- [ ] Created `.gitignore`

### ☐ Backend Folder Structure
- [ ] Created `src/` folder
- [ ] Created `src/config/` folder
- [ ] Created `src/controllers/` folder
- [ ] Created `src/routes/` folder

### ☐ Backend Files Created
- [ ] `src/config/database.ts` - Database connection
- [ ] `src/controllers/folderController.ts` - Folder logic
- [ ] `src/controllers/documentController.ts` - Document logic
- [ ] `src/routes/folderRoutes.ts` - Folder endpoints
- [ ] `src/routes/documentRoutes.ts` - Document endpoints
- [ ] `src/server.ts` - Main server file

### ☐ Backend Testing
- [ ] Added scripts to package.json (dev, build, start)
- [ ] Server starts with `npm run dev`
- [ ] See "Database connected successfully" message
- [ ] Server running on port 3001
- [ ] Browser shows folders: http://localhost:3001/api/folders
- [ ] Browser shows documents: http://localhost:3001/api/documents
- [ ] Can create folder with curl/Postman
- [ ] Can create document with curl/Postman
- [ ] Search works: http://localhost:3001/api/documents/search?q=test

**✅ Day 2 Complete when:** All API endpoints work in browser/Postman

---

## DAY 3: Frontend Setup & Basic UI (5-6 hours)

### ☐ Frontend Project Init
- [ ] Created Next.js app with TypeScript and Tailwind
- [ ] Installed axios
- [ ] Project starts with `npm run dev`
- [ ] Can see default Next.js page at http://localhost:3000

### ☐ Frontend Files Created
- [ ] `app/types.ts` - TypeScript interfaces
- [ ] `app/services/api.ts` - API client

### ☐ Frontend Components Created
- [ ] Created `app/components/` folder
- [ ] `app/components/DocumentCard.tsx`
- [ ] `app/components/FolderList.tsx`
- [ ] `app/components/SearchBar.tsx`
- [ ] `app/components/AddDocumentForm.tsx`
- [ ] `app/components/AddFolderForm.tsx`

### ☐ Main Page
- [ ] Updated `app/page.tsx` with main application code
- [ ] Updated `app/layout.tsx` with metadata

### ☐ Frontend Initial Testing
- [ ] Backend is running (port 3001)
- [ ] Frontend is running (port 3000)
- [ ] Page loads without errors
- [ ] Can see folders in sidebar
- [ ] Can see documents in main area
- [ ] No console errors in browser DevTools (F12)

**✅ Day 3 Complete when:** Page loads and displays existing data

---

## DAY 4: Forms & Full Integration (5-6 hours)

### ☐ Add Folder Feature
- [ ] "Add Folder" button visible
- [ ] Clicking button shows form
- [ ] Can type folder name
- [ ] Form validates (shows error if empty)
- [ ] Can cancel form
- [ ] Can submit form
- [ ] New folder appears in sidebar immediately
- [ ] New folder saved in database

### ☐ Add Document Feature
- [ ] "Add Document" button visible
- [ ] Clicking button shows form
- [ ] All form fields present: name, folder, type, size
- [ ] Folder dropdown populated
- [ ] Form validates all fields
- [ ] Shows error messages for invalid inputs
- [ ] Can cancel form
- [ ] Can submit form
- [ ] New document appears immediately
- [ ] New document saved in database

### ☐ Filter by Folder
- [ ] Can click "All Documents"
- [ ] Shows all documents
- [ ] Can click specific folder
- [ ] Shows only documents in that folder
- [ ] Selected folder is highlighted
- [ ] Document count updates

### ☐ End-to-End Testing
- [ ] Add 3 new folders
- [ ] Add 5 new documents to different folders
- [ ] Filter by each folder
- [ ] Verify correct documents shown
- [ ] Refresh page - data persists
- [ ] Check MySQL - verify new records exist

**✅ Day 4 Complete when:** Can add folders/documents and filter works perfectly

---

## DAY 5: Search, Polish & Documentation (4-5 hours)

### ☐ Search Feature
- [ ] Search bar visible at top
- [ ] Can type search query
- [ ] Can click Search button
- [ ] Can press Enter to search
- [ ] Results show matching documents
- [ ] "Clear" button appears when searching
- [ ] Clicking Clear resets to all documents
- [ ] Searching clears folder filter
- [ ] Search works for document names
- [ ] Search works for folder names

### ☐ UI Polish
- [ ] All buttons have hover effects
- [ ] Loading states show when fetching data
- [ ] Error messages are clear and helpful
- [ ] Forms have proper spacing
- [ ] Colors are consistent
- [ ] Mobile responsive (test by resizing browser)

### ☐ Testing Everything
- [ ] Test all features one more time
- [ ] Add folders with special characters
- [ ] Add documents with long names
- [ ] Search with various queries
- [ ] Test edge cases (empty search, no results)
- [ ] Check console for any errors
- [ ] Test in different browsers if possible

### ☐ Documentation
- [ ] Copy `README_TEMPLATE.md` to `README.md`
- [ ] Update with your information:
  - [ ] Your name
  - [ ] Your GitHub username
  - [ ] Your actual repository URL
- [ ] Take screenshots of:
  - [ ] Main page with documents
  - [ ] Add folder form
  - [ ] Add document form
  - [ ] Search results
  - [ ] Filtered view
- [ ] Add screenshots to README (optional but impressive)
- [ ] Double-check all instructions are accurate

### ☐ GitHub Submission
- [ ] Created GitHub repository
- [ ] Added `.gitignore` files (already created)
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] First commit: `git commit -m "Initial commit: Document Management System"`
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Push: `git push -u origin main`
- [ ] Verify all files are on GitHub
- [ ] README displays correctly on GitHub
- [ ] No `.env` file in repository (security!)
- [ ] No `node_modules/` in repository

### ☐ Final Checks
- [ ] Clone repository to a different folder
- [ ] Follow your own README setup instructions
- [ ] Verify app works from fresh clone
- [ ] Check all links in README work
- [ ] Submit GitHub repository link

**✅ Day 5 Complete when:** Repository is on GitHub with complete README

---

## 🎉 Assignment Complete!

### What You've Built:
- ✅ Full-stack TypeScript application
- ✅ RESTful API with Node.js + Express
- ✅ React frontend with Next.js
- ✅ MySQL database integration
- ✅ CRUD operations for folders and documents
- ✅ Search functionality (bonus!)
- ✅ Form validation
- ✅ Responsive UI with Tailwind CSS
- ✅ Clean code structure
- ✅ Comprehensive documentation

---

## 📊 Time Tracking (Optional)

Track your actual time spent:

| Day | Task | Estimated | Actual | Notes |
|-----|------|-----------|---------|-------|
| 1 | Setup & Database | 3-4h | ___ h | |
| 2 | Backend | 5-6h | ___ h | |
| 3 | Frontend Setup | 5-6h | ___ h | |
| 4 | Integration | 5-6h | ___ h | |
| 5 | Polish & Docs | 4-5h | ___ h | |
| **Total** | | **22-27h** | **___ h** | |

---

## 🆘 Quick Troubleshooting

**Backend won't start:**
→ Check `.env` has correct MySQL password
→ Ensure MySQL service is running

**Frontend shows "Loading..." forever:**
→ Check backend is running (port 3001)
→ Open browser console (F12) for errors

**Database errors:**
→ Verify database and tables exist
→ Check `DB_NAME` in `.env` matches database name

**TypeScript errors:**
→ Run `npm install` in the folder with errors
→ Delete `node_modules/` and reinstall

**Git issues:**
→ Make sure you're in the project root folder
→ Check `.gitignore` includes `node_modules/` and `.env`

---

## 💪 You've Got This!

Remember:
- Follow guides step by step
- Test as you build
- Don't skip steps
- Ask for help when stuck
- Take breaks!

**Good luck! 🚀**
