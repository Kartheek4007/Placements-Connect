# Placements-Connect

Build a full-stack Placement Management System using FastAPI, React, and Supabase. The system has two roles: Super Admin (Placement Officer) and Students.

Admin can create companies, post placement drives, upload JDs, add application links (Google Forms), update drive stages, upload results, and monitor student applications.

Students can register, complete profile, upload resume, view drives, apply externally, mark "Applied", track stage updates, and see results.

Includes role-based authentication, PostgreSQL via Supabase, SQLAlchemy ORM, JWT auth, Supabase storage for files, real-time notifications, analytics dashboard, and clean React UI with protected routes.

## How to Run

1. **Start Backend**:
   ```bash
   cd backend
   .\venv\Scripts\Activate.ps1
   uvicorn app.main:app --reload
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

Open `http://localhost:5173` in your browser. Default Swagger UI is at `http://localhost:8000/docs`.
