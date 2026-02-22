<div align="center">
  
  # 🎓 Placement Connect
  
  <p align="center">
    <strong>A Premium & Modern Campus Placement Management System 🚀</strong>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  </p>

</div>

---

## ✨ Overview

**Placement Connect** is a full-stack, glassmorphic web application built to streamline the recruitment process between colleges, students, and companies. Designed with a **state-of-the-art aesthetic UI** and powered by a highly concurrent backend architecture.

The platform eliminates the need for manual tracking, reducing complexity for the **Placement Officer (Super Admin)**, while giving **Students** a highly interactive and intuitive dashboard to manage their placement journeys.

---

## 🌟 Key Features

### 🧑‍💻 Admin Panel (Placement Officer)
- **Company & Drive Management**: Effortlessly onboard companies and schedule placement drives.
- **Drive Stages**: Define dynamic stages (Aptitude, GD, Technical Interview, Final HR).
- **Application Tracking**: Monitor applications and update real-time candidate statuses.
- **Results Management**: Upload shortlists, final selects, and distribute results.
- **Analytics Dashboard**: Get high-level, real-time insights of placement statistics.

### 🎓 Student Dashboard
- **Immersive Profile Management**: Keep track of academic data, CGPA, and upload latest resumes.
- **Opportunity Discovery**: View exclusive, upcoming, and active placement drives.
- **Live Tracking**: Instantly monitor the status of every application submitted.
- **Seamless Integrations**: External application links, job descriptions, and CTC metadata available at a glance.

---

## 🛠️ Architecture & Tech Stack

Placement Connect uses a decoupled client-server architecture to ensure high performance and scalability.

### **Frontend (Client)**
- **React.js (Vite)** – Lightning fast HMR and optimized production builds.
- **Tailwind CSS v4** – Premium **Glassmorphism**, dynamic gradients, and native dark mode.
- **React Router** – Protected role-based navigation.
- **Lucide Icons & Framer Motion** – Clean SVG iconography and subtle micro-animations.

### **Backend (API)**
- **FastAPI (Python)** – Asynchronous, highly performant REST framework.
- **SQLAlchemy (ORM) + Alembic** – Reliable database models and schema migrations.
- **JWT (JSON Web Tokens)** – Secure, stateless role-based authentication (`admin` / `student`).
- **PostgreSQL via Supabase** – Enterprise-grade managed cloud database.
- **Supabase Storage** – Cloud, bucket-based storage for Resume PDFs and JDs.

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL Database credentials

### 1. Backend Setup (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (Windows)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server (Default: http://localhost:8000)
uvicorn app.main:app --reload
```
*API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

### 2. Frontend Setup (React)

```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server (Default: http://localhost:5173)
npm run dev
```

### 3. Initialize Demo Data
A robust seed script is included to quickly populate the database with test users, companies, and drives. Make sure the backend virtual environment is active:
```bash
python seed.py
```

### 🔐 Demo Credentials

Use these to login from the UI at [http://localhost:5173](http://localhost:5173):

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@example.com` | `admin123` |
| **Student** | `student@example.com` | `student123` |

---

## 🎨 Design Philosophy
The UI was meticulously crafted with an emphasis on:
- **Depth & Dimension**: Layered glassmorphic cards and floating nav-bars.
- **Responsive Layouts**: Fully fluid grids using modern CSS techniques.
- **Subtle Motion**: Fade-in transitions for a polished feel.
- **Dark Elegance**: A highly tuned, professional deep-space color palette (`primary: #3b82f6`, `accent: #8b5cf6`).

---

<div align="center">
  <p>Built with ❤️ for Campus Placements.</p>
</div>
