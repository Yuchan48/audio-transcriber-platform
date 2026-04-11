# Day 1 – Project Initialization, Database Setup & Authentication Implementation

## Summary

Initialized the Audio Transcriber Platform project as a production-ready full-stack SaaS-style audio transcription system. Set up PostgreSQL database, created initial SQLAlchemy models, and implemented user authentication with JWT stored in HTTP-only cookies. Verified authentication flows using Postman.

## Development Implementation

- **Project Setup**
  - Initialized FastAPI backend with virtual environment.
  - Created folder structure:
    ```
    backend/
      app/
        api/
        core/
        db/
        models/
        schemas/
        services/
      uploads/
      main.py
    ```
  - Added `.gitignore` for `venv`, `__pycache__`, `.env`, and uploaded audio files.

- **Database Setup**
  - Installed PostgreSQL via Homebrew: `brew install postgresql`
  - Started PostgreSQL service: `brew services start postgresql`
  - Created database `audio_transcriber` and connected via SQLAlchemy.
  - Implemented `users` table with fields:
    - `id`, `email`, `hashed_password`, `created_at`
  - Resolved bcrypt 72-byte limitation by fixing package versions:
    - `bcrypt 4.0.1`, `passlib 1.7.4`

- **Authentication Implementation**
  - Implemented `hash_password()` and `verify_password()` utilities using Passlib.
  - Implemented JWT utilities with `python-jose`:
    - `create_access_token(data)` → generates JWT
    - `decode_access_token(token)` → verifies and decodes JWT
  - Created Pydantic schemas for registration, login, and user output.
  - Developed `/auth/register` endpoint:
    - Registers new users
    - Hashes passwords before storing
    - Returns user info (id, email)
  - Developed `/auth/login` endpoint:
    - Verifies credentials
    - Sets HTTP-only `access_token` cookie
  - Developed `/auth/me` endpoint:
    - Returns currently authenticated user
    - Validates JWT from cookie
  - Developed `/auth/logout` endpoint:
    - Clears `access_token` cookie
    - Endpoint uses `POST` method to conform with RESTful principles

- **Testing with Postman**
  - Verified user registration (`/auth/register`)
  - Verified login sets HTTP-only cookie (`/auth/login`)
  - Verified authenticated requests via cookie (`/auth/me`)
  - Verified logout clears cookie and prevents access (`/auth/logout`)

## Issues Encountered

- Bcrypt `ValueError: password cannot be longer than 72 bytes`
  - Resolved by locking versions: `bcrypt 4.0.1`, `passlib 1.7.4`
- Initial confusion on HTTP-only cookie testing in Postman
  - Resolved by inspecting cookie tab and ensuring login request sets `access_token`
- Repetition of JWT validation in each route
  - Planned refactor to use `Depends(get_current_user)` to remove duplicate validation

# Day 2 – Audio Management & DeepGram Integration

## Summary

Implemented full audio management functionality in FastAPI. Added audio upload, deletion, and pagination. Integrated real DeepGram transcription API. Developed admin endpoints to view all users and files. Verified background tasks and user-based access control. Tested all flows using Postman to ensure robust per-user data isolation.

## Development Implementation

- **Audio Upload Endpoint**
  - Created `/audio/upload` POST route with FastAPI `UploadFile`.
  - Stored uploaded files in `/uploads` directory.
  - Saved metadata in PostgreSQL `audio_files` table with initial status `"uploaded"`.
  - Triggered transcription asynchronously using `BackgroundTasks`.

- **DeepGram Integration**
  - Replaced simulated transcription with real API calls.
  - Dynamically determined `Content-Type` using Python `mimetypes` for `.mp3`, `.wav`, `.flac`.
  - Implemented error handling and logging for failed transcription attempts.
  - Verified transcription success updates `status="completed"` in database.

- **Delete Audio Functionality**
  - Added `/audio/{audio_id}` DELETE route.
  - Ensured only the owner can delete their files.
  - Removed audio file from `/uploads` and related `Transcription` records from database.
  - Confirmed proper cleanup and status updates.

- **Admin Endpoints**
  - Added `/admin/users` and `/admin/audio` GET endpoints.
  - Admins can view all users and all audio files.
  - Restricted access to users with `role="admin"`.

- **Pagination**
  - Added `skip` and `limit` query parameters to `/audio/` GET route.
  - Default limit 20, maximum 100 per request.
  - Ensured smooth handling of large audio file lists for dashboard display.

- **Testing & Debugging**
  - Used Postman to test:
    - Uploading audio files
    - Retrieving paginated audio lists
    - Deleting files as owner and verifying permissions
    - Admin routes access control
    - Real DeepGram transcription flow
  - Resolved environment variable issues to correctly load new DeepGram API key.

## Issues Encountered

- DeepGram API failed with old credentials — fixed by generating a new key and ensuring `.env` loads correctly.
- Some audio files initially failed due to incorrect MIME type headers — fixed using dynamic MIME detection and normalization.
- Background task exceptions were previously swallowed — added logging for easier debugging.

# Day 3 – Frontend Implementation & CORS Configuration

## Summary

Implemented the frontend for the Audio Transcriber Platform using React + Vite + TailwindCSS. Added login, registration, and protected dashboard routes with form validation, loading/error states, and smooth navigation. Enabled CORS in the backend to allow cross-origin requests with http-only cookies.

## Development Implementation

- **CORS Middleware in FastAPI**
  - Added `CORSMiddleware` in `main.py` to allow requests from the Vite frontend (`http://localhost:5173`).
  - Configured `allow_credentials=True` to support http-only cookie authentication.
  - Allowed all methods and headers to ensure preflight OPTIONS requests pass.

- **Authentication Pages**
  - Created **Login** and **Register** pages with input validators for email and password.
  - Implemented loading indicators and error messages for better UX.
  - Success flows:
    - Register → redirect to Login page
    - Login → redirect to Dashboard page

- **Protected Routes**
  - Implemented `ProtectedRoutes.jsx` to restrict access to authenticated users only.
  - Redirect unauthenticated users to login page.

- **Auth Services & API Client**
  - Created `authService.js` for login, logout, register, and fetching current user.
  - Added `apiFetch.js` utility to automatically include cookies for requests.
  - Ensured consistent error handling for API calls.

- **Frontend Utilities**
  - `inputValidators.js` for email/password validation across login and register forms.

- **Navigation & State Management**
  - Used React `useState` and `useEffect` hooks to manage authentication state.
  - Smooth redirection after login/register with state updates.

## Issues Encountered

- Preflight OPTIONS requests from React caused 405 errors until CORS middleware was properly configured.
- Ensured `credentials: "include"` in fetch calls to send cookies for http-only authentication.

# Day 4 – Dashboard Implementation, Services, and WebSocket Setup

## Summary

Implemented the main **Dashboard** for users, including audio file management and initial WebSocket setup. Created frontend services for fetching user and audio data. Troubleshot WebSocket connection issues in development, ultimately resolving them by including the WS router in the backend, installing `uvicorn[standard]`, and removing React Strict Mode to avoid double connections.

## Development Implementation

- **Dashboard Page**
  - Built Dashboard layout for users.
  - Displayed audio file list with filename, status, and actions (delete, play, transcription).
  - Integrated protected route so only authenticated users can access the Dashboard.

- **Frontend Services**
  - `userService.js`:
    - `fetchCurrentUser()` – fetches logged-in user info.
    - `fetchAllUser()` – admin endpoint to fetch all users.
  - `audioService.js`:
    - `getAudioFiles()` – fetch user's audio files.
    - `uploadAudioFile()` – handles audio file upload.
    - `deleteAudioFile()` – deletes a user audio file.
    - `fetchAllAudioFiles()` – admin endpoint to fetch all audio files.

- **WebSocket Setup**
  - Added `/ws` router to backend and installed `uvicorn[standard]` to enable WebSocket support.
  - Initial connection failed due to missing router and package, and React Strict Mode caused double connections.
  - After fixes, WebSocket successfully connects, laying groundwork for real-time transcription updates.
  - Confirmed per-user connection can be tracked in `active_connections` dictionary on backend.

- **Issues Encountered**
  - WebSocket connection failed initially due to:
    - Missing inclusion of WS router in FastAPI backend.
    - Uvicorn installed without `[standard]` extras.
    - React Strict Mode creating double connection attempts.
  - Resolved by including router, installing required package, and disabling Strict Mode in frontend development.

# Day 5 – Role-Based Access, UI Refactor, and Upload Improvements

## Summary

Improved backend security and frontend UX by introducing strict role-based access control, automatic admin initialization, and a full UI refactor. Enhanced file upload experience with drag-and-drop support and improved mobile responsiveness across the dashboard.

## Development Implementation

- **Backend Security & Roles**
  - Added `init_admin_if_not_exist` on server startup to ensure a single system admin.
  - Strengthened role-based access control across all endpoints.
  - Refactored API structure:
    - `/api/auth.py` – register, login, logout
    - `/api/user.py` – current user, admin user list, delete user (self/admin rules)
    - `/api/audio.py` – user audio CRUD + admin global access
  - Added cascading deletes between users, audio files, and transcriptions.

- **Frontend Improvements**
  - Implemented drag-and-drop audio upload with manual fallback.
  - Refactored dashboard for better UX and mobile responsiveness.
  - Added sidebar navigation with role-based rendering (user/admin views).
  - Navbar displays user email and logout action.

- **Dashboard Features**
  - My Files: upload + audio list + delete
  - Admin Users: user list with restricted delete
  - Admin Audio: global audio overview with user email + status

## Issues Encountered

- Required strict backend validation for admin-only routes.
- Adjusted cascade delete logic to prevent unintended data loss.
- Iterative UI fixes for mobile sidebar responsiveness.

# Day 6 – WebSocket Stabilization, Audio Playback, and UX Improvements

## Summary

Improved real-time transcription reliability by fixing WebSocket async/thread handling using AnyIO, enabling stable per-user updates. Enhanced user experience by adding audio playback + transcription viewing, in-app audio recording, and UI interaction fixes for expandable audio items. The platform is now significantly more demo-ready for recruiter evaluation.

## Development Implementation

- **WebSocket Stability Fix**
  - Resolved issue where backend updates were not reaching the frontend.
  - Root cause was incorrect async event loop handling between background threads and FastAPI WebSocket.
  - Replaced `asyncio.run_coroutine_threadsafe` approach with `anyio.from_thread.run`, ensuring correct event loop execution.
  - Confirmed stable per-user WebSocket handling for multi-user environment.

- **Audio Playback & Transcription View**
  - Added endpoints:
    - `GET /audio/{audio_id}/file`
    - `GET /audio/{audio_id}/transcription`
  - Implemented expandable UI in both user and admin dashboards.
  - Audio details (player + transcript) are only accessible when status is `completed`.

- **Audio Recording Feature**
  - Integrated browser `MediaRecorder API`.
  - Added record button with 30-second limit for quick testing.
  - Enables recruiters to test transcription flow without uploading external files.

- **Frontend UX Improvements**
  - Added toggle expand/collapse for each audio item.
  - Fixed interaction bug where delete button triggered parent click event.
  - Resolved using `e.stopPropagation()` to isolate delete action.
  - Improved usability for audio list interaction.

- **File Handling Improvements**
  - Implemented UUID-based filenames to prevent collisions in uploads.
  - Ensures safe multi-user file storage without overwriting conflicts.

## Issues Encountered

- WebSocket updates initially failed due to incorrect event loop usage in background tasks.
- Expandable UI bug caused unintended API calls when deleting audio items.
- Duplicate filename issue resolved using UUID-based naming strategy.

## Next Steps

- Improve real-time UX (progress indicator during transcription)
- Enhance UI/UX polish (loading states, skeleton UI, responsiveness)
- Optional: add WebSocket-based live transcription progress updates
- Prepare deployment configuration (Nginx + VPS setup)
- Polish admin dashboard for portfolio presentation
