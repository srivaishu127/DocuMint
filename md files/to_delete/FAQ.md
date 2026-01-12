# ❓ Frequently Asked Questions (FAQ)

## General Questions

### Q: I've never used Next.js before. Will this be too difficult?

**A:** Not at all! Next.js is just React with some extra features. If you know basic JavaScript, you can follow the guides. All code is provided with explanations. You'll learn by doing!

### Q: Do I need to know React?

**A:** Basic React knowledge helps, but the guides include all the code you need. Key concepts you'll use:
- Components (reusable UI pieces)
- Props (passing data to components)
- State (data that changes)
- useEffect (run code when page loads)

### Q: Why TypeScript instead of JavaScript?

**A:** TypeScript catches errors before you run the code. It's like spell-check for programming. Example:
```typescript
// TypeScript catches this error immediately:
document.invalidProperty  // ❌ Property doesn't exist

// JavaScript only shows error when running:
document.invalidProperty  // ✓ Compiles, ❌ Runtime error
```

---

## Setup Questions

### Q: Which MySQL version should I install?

**A:** MySQL 8.0 or higher. The Community Server (free) works perfectly.

### Q: I installed MySQL but can't connect. What's wrong?

**A:** Check these:
1. Is MySQL service running?
   - Windows: Check Services (Win + R → `services.msc`)
   - Look for "MySQL80" or similar
2. Did you set a root password during installation?
3. Try connecting: `mysql -u root -p`
4. Default port should be 3306

### Q: Can I use XAMPP instead of standalone MySQL?

**A:** Yes! XAMPP includes MySQL and is easier to set up. After installing:
1. Open XAMPP Control Panel
2. Start MySQL
3. Click "Admin" to open phpMyAdmin
4. Run SQL commands there

### Q: What if I already have something running on port 3000 or 3001?

**A:** Easy fixes:
- **Frontend (port 3000):** Next.js usually picks next available port automatically
- **Backend (port 3001):** Change `PORT=3001` to `PORT=3002` in your `.env` file

---

## Backend Questions

### Q: What is Express.js?

**A:** Express is a framework that makes building web servers easier. Instead of writing complex server code, you do:
```typescript
app.get('/api/folders', (req, res) => {
  // Get folders from database
  res.json(folders);
});
```

### Q: What does "CORS" mean?

**A:** Cross-Origin Resource Sharing. It allows your frontend (port 3000) to talk to your backend (port 3001). Without CORS, browsers block this for security.

### Q: Why use a connection pool for MySQL?

**A:** Connection pools reuse database connections instead of creating new ones for each request. This is much faster and more efficient.

### Q: What if my backend crashes with "Cannot find module"?

**A:** Run `npm install` in the backend folder. This installs all required packages.

### Q: How do I test API endpoints without the frontend?

**A:** Three ways:
1. **Browser:** Just visit `http://localhost:3001/api/folders`
2. **Curl:** `curl http://localhost:3001/api/folders`
3. **Postman:** Free tool, easier for POST requests

---

## Frontend Questions

### Q: What is the difference between `page.tsx` and `layout.tsx`?

**A:**
- `layout.tsx` - Wraps all pages (header, footer, common stuff)
- `page.tsx` - The actual content of a specific page

### Q: What does `'use client'` mean at the top of files?

**A:** Next.js has two types of components:
- **Server Components** (default) - Run on server, can't use useState, onClick, etc.
- **Client Components** (`'use client'`) - Run in browser, can be interactive

Use `'use client'` when you need:
- `useState`, `useEffect`
- Click handlers, form inputs
- Browser APIs

### Q: Why do we need `api.ts` service file?

**A:** It centralizes all API calls in one place. Benefits:
- Easy to update API URL (one place)
- Reusable functions
- Cleaner component code
- Consistent error handling

### Q: What is Tailwind CSS and why use it?

**A:** Tailwind is utility-first CSS. Instead of:
```css
/* Regular CSS */
.button {
  background-color: blue;
  padding: 8px 16px;
  border-radius: 4px;
}
```

You write:
```jsx
<button className="bg-blue-500 px-4 py-2 rounded">
```

Benefits:
- Faster styling
- No CSS file management
- Consistent design
- Mobile-responsive built-in

### Q: Frontend shows "Loading..." forever. What's wrong?

**A:** Check:
1. Is backend running? (`npm run dev` in backend folder)
2. Is backend on port 3001? (check terminal output)
3. Open browser DevTools (F12) → Console tab → any errors?
4. Check Network tab → are requests failing?

---

## Database Questions

### Q: What is a Foreign Key?

**A:** A Foreign Key links two tables. In our case:
```sql
documents.folder_id → folders.id
```
This means every document MUST belong to a folder that exists.

### Q: What does `ON DELETE CASCADE` mean?

**A:** If you delete a folder, all documents in that folder are automatically deleted too. Prevents orphaned documents.

### Q: How do I view my data?

**A:** Three ways:
1. **MySQL Command Line:**
   ```sql
   SELECT * FROM folders;
   SELECT * FROM documents;
   ```

2. **phpMyAdmin (if using XAMPP):**
   - Go to http://localhost/phpmyadmin
   - Click database → click table → browse

3. **MySQL Workbench:**
   - Free GUI tool from MySQL
   - Visual interface

### Q: Can I change the database schema later?

**A:** Yes! But you'll need to:
1. Update SQL CREATE TABLE statements
2. Update TypeScript interfaces in `types.ts`
3. Update controllers if query structure changes

---

## Development Questions

### Q: My code changed but I don't see updates. Why?

**A:** 
- **Backend:** `nodemon` should auto-restart. Check terminal for errors
- **Frontend:** Next.js should auto-reload. Try hard refresh (Ctrl+Shift+R)
- If still stuck, restart both servers

### Q: How do I stop the servers?

**A:** In the terminal running the server, press `Ctrl + C`

### Q: I got a TypeScript error. Should I ignore it?

**A:** No! TypeScript errors mean something is wrong:
- Missing import
- Wrong property name
- Type mismatch

Read the error message carefully - it usually tells you exactly what's wrong.

### Q: Can I use JavaScript instead of TypeScript?

**A:** You can, but it's not recommended for this assignment. The guides are written for TypeScript, and it's specifically required.

---

## Feature Questions

### Q: Do I need to actually upload files?

**A:** No! The assignment says "Actual file upload implementation is not required." You just:
- Enter document metadata (name, type, size)
- Store it in database
- No actual file storage needed

### Q: How do I calculate file size in bytes?

**A:** Just make up reasonable numbers:
- Small file (txt): 512 or 1024 bytes
- Medium file (pdf): 2048 or 4096 bytes  
- Large file (video): 1048576 (1 MB)

Or use an actual file for reference:
- Windows: Right-click file → Properties → Size in bytes

### Q: Is the search functionality required or bonus?

**A:** It's marked as BONUS in the requirements. Do it if you have time - it impresses evaluators!

### Q: Can I add extra features?

**A:** After completing all required features, you can add:
- Delete documents/folders
- Edit names
- File type icons
- Date/size sorting
- Pagination

But **complete the basics first!**

---

## Submission Questions

### Q: What should I include in my GitHub repository?

**A:** Include:
- ✅ All backend code
- ✅ All frontend code
- ✅ README.md with setup instructions
- ✅ .gitignore files
- ❌ NOT node_modules/
- ❌ NOT .env file
- ❌ NOT dist/ or build/

### Q: Should I include the database dump?

**A:** Good idea! Create a file `database.sql` with:
```sql
CREATE DATABASE documents_management;
USE documents_management;

CREATE TABLE folders (...);
CREATE TABLE documents (...);

INSERT INTO folders VALUES (...);
INSERT INTO documents VALUES (...);
```

### Q: How do I make my README look good?

**A:** Use the provided `README_TEMPLATE.md` and:
- Add screenshots (use Windows Snipping Tool)
- Use proper Markdown formatting
- Include clear step-by-step instructions
- Test your instructions by following them yourself

### Q: What if my code isn't perfect?

**A:** That's okay! Evaluation criteria include:
- **Completeness** - Does it work? ✅
- **Code Quality** - Is it clean and organized? ✅
- **Performance** - Is it reasonably fast? ✅
- **UI** - Is it usable? ✅
- **Documentation** - Can someone set it up? ✅

Perfect code isn't required. Working code with good documentation is great!

---

## Troubleshooting Questions

### Q: I get "npm: command not found" error

**A:** Node.js/npm isn't installed or not in PATH:
1. Download Node.js from https://nodejs.org/
2. Install it
3. Restart PowerShell
4. Try `node --version` again

### Q: I get "Access denied for user 'root'@'localhost'"

**A:** Wrong MySQL password in `.env` file:
1. Open `.env`
2. Check `DB_PASSWORD=your_password`
3. Make sure it matches your MySQL root password

### Q: I get "EADDRINUSE" error

**A:** Port is already in use:
```
Error: listen EADDRINUSE: address already in use :::3001
```
Solutions:
1. Find and stop the other program using that port
2. Change PORT in `.env` to 3002 or another number

### Q: Frontend can't find backend (404 errors)

**A:** Check:
1. Backend URL in `api.ts` is `http://localhost:3001/api`
2. Backend is actually running
3. CORS is enabled in backend (should be in the guide)

### Q: "Module not found" errors

**A:** Missing dependencies:
```bash
# In the folder with the error:
npm install

# If that doesn't work:
rm -rf node_modules
npm install
```

---

## Performance Questions

### Q: How many folders/documents can it handle?

**A:** For this assignment:
- Up to 100 folders: ✅ Perfect
- Up to 1000 documents: ✅ Good
- More: Consider adding pagination

### Q: Does it need to be production-ready?

**A:** No, it's a learning assignment. But good practices:
- Error handling ✅ (included in guides)
- Input validation ✅ (included in guides)
- Clean code ✅ (guides follow best practices)
- Security basics ✅ (environment variables, parameterized queries)

---

## Next Steps Questions

### Q: What should I learn after completing this?

**A:** Next level skills:
1. **Authentication** - User login/signup
2. **Authorization** - Different user roles
3. **File Upload** - Actual file storage (AWS S3, local storage)
4. **Testing** - Jest, React Testing Library
5. **Deployment** - Vercel (frontend), Railway (backend)
6. **Advanced Features** - Real-time updates, WebSockets

### Q: Can I use this project in my portfolio?

**A:** Absolutely! After submitting:
- Add more features
- Improve styling
- Deploy it live
- Showcase on your resume

### Q: Where can I learn more?

**A:** Great resources:
- **Next.js:** https://nextjs.org/learn
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Express:** https://expressjs.com/
- **MySQL:** https://dev.mysql.com/doc/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## Still Have Questions?

**Don't hesitate to ask!** Tell me:
1. What you're trying to do
2. What error you're getting (full error message)
3. What you've already tried

I'm here to help you succeed! 🚀
