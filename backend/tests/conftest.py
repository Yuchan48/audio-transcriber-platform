# This file sets up fixtures for testing the FastAPI backend application.
import os
import sys
from pathlib import Path
from typing import Callable, TYPE_CHECKING, Any

import pytest
from sqlalchemy.orm import Session

if TYPE_CHECKING:
    from fastapi.testclient import TestClient


# Ensure backend root is importable when running pytest from repository root.
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


# The returned dict provides paths that tests can use for database and uploads.
@pytest.fixture(scope="session")
def setup_test_env(tmp_path_factory: pytest.TempPathFactory) -> dict[str, str]:
    # Create temporary directories for the test database and uploads
    db_dir = tmp_path_factory.mktemp("db")
    uploads_dir = tmp_path_factory.mktemp("uploads")
    db_path = db_dir / "test.sqlite3"

    # Set environment variables for the test database and app configuration.
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"
    os.environ["SECRET_KEY"] = "test-secret-key"
    os.environ["ALGORITHM"] = "HS256"
    os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
    os.environ["DEMO_EMAIL"] = "demo@example.com"
    os.environ["DEMO_PASSWORD"] = "demopassword"
    os.environ["ADMIN_EMAIL"] = "admin@example.com"
    os.environ["ADMIN_PASSWORD"] = "adminpassword"
    os.environ["FRONTEND_ORIGINS"] = "https://testserver"

    return {
        "database_url": os.environ["DATABASE_URL"],
        "uploads_dir": str(uploads_dir),
    }


# creates a fresh test database schema for the entire test session and provides access to db modules
@pytest.fixture(scope="session")
def db_modules(setup_test_env: dict[str, str]):
    import app.db.session as db_session_module
    import app.models.models as models_module

    # Ensure a clean schema state for this isolated test database session.
    db_session_module.Base.metadata.drop_all(bind=db_session_module.engine)
    db_session_module.Base.metadata.create_all(bind=db_session_module.engine)

    yield db_session_module, models_module
    db_session_module.Base.metadata.drop_all(bind=db_session_module.engine)


# Provides a fresh database session for each test, ensuring proper cleanup after use.
@pytest.fixture()
def db_session(db_modules):
    db_session_module, models_module = db_modules
    session: Session = db_session_module.SessionLocal()

    try:
        yield session
    finally:
        session.close()


# Automatically clean database tables after each test to ensure test isolation.
@pytest.fixture(autouse=True)
def clean_db_per_test(db_modules):
    db_session_module, models_module = db_modules
    session: Session = db_session_module.SessionLocal()
    try:
        # Isolate each test by clearing rows in FK-safe order.
        session.query(models_module.Transcription).delete()
        session.query(models_module.AudioFile).delete()
        session.query(models_module.User).delete()
        session.commit()
        yield
    finally:
        session.close()


# Returns the FastAPI app instance
@pytest.fixture(scope="session")
def test_app(setup_test_env: dict[str, str], db_modules):
    import app.main as main_module

    return main_module.app


# Provides an app instance with overridden dependencies for testing
@pytest.fixture()
def app_with_overrides(test_app, db_modules, tmp_path, monkeypatch):
    db_session_module, _ = db_modules

    import app.api.audio as audio_api
    import app.api.auth as auth_api
    import app.api.user as user_api

    app = test_app

    # Disable startup admin mutation during tests.
    monkeypatch.setattr("app.main.init_admin_if_not_exists", lambda db: None)

    # Use per-test upload dir and disable external background transcription call.
    upload_dir = tmp_path / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)
    monkeypatch.setattr(audio_api, "BASE_DIR", upload_dir)

    # Simulates the transcription function without making external API calls.
    async def _noop_transcribe(audio_file_id: int) -> None:
        return None

    # Override the actual transcription function with the no-op version for testing.
    monkeypatch.setattr(audio_api, "transcribe_audio", _noop_transcribe)

    # Override the get_db dependency to provide a session from the test database for all API routes.
    def override_get_db():
        test_db = db_session_module.SessionLocal()
        try:
            yield test_db
        finally:
            test_db.close()

    # Override every concrete get_db reference used by Depends(...) in routers.
    app.dependency_overrides[db_session_module.get_db] = override_get_db
    app.dependency_overrides[audio_api.get_db] = override_get_db
    app.dependency_overrides[auth_api.get_db] = override_get_db
    app.dependency_overrides[user_api.get_db] = override_get_db

    try:
        yield app
    finally:
        app.dependency_overrides.clear()


# Provides a TestClient instance for making API requests in tests
@pytest.fixture()
def test_client_cls():
    # FastAPI TestClient requires httpx via starlette.testclient.
    pytest.importorskip("httpx")
    from fastapi.testclient import TestClient

    return TestClient


# Provides an authenticated TestClient instance for testing protected routes
@pytest.fixture()
def client(app_with_overrides, test_client_cls):
    # Use https base URL so Secure cookies are sent by the test client.
    with test_client_cls(app_with_overrides, base_url="https://testserver") as c:
        yield c


# Helper fixture to register a user and return their credentials for testing authentication.
@pytest.fixture()
def register_user(client: Any) -> Callable[[str, str], dict]:
    def _register(
        email: str = "user@example.com", password: str = "password123"
    ) -> dict:
        response = client.post(
            "/api/auth/register",
            json={"email": email, "password": password},
        )
        assert response.status_code == 200
        return response.json()

    return _register


# Provides an authenticated client by registering a user and logging in to obtain auth cookies.
@pytest.fixture()
def authenticated_client(client: Any, register_user) -> Any:
    register_user("auth-user@example.com", "password123")
    login_response = client.post(
        "/api/auth/login",
        json={"email": "auth-user@example.com", "password": "password123"},
    )
    assert login_response.status_code == 200
    return client


# Provides an admin user in the database for testing admin-only routes.
@pytest.fixture()
def admin_user(db_session, db_modules) -> dict[str, str]:
    _, models_module = db_modules
    from app.core.security import hash_password

    admin_email = "admin-test@example.com"
    admin_password = "adminpassword123"

    admin = models_module.User(
        email=admin_email,
        hashed_password=hash_password(admin_password),
        role="admin",
    )
    db_session.add(admin)
    db_session.commit()

    return {"email": admin_email, "password": admin_password}
