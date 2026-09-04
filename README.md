# 🔊 AI-Driven Audio Transcriber Platform

A full-stack, self-hosted SaaS platform for **real-time AI audio transcription**, featuring secure authentication, role-based access control, file management, background processing, real-time updates, automated testing, and production deployment.

**Frontend:** React + TypeScript + Vite
**Backend:** FastAPI + PostgreSQL
**Transcription:** Deepgram API

## 🔑 Demo

🚀 **[Live Demo](https://audio-transcriber.duckdns.org)**

Use the demo account to explore:

- Upload audio files and view real-time transcription progress
- Record audio directly in the browser (up to 30 seconds)
- View and delete uploaded files
- View completed transcriptions and play audio

<img width="500" alt="Dashboard" src="https://github.com/user-attachments/assets/d02db83e-e168-48c7-875d-c05a15ff9863" />

<br>

> ⚠️ For the best demo experience, use short audio clips (≤30 seconds).

## 🚀 Features

- **Audio Management:** Upload and browser-based recording with support for MP3, WAV, M4A, MP4, and WEBM files, with configurable file size and user limits.
- **Real-Time Transcription:** Background processing through FastAPI `BackgroundTasks`, Deepgram API integration, and WebSocket-based status updates.
- **Playback & Transcripts:** Play completed recordings and view their generated transcripts.
- **Admin Management:** Administrators can manage users and audio files across the system.

## 🔐 Authentication & Security

- JWT authentication with HTTP-only cookies
- Google OAuth integration
- Role-based access control for users and admins
- Server-side authorization and file ownership checks
- Protected API endpoints
- HTTPS with Nginx and Let's Encrypt
- Security headers including HSTS and `X-Frame-Options`

## 🛠 Tech Stack

| Layer        | Technology                                       |
| ------------ | ------------------------------------------------ |
| Frontend     | React (Vite), TypeScript, TailwindCSS            |
| Backend      | FastAPI, Python, JWT, Google OAuth, WebSockets   |
| Database     | PostgreSQL, SQLAlchemy, Alembic                  |
| External API | Deepgram                                         |
| Testing      | Vitest, pytest, Playwright                       |
| Deployment   | Docker Compose, Nginx, Linux VPS, GitHub Actions |

## 🏗 Architecture

```text
Browser
   │
   ▼
 Nginx
   │
   ├── React / Vite frontend
   │
   ├── REST API ──────────► FastAPI
   │                          │
   │                          ├── PostgreSQL
   │                          ├── File Storage
   │                          └── Deepgram API
   │
   └── WebSocket ─────────► FastAPI
```

The application uses Nginx as a reverse proxy for the frontend, REST API, and WebSocket connections.

Transcription is handled through FastAPI background tasks so that the upload request is not blocked while audio is being processed.

## ⚙️ Development Setup

### Prerequisites

- Docker
- Docker Compose

### 1. Clone the repository

```bash
git clone <repository-url>
cd audio-transcriber-platform
```

### 2. Configure environment variables

Review the `.env.example` files in the root, `frontend`, and `backend` directories and create the corresponding `.env` files with your configuration.

Do not commit `.env` files or API credentials.

### 3. Run the Application

Start the application with Docker Compose:

```bash
docker compose up -d --build
```

The application is served through Nginx.

### 4. Run Tests

The project includes unit, integration, and end-to-end tests.

#### Frontend Unit and Integration Tests

```bash
cd frontend
npm test
```

#### Backend Tests

```bash
cd backend
pytest
```

#### End-to-End Tests

Start the E2E environment:

```bash
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up -d --build
```

Then run the Playwright tests:

```bash
cd frontend
npm run test:e2e
```

The Playwright E2E suite covers:

- Demo account login
- Unauthenticated dashboard access
- Invalid login credentials
- Audio upload
- Audio deletion

E2E tests are located in:

```text
frontend/e2e/demo-account-flow.spec.ts
```

## ⚠️ Current Limitations

- Transcription currently uses FastAPI `BackgroundTasks`; a durable task queue would be more suitable for larger-scale deployments.
- WebSocket state is process-local and would require additional infrastructure for horizontal scaling.
- CSRF protection is not currently implemented.

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

<img width="450" alt="Login" src="https://github.com/user-attachments/assets/fa94ff60-26fe-4a26-9d70-2c03e3e1d3f0" />
