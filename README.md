# 🔊 Audio Transcriber Platform (Full-Stack SaaS)

### 🔑 Demo Access

🚀 [Live Demo](https://your-demo-url.com)

Recruiters can log in using a demo account directly from the app.

- Upload audio files and see real-time transcription progress.
- View completed transcriptions in the dashboard.
- Admin-level functionality is described in this README.

<img width="500" alt="dashboard" src="" />
<br><br>

A full-stack, self-hosted audio transcription platform. This project demonstrates **user-centric SaaS development**, including secure authentication, file management, asynchronous processing, database design, and real-time updates. The backend uses **FastAPI + PostgreSQL**, the frontend is **React + Vite**, and transcription is powered by **DeepGram API**.

---

## ✨ Key Highlights

- 🔐 JWT authentication with HTTP-only cookies
- 🎵 Upload, delete, and manage multiple audio files
- 🗄 PostgreSQL database for users, audio files, and transcriptions
- ⚡ Background transcription tasks using FastAPI `BackgroundTasks`
- 🌐 Real-time transcription status updates via WebSocket
- 👥 Admin role to view all users and audio files
- 📦 Supports multiple audio formats: **MP3, WAV, FLAC**

---

## 🚀 Features

### Authentication & Roles

| Role      | Permissions                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **User**  | - Register & log in<br>- Upload audio files<br>- View & delete own files<br>- See transcription status and text                       |
| **Admin** | - All user permissions<br>- View all users and audio files<br>- Delete any audio file<br>- Monitor system-wide transcription progress |

---

### Audio Management

- **Upload files:** MP3, WAV, FLAC (up to allowed size limit, default 5 MB for demo)
- **Delete files:** Users can delete their own files; admins can delete any file
- **Transcription:** Background task sends audio to DeepGram API and updates status in real-time via WebSocket
- **Dashboard:** Displays file list with filename, status (`uploaded`, `processing`, `completed`, `failed`), audio player, and transcription text

> ⚠️ Note: For large files, transcription may fail depending on API limits. Demo users should upload short audio clips (30–60 seconds) for reliable results.

---

### Dashboard & Real-Time Updates

- Audio file table shows:
  - Filename
  - Status (`uploaded`, `processing`, `completed`, `failed`)
  - Audio player
  - Transcription text (if completed)
- Real-time updates powered by **FastAPI WebSockets**. Users only see their own file updates.
- Admin dashboard shows all users and audio files in a single view.

---

## 🛠 Tech Stack

| Layer            | Technology & Purpose                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Frontend**     | React + Vite, responsive dashboard UI                                                    |
| **Backend**      | FastAPI, BackgroundTasks for async processing, JWT auth, WebSocket for real-time updates |
| **Database**     | PostgreSQL, SQLAlchemy ORM, Alembic migrations                                           |
| **External API** | DeepGram API for transcription                                                           |
| **Deployment**   | Linux VPS, Nginx (reverse proxy), Uvicorn/Gunicorn, SSL via Certbot                      |

**Why this stack?**

- FastAPI provides fast, async-friendly backend.
- React + Vite allows dynamic dashboard with minimal load time.
- PostgreSQL ensures relational integrity for users, files, and transcriptions.
- WebSocket enables real-time status updates without polling.

---

## ⚙️ Security Considerations

- JWT stored in **HTTP-only cookies** to prevent XSS attacks
- Role-based access control isolates user data
- Admin routes protected and only accessible to users with `role="admin"`
- Uploaded files stored securely on the server; no private keys or sensitive credentials in public storage

---

## 🏗 Architectural Philosophy

- **Modular design:** clear separation between backend, frontend, and transcription service
- **Async processing:** background tasks handle transcription without blocking API
- **Real-time UX:** dashboard updates dynamically via WebSocket
- **Production-ready deployment:** Nginx + Uvicorn/Gunicorn with SSL termination

---

## 📌 Known Limitations

- Transcription depends on DeepGram API limits (rate & file size).
- WebSocket connections are **per server instance** (in-memory) — for multi-instance deployments, a **Redis Pub/Sub** or message broker is required.
- Demo audio files should be **short (<1 minute)** for reliable transcription.

---

## 🛠 Skills Demonstrated

- Full-stack development (React + FastAPI + PostgreSQL)
- JWT authentication with HTTP-only cookies
- Async background tasks and error handling
- WebSocket implementation for real-time updates
- Admin and user role-based access control
- Production deployment on Linux with Nginx + Uvicorn/Gunicorn
- External API integration (DeepGram) and dynamic MIME type handling
- Writing maintainable, modular, and scalable code

---

## 🔗 Live Demo

- [Demo Dashboard](https://your-demo-url.com) – demo account available for recruiters
  Explore file upload, transcription, and real-time status updates.

---

## 📸 Screenshots

<img width="400" alt="dashboard" src="" />
<br>
<img width="400" alt="admin view" src="" />
