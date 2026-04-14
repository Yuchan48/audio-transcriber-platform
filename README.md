# 🔊 Audio Transcriber Platform (Full-Stack SaaS)

### 🔑 Demo Access

🚀 [Live Demo](http://audio-transcriber.duckdns.org)

Recruiters can log in using a demo account directly from the app.

- Upload audio files and see real-time transcription progress.
- Record audio directly in the browser (up to 30 seconds).
- View completed transcriptions in the dashboard.

<br><br>

A full-stack, self-hosted audio transcription platform. This project demonstrates **user-centric SaaS development**, including secure authentication, file management, asynchronous processing, database design, and real-time updates. The backend uses **FastAPI + PostgreSQL**, the frontend is **React + Vite**, and transcription is powered by **DeepGram API**.

---

## ✨ Key Highlights

- 🔐 JWT authentication with HTTP-only cookies
- 🎵 Upload, record, delete, and manage audio files
- ⚡ Real-time transcription updates via WebSocket
- 🗄 PostgreSQL database for users, audio files, and transcriptions
- 👥 Admin dashboard with full system visibility
- 📦 Supports audio formats: **MP3, WAV, M4A, MP4, WEBM**
- ⏱ File limits: **max 5MB per file, max 20 files per user**
- 🎙 Built-in audio recorder (up to 30 seconds per clip)

---

## 🚀 Features

### Authentication & Roles

| Role      | Permissions                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**  | - Register & log in<br>- Upload/record audio<br>- View & delete own files<br>- See transcription status and text                                  |
| **Admin** | - All user permissions<br>- View all users and all audio files<br>- Delete any audio file or user<br>- Monitor system-wide transcription progress |

---

### Audio Management

- **Upload & Record:** Supports file upload + in-browser recording (MediaRecorder API)
- **Supported formats:** MP3, WAV, M4A, MP4, WEBM
- **Limits:** max 5MB per file, max 20 files per user
- **Delete files:** Users can delete their own files; admins can delete any file
- **Transcription:** Background task sends audio to DeepGram API and updates status in real time
- **Playback:** Completed files include built-in audio player + transcript viewer

> ⚠️ Note: For best demo experience, use short audio clips (≤30 seconds). Large files may fail depending on API limits.

---

### Dashboard & Real-Time Updates

- File list displays:
  - Filename
  - Status (`uploaded`, `processing`, `completed`, `failed`)
  - Audio playback (only when completed)
  - Transcription text (toggle expand view)
- Real-time updates powered by **FastAPI WebSockets**
- Users receive only their own updates
- Admin dashboard aggregates all users and files

---

## 🛠 Tech Stack

| Layer            | Technology                                    |
| ---------------- | --------------------------------------------- |
| **Frontend**     | React + Vite + TailwindCSS                    |
| **Backend**      | FastAPI, BackgroundTasks, JWT auth, WebSocket |
| **Database**     | PostgreSQL + SQLAlchemy + Alembic             |
| **External API** | DeepGram API                                  |
| **Deployment**   | Docker, Docker Compose, Nginx, Linux VPS      |

### 🧠 Why this stack?

Chosen to prioritize **speed of development, production readiness, and real-time capability**:

- **React + Vite** → Fast, modern frontend with efficient builds
- **FastAPI** → High-performance async backend with built-in WebSocket support
- **PostgreSQL** → Reliable relational data model for users, files, and transcriptions
- **Docker + Nginx** → Production-ready deployment with consistent environments
- **DeepGram API** → Eliminates ML complexity and enables focus on product engineering

---

## ⚙️ Security Considerations

- JWT stored in **HTTP-only cookies**
- Role-based access control (user/admin separation)
- Protected backend routes with dependency injection
- Admin endpoints restricted server-side (not frontend-only)
- File ownership enforced at database level

---

## 🏗 Architecture Notes

- Async transcription using FastAPI `BackgroundTasks`
- WebSocket-based per-user real-time updates
- File storage on server filesystem (`/uploads`)
- PostgreSQL relational schema:
  - users
  - audio_files
  - transcriptions
- Nginx used as reverse proxy for API + frontend

---

## 📌 Known Limitations

- WebSocket connections are in-memory (single-instance server)
- For scaling, Redis Pub/Sub or message broker is required
- DeepGram API limits apply for large or long audio files
- Demo environment optimized for short clips (≤30s)

---

## 🛠 Skills Demonstrated

- Full-stack development (React + FastAPI + PostgreSQL)
- JWT authentication with secure cookies
- Real-time systems using WebSockets
- Async background processing
- File upload & media handling
- Admin/user role-based system design
- Dockerized production deployment
- External API integration (DeepGram)

---

## 🔗 Live Demo

- 🌐 [http://audio-transcriber.duckdns.org](http://audio-transcriber.duckdns.org)
  - Demo login available for recruiters
  - Try upload / record / transcription flow

---

## 📸 Screenshots
