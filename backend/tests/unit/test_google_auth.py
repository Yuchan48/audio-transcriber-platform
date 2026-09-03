from unittest.mock import patch

import pytest

from app.services.google_auth import verify_google_token


def test_verify_google_token_returns_user_data():
    google_user = {
        "email": "user@example.com",
        "sub": "google-user-123",
        "name": "Test User",
        "picture": "https://example.com/photo.jpg",
    }

    with patch(
        "app.services.google_auth.id_token.verify_oauth2_token",
        return_value=google_user,
    ):
        result = verify_google_token("valid-google-token")

    assert result == {
        "email": "user@example.com",
        "sub": "google-user-123",
        "name": "Test User",
        "picture": "https://example.com/photo.jpg",
    }


def test_verify_google_token_rejects_invalid_token():
    with patch(
        "app.services.google_auth.id_token.verify_oauth2_token",
        side_effect=Exception("Invalid token"),
    ):
        with pytest.raises(ValueError) as exc_info:
            verify_google_token("invalid-google-token")

    assert str(exc_info.value) == "Invalid Google token"
