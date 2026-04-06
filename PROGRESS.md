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

## Next Steps

- Implement `/audio/upload` endpoint with file storage, PostgreSQL record creation, and BackgroundTasks for asynchronous transcription.
- Implement `get_current_user` dependency in routes to simplify authentication.
- Begin frontend integration with React/Vite to support login, upload, and file listing.
- Integrate DeepGram API for actual transcription in BackgroundTasks.

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

## Next Steps

- Implement WebSocket support for real-time transcription updates on the dashboard.
- Enhance frontend to reflect transcription progress dynamically.
- Continue testing multi-user flows and admin dashboard features.
