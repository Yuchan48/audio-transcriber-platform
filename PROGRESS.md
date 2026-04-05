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
