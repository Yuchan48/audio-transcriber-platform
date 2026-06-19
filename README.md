# 🔊 AI-Driven Audio Transcriber Platform (Full-Stack SaaS)

### 🔑 Demo Access

🚀 [Live Demo](https://audio-transcriber.duckdns.org)

Use the demo account to explore:

- Upload audio files and view real-time transcription progress.
- Record audio directly in the browser (up to 30 seconds per recording).
- View completed transcriptions in the dashboard.

<img width="500" alt="dashboard my files audio" src="https://github.com/user-attachments/assets/d02db83e-e168-48c7-875d-c05a15ff9863" />
<br><br>

A full-stack, self-hosted platform for **real-time AI transcription**. This project demonstrates **user-focused SaaS development**, including secure authentication, file management, asynchronous processing, database design, and real-time updates. The backend uses **FastAPI + PostgreSQL**, the frontend is **React + Vite**, and transcription is powered by **DeepGram API**.

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

## 🛠 Tech Stack

| Layer            | Technology                                                       |
| ---------------- | ---------------------------------------------------------------- |
| **Frontend**     | React + TypeScript + Vite + TailwindCSS                          |
| **Backend**      | FastAPI, JWT auth, Google OAuth, BackgroundTasks, WebSocket      |
| **Database**     | PostgreSQL + SQLAlchemy + Alembic                                |
| **External API** | DeepGram API                                                     |
| **Deployment**   | Docker, Docker Compose, Nginx, Linux VPS, GitHub Actions (CI/CD) |

---

## ⚙️ Security Considerations

- JWT stored in **HTTP-only cookies**
- Role-based access control (user/admin separation)
- Protected backend routes with dependency injection
- Admin endpoints restricted server-side (not frontend-only)
- File ownership enforced at database level

---

## 🏗 Architecture Philosophy

- Synchronous transcription managed via FastAPI `BackgroundTasks` to ensure non-blocking user sessions
- WebSocket-based per-user real-time updates and transcription delivery
- Deepgram transcription requests use timeout (30 seconds) + retry/backoff (3 times) handling to improve resilience against transient API/network failures
- File storage on server filesystem (`/uploads`)
- PostgreSQL relational schema:
  - users
  - audio_files
  - transcriptions
- Nginx used as reverse proxy for API + frontend

---

## 🛠 Skills Demonstrated

- Full-stack development (React + FastAPI + PostgreSQL)
- JWT authentication with secure HTTP-only cookies
- Google OAuth integration
- Real-time systems using WebSockets
- Synchronous background processing for AI workloads
- File upload & media handling
- Admin/user role-based system design
- Dockerized production deployment
- End-to-end AI integration (Deepgram API)
- Automated CI/CD workflows (GitHub Actions)

---

## ⚠️ Current Limitations / Future Improvements

- Background transcription currently uses FastAPI `BackgroundTasks`; Redis/Celery-style durable queues are planned for larger-scale deployments.
- WebSocket connection state is currently process-local and not horizontally distributed.
- CSRF protection is not yet implemented because the project is currently intended as a portfolio/demo deployment.

---

## 🔗 Live Demo

- 🌐 [https://audio-transcriber.duckdns.org](https://audio-transcriber.duckdns.org)
  - Demo login available for recruiters
  - Try upload / record / transcription flow

---

## 📸 Screenshots

<img width="450" alt="audio demo account" src="https://github.com/user-attachments/assets/4f42e740-e9b6-406c-9a8b-14139cbac425" />

<br>

<img width="300" alt="all users mobile" src="https://github.com/user-attachments/assets/90ead604-f58a-4b08-a347-f2c10c5172f2" />

<br>

<img width="300" alt="record audio mobile" src="https://github.com/user-attachments/assets/2b5bd7aa-5570-4f14-8d39-214e75681a9c" />

<br>

<img width="450" alt="All audio" src="https://github.com/user-attachments/assets/f0c48857-1941-4451-b0f9-41d549f0bd39" />

<br>

<img width="450" alt="audio demo account" src="https://github.com/user-attachments/assets/1a123f58-d5b2-42d2-8993-088f66fb309d" />

<br>

<img width="450" alt="audio login" src="https://github.com/user-attachments/assets/66f49788-1228-49ea-8a5c-d20980a48d26" />

<br>

<img width="450" alt="audio register" src="https://github.com/user-attachments/assets/e685c26d-08f8-455d-8e5b-2def0c7aeb18" />
