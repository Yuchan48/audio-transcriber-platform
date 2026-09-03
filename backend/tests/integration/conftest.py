import os
from typing import Callable, TYPE_CHECKING, Any

import pytest
from sqlalchemy.orm import Session

if TYPE_CHECKING:
    from fastapi.testclient import TestClient


# The returned dict provides paths that tests can use for database and uploads.
@pytest.fixture(scope="session")
def setup_test_env(tmp_path_factory: pytest.TempPathFactory) -> dict[str, str]:
    db_dir = tmp_path_factory.mktemp("db")
    uploads_dir = tmp_path_factory.mktemp("uploads")
    db_path = db_dir / "test.sqlite3"

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


@pytest.fixture(scope="session")
def db_modules(setup_test_env: dict[str, str]):
    import app.db.session as db_session_module
    import app.models.models as models_module

    db_session_module.Base.metadata.drop_all(bind=db_session_module.engine)
    db_session_module.Base.metadata.create_all(bind=db_session_module.engine)

    yield db_session_module, models_module

    db_session_module.Base.metadata.drop_all(bind=db_session_module.engine)


@pytest.fixture()
def db_session(db_modules):
    db_session_module, models_module = db_modules
    session: Session = db_session_module.SessionLocal()

    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def clean_db_per_test(db_modules):
    db_session_module, models_module = db_modules
    session = db_session_module.SessionLocal()

    try:
        session.query(models_module.Transcription).delete()
        session.query(models_module.AudioFile).delete()
        session.query(models_module.User).delete()
        session.commit()
        yield
    finally:
        session.close()


@pytest.fixture(scope="session")
def test_app(
    setup_test_env: dict[str, str],
    db_modules,
):
    import app.main as main_module

    return main_module.app


@pytest.fixture()
def app_with_overrides(
    test_app,
    db_modules,
    tmp_path,
    monkeypatch,
):
    db_session_module, _ = db_modules

    import app.api.audio as audio_api
    import app.api.auth as auth_api
    import app.api.user as user_api

    app = test_app

    monkeypatch.setattr(
        "app.main.init_admin_if_not_exists",
        lambda db: None,
    )

    upload_dir = tmp_path / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)

    monkeypatch.setattr(
        audio_api,
        "BASE_DIR",
        upload_dir,
    )

    async def _noop_transcribe(audio_file_id: int) -> None:
        return None

    monkeypatch.setattr(
        audio_api,
        "transcribe_audio",
        _noop_transcribe,
    )

    def override_get_db():
        test_db = db_session_module.SessionLocal()

        try:
            yield test_db
        finally:
            test_db.close()

    app.dependency_overrides[db_session_module.get_db] = override_get_db

    app.dependency_overrides[audio_api.get_db] = override_get_db

    app.dependency_overrides[auth_api.get_db] = override_get_db

    app.dependency_overrides[user_api.get_db] = override_get_db

    try:
        yield app
    finally:
        app.dependency_overrides.clear()


@pytest.fixture()
def test_client_cls():
    pytest.importorskip("httpx")

    from fastapi.testclient import TestClient

    return TestClient


@pytest.fixture()
def client(app_with_overrides, test_client_cls):
    with test_client_cls(
        app_with_overrides,
        base_url="https://testserver",
    ) as c:
        yield c


@pytest.fixture()
def register_user(
    client: Any,
) -> Callable[[str, str], dict]:
    def _register(
        email: str = "user@example.com",
        password: str = "password123",
    ) -> dict:
        response = client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": password,
            },
        )

        assert response.status_code == 200

        return response.json()

    return _register


@pytest.fixture()
def authenticated_client(
    client: Any,
    register_user,
) -> Any:
    register_user(
        "auth-user@example.com",
        "password123",
    )

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "auth-user@example.com",
            "password": "password123",
        },
    )

    assert login_response.status_code == 200

    return client


@pytest.fixture()
def admin_user(
    db_session,
    db_modules,
) -> dict[str, str]:
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

    return {
        "email": admin_email,
        "password": admin_password,
    }
